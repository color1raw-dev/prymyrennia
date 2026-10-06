// Примирення: web push for reminders. Deployed as the Supabase Edge Function "push" with JWT verification turned off;
// the function checks callers itself (signed-in user for sub/unsub/test, the cron key for run).
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info, x-cron-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const J = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const SUBJECT = "https://color1raw-dev.github.io/prymyrennia/";

async function cfg(k: string): Promise<string> {
  const { data } = await admin.from("push_config").select("v").eq("k", k).maybeSingle();
  return (data && data.v) || "";
}
// the VAPID key pair is created once, on first use, and kept in a table nobody but this function can read
async function keys() {
  let pub = await cfg("vapid_pub"), priv = await cfg("vapid_priv");
  if (!pub || !priv) {
    const k = webpush.generateVAPIDKeys();
    await admin.from("push_config").upsert([{ k: "vapid_pub", v: k.publicKey }, { k: "vapid_priv", v: k.privateKey }], { onConflict: "k", ignoreDuplicates: true });
    pub = await cfg("vapid_pub"); priv = await cfg("vapid_priv");
  }
  return { pub, priv };
}
async function userOf(req: Request) {
  const t = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!t) return null;
  const { data } = await admin.auth.getUser(t);
  const u = data && data.user;
  if (!u) return null;
  const { data: st } = await admin.from("staff").select("role").eq("user_id", u.id).maybeSingle();
  if (!st || ["owner", "full", "deacon"].indexOf(st.role) < 0) return null;
  return u;
}
type Sub = { endpoint: string; p256dh: string; auth: string; user_id: string };
async function send(sub: Sub, payload: unknown, k: { pub: string; priv: string }): Promise<boolean> {
  try {
    await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, JSON.stringify(payload),
      { TTL: 43200, urgency: "high", vapidDetails: { subject: SUBJECT, publicKey: k.pub, privateKey: k.priv } });
    return true;
  } catch (e) {
    const c = (e as { statusCode?: number }).statusCode;
    if (c === 404 || c === 410) await admin.from("push_subs").delete().eq("endpoint", sub.endpoint);
    return false;
  }
}
async function run() {
  const now = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Kyiv" });
  const day = now.slice(0, 10), hour = +now.slice(11, 13);
  if (hour < 8) return { day, hour, skipped: "before 8:00" };
  const { data: rems } = await admin.from("docs").select("id,data").eq("col", "reminders");
  const due = (rems || []).filter((r) => r.data && r.data.date === day && r.data.text);
  if (!due.length) return { day, due: 0, sent: 0 };
  const [{ data: staff }, { data: subs }, { data: done }] = await Promise.all([
    admin.from("staff").select("user_id,role").in("role", ["owner", "full", "deacon"]),
    admin.from("push_subs").select("endpoint,p256dh,auth,user_id"),
    admin.from("push_sent").select("rem_id,user_id").eq("day", day),
  ]);
  const ok = new Set((staff || []).map((s) => s.user_id));
  const lead = (staff || []).filter((s) => s.role !== "deacon").map((s) => s.user_id);
  const was = new Set((done || []).map((d) => d.rem_id + "|" + d.user_id));
  const k = await keys();
  let sent = 0;
  for (const r of due) {
    const targets: string[] = r.data.by && ok.has(r.data.by) ? [r.data.by] : lead;
    let who = "";
    if (r.data.pid) {
      const { data: p } = await admin.from("docs").select("data").eq("col", "people").eq("id", r.data.pid).maybeSingle();
      if (p && p.data) who = [p.data.last, p.data.first].filter(Boolean).join(" ");
    }
    for (const uid of targets) {
      if (was.has(r.id + "|" + uid)) continue;
      const mine = (subs || []).filter((s) => s.user_id === uid) as Sub[];
      if (!mine.length) continue;
      let any = false;
      for (const s of mine) if (await send(s, { title: "Нагадування", body: String(r.data.text).slice(0, 180) + (who ? " · " + who : ""), tag: "rem-" + r.id, url: "#reminders" }, k)) { any = true; sent++; }
      if (any) await admin.from("push_sent").upsert({ rem_id: r.id, day, user_id: uid }, { onConflict: "rem_id,day,user_id", ignoreDuplicates: true });
    }
  }
  return { day, due: due.length, sent };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const url = new URL(req.url);
    if (req.method === "GET") {
      if (url.searchParams.get("op") === "key") return J({ publicKey: (await keys()).pub });
      return J({ ok: true });
    }
    const b = await req.json().catch(() => ({}));
    if (b.op === "run") {
      const key = req.headers.get("x-cron-key") || "";
      if (!key || key !== (await cfg("cron"))) return J({ error: "forbidden" }, 403);
      return J(await run());
    }
    const u = await userOf(req);
    if (!u) return J({ error: "unauthorized" }, 401);
    if (b.op === "sub") {
      if (!/^https:\/\//.test(String(b.endpoint || "")) || !b.p256dh || !b.auth) return J({ error: "bad subscription" }, 400);
      const { error } = await admin.from("push_subs").upsert({ endpoint: String(b.endpoint).slice(0, 1000), p256dh: String(b.p256dh).slice(0, 300), auth: String(b.auth).slice(0, 100), user_id: u.id, ua: String(b.ua || "").slice(0, 200) }, { onConflict: "endpoint" });
      if (error) return J({ error: error.message }, 500);
      return J({ ok: true });
    }
    if (b.op === "unsub") {
      await admin.from("push_subs").delete().eq("endpoint", String(b.endpoint || "")).eq("user_id", u.id);
      return J({ ok: true });
    }
    if (b.op === "test") {
      const { data: subs } = await admin.from("push_subs").select("endpoint,p256dh,auth,user_id").eq("user_id", u.id);
      const k = await keys();
      let n = 0;
      for (const s of (subs || []) as Sub[]) if (await send(s, { title: "Примирення", body: "Сповіщення увімкнено. У день нагадування воно прийде сюди.", tag: "test", url: "#reminders" }, k)) n++;
      return J({ ok: true, sent: n, devices: (subs || []).length });
    }
    return J({ error: "unknown op" }, 400);
  } catch (e) {
    return J({ error: String((e as Error).message || e) }, 500);
  }
});
