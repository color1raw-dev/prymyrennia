/* Standalone-site adapter: gives the app the same storage/user/download interface it has inside Claude, backed by Supabase. */
(function(){
"use strict";
window.__SITE=true;
var SB=window.supabase.createClient("__SB_URL__","__SB_KEY__",{auth:{persistSession:true,autoRefreshToken:true}});
var ME=null,UID=null,EMAIL="",STAFF=[],readyRes,READY=new Promise(function(r){readyRes=r});
var cache={},subs={},logSubs={},userSubs=[],polls=null;
window.__staff=STAFF;

function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function rid(){var a="abcdefghijklmnopqrstuvwxyz0123456789",s="";var b=new Uint8Array(20);crypto.getRandomValues(b);for(var i=0;i<20;i++)s+=a[b[i]%36];return s}
function perr(e){var c=e&&(e.code||"");return {code:(c==="42501"||c==="23505"||c==="PGRST301")?"invalid_argument":"unavailable",message:e&&e.message||""}}

/* ---------- data ---------- */
function fetchCol(col){var out=[];function page(from){return SB.from("docs").select("id,data").eq("col",col).order("id").range(from,from+999).then(function(r){if(r.error)throw r.error;out=out.concat(r.data);return r.data.length===1000?page(from+1000):out})}return page(0)}
function fetchStaff(){return SB.from("staff").select("*").then(function(r){if(r.error)throw r.error;STAFF=r.data||[];window.__staff=STAFF;var mine=STAFF.filter(function(x){return x.user_id===UID})[0];if(mine)ME=mine;return STAFF})}
function cfgView(d){d=Object.assign({},d||{});var ul={},un={},fu=[];STAFF.forEach(function(s){if(s.person_id)ul[s.user_id]=s.person_id;un[s.user_id]=s.name||s.email;if(s.role==="full"||s.role==="owner")fu.push(s.user_id)});d.userLinks=ul;d.userNames=un;d.fullUsers=fu;return d}
function view(col,rows){return rows.map(function(r){return {id:r.id,exists:true,data:(function(d){return function(){return d}})(col==="config"?cfgView(r.data):r.data)}})}
function notify(col){var rows=cache[col]||[];(subs[col]||[]).forEach(function(s){try{if(s.doc){var r=rows.filter(function(x){return x.id===s.doc})[0];s.cb(r?view(col,[r])[0]:{id:s.doc,exists:false,data:function(){return undefined}})}else s.cb({docs:view(col,rows)})}catch(e){console.error(e)}})}
var timers={};
function refresh(col){clearTimeout(timers[col]);timers[col]=setTimeout(function(){fetchCol(col).then(function(rows){var same=!!cache[col]&&JSON.stringify(cache[col])===JSON.stringify(rows);cache[col]=rows;if(same)return;window.__remote=true;try{notify(col)}finally{window.__remote=false}},function(e){(subs[col]||[]).forEach(function(s){if(s.err&&!cache[col])s.err(perr(e))})})},60)}
function subscribe(col,s){(subs[col]=subs[col]||[]).push(s);if(cache[col])setTimeout(function(){notify(col)},0);else refresh(col);return function(){subs[col]=(subs[col]||[]).filter(function(x){return x!==s})}}
function putLocal(col,id,data){var rows=(cache[col]||[]).slice(),i=-1;rows.forEach(function(r,k){if(r.id===id)i=k});if(data===null){if(i>=0)rows.splice(i,1)}else if(i>=0)rows[i]={id:id,data:data};else rows.push({id:id,data:data});cache[col]=rows;notify(col)}
function writeDoc(col,id,body){var data=JSON.parse(JSON.stringify(body||{}));if(col==="config"){delete data.userLinks;delete data.userNames;delete data.fullUsers}
  var row={data:data,deacon:col==="people"&&window.__derive?String(window.__derive(data)||""):""};
  return SB.from("docs").update(row).eq("col",col).eq("id",id).select("id").then(function(r){if(r.error)throw perr(r.error);if(r.data&&r.data.length)return;
    return SB.from("docs").insert(Object.assign({col:col,id:id},row)).then(function(q){if(q.error)throw perr(q.error)})}).then(function(){putLocal(col,id,data)})}
function delDoc(col,id){return SB.from("docs").delete().eq("col",col).eq("id",id).select("id").then(function(r){if(r.error)throw perr(r.error);if(!r.data||!r.data.length){var had=(cache[col]||[]).some(function(x){return x.id===id});if(had)throw {code:"invalid_argument",message:"not permitted"}}putLocal(col,id,null)})}
function docRef(col,id){return {id:id,path:col+"/"+id,
  set:function(b){return writeDoc(col,id,b)},
  update:function(b){var cur=(cache[col]||[]).filter(function(x){return x.id===id})[0];return writeDoc(col,id,Object.assign({},cur?cur.data:{},b))},
  delete:function(){return delDoc(col,id)},
  get:function(){return SB.from("docs").select("id,data").eq("col",col).eq("id",id).maybeSingle().then(function(r){if(r.error)throw perr(r.error);return r.data?view(col,[r.data])[0]:{id:id,exists:false,data:function(){return undefined}}})},
  onSnapshot:function(cb,err){return subscribe(col,{doc:id,cb:cb,err:err})}}}

/* log: one row per change; the app reads it as log/<uid>/e */
function logRow(r){return {id:String(r.id),exists:true,data:function(){return {ts:Date.parse(r.ts),col:r.col,id:r.doc_id,label:r.label,act:r.act,ch:r.ch||[],prev:r.prev||""}}}}
function logFetch(uid,s){SB.from("log").select("*").eq("user_id",uid).order("ts",{ascending:false}).limit(s.n||400).then(function(r){if(r.error){if(s.err)s.err(perr(r.error));return}s.cb({docs:(r.data||[]).map(logRow)})})}
function logCol(uid){var q={n:400,limit:function(n){q.n=n;return q},orderBy:function(){return q},
  onSnapshot:function(cb,err){var s={cb:cb,err:err,n:q.n};(logSubs[uid]=logSubs[uid]||[]).push(s);logFetch(uid,s);return function(){logSubs[uid]=(logSubs[uid]||[]).filter(function(x){return x!==s})}},
  doc:function(){return {id:rid(),set:function(o){o=o||{};return SB.from("log").insert({col:String(o.col||""),doc_id:String(o.id||""),label:String(o.label||"").slice(0,300),act:String(o.act||""),ch:Array.isArray(o.ch)?o.ch:[],prev:String(o.prev||"")}).then(function(r){if(r.error)throw perr(r.error)})}}}};return q}
function usersCol(){var q={limit:function(){return q},orderBy:function(){return q},onSnapshot:function(cb){var s={cb:cb};userSubs.push(s);function emit(){cb({docs:STAFF.map(function(x){return {id:x.user_id,exists:true,data:function(){return {}}}})})}s.emit=emit;setTimeout(emit,0);return function(){userSubs=userSubs.filter(function(x){return x!==s})}}};return q}
function prefsRef(){return {id:"prefs",
  get:function(){return SB.from("prefs").select("data").eq("user_id",UID).maybeSingle().then(function(r){if(r.error)throw perr(r.error);return r.data?{id:"prefs",exists:true,data:function(){return r.data.data}}:{id:"prefs",exists:false,data:function(){return undefined}}})},
  set:function(b){return SB.from("prefs").upsert({user_id:UID,data:b||{}}).then(function(r){if(r.error)throw perr(r.error)})},
  delete:function(){return Promise.resolve()},onSnapshot:function(cb){setTimeout(function(){cb({id:"prefs",exists:false,data:function(){return undefined}})},0);return function(){}}}}
var noop={id:"x",set:function(){return Promise.resolve()},delete:function(){return Promise.resolve()},get:function(){return Promise.resolve({exists:false,data:function(){return undefined}})},onSnapshot:function(){return function(){}}};
var DB={
  collection:function(path){var m=/^log\/([^/]+)\/e$/.exec(path);if(m)return logCol(m[1]);if(path==="log")return usersCol();
    var q={path:path,limit:function(){return q},orderBy:function(){return q},where:function(){return q},
      doc:function(id){return docRef(path,id===undefined?rid():id)},
      add:function(b){var r=docRef(path,rid());return r.set(b).then(function(){return r})},
      get:function(){return fetchCol(path).then(function(rows){return {docs:view(path,rows)}})},
      onSnapshot:function(cb,err){return subscribe(path,{cb:cb,err:err})}};return q},
  doc:function(path){var p=path.split("/");if(p[0]==="log")return noop;if(p[0]==="data"&&p[1]==="users")return prefsRef();return docRef(p[0],p.slice(1).join("_"))}};

function live(){SB.channel("app").on("postgres_changes",{event:"*",schema:"public",table:"docs"},function(p){var col=(p.new&&p.new.col)||(p.old&&p.old.col);if(col&&subs[col])refresh(col)})
  .on("postgres_changes",{event:"*",schema:"public",table:"staff"},function(){var was=ME&&ME.role;fetchStaff().then(function(){if(ME&&ME.role!==was){location.reload();return}window.__remote=true;try{notify("config");userSubs.forEach(function(s){s.emit()})}finally{window.__remote=false}},function(){})})
  .on("postgres_changes",{event:"INSERT",schema:"public",table:"log"},function(p){var u=p.new&&p.new.user_id;(logSubs[u]||[]).forEach(function(s){logFetch(u,s)})}).subscribe();
  polls=setInterval(function(){if(document.hidden)return;Object.keys(subs).forEach(function(c){if((subs[c]||[]).length)refresh(c)})},90000)}

/* ---------- user ---------- */
function avatar(name){var t=String(name||"?").trim().split(/\s+/).map(function(w){return w[0]||""}).slice(0,2).join("").toUpperCase()||"?";return "data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#131315"/><text x="40" y="50" font-family="system-ui,sans-serif" font-size="30" fill="#fff" text-anchor="middle">'+esc(t)+'</text></svg>')}
function meObj(){var n=(ME&&ME.name)||EMAIL;return {id:UID,name:n,avatarUrl:avatar(n),color:"#131315",email:EMAIL,isOwner:ME.role==="owner",canEdit:ME.role==="owner"||ME.role==="full"}}
var USER={me:function(){return Promise.resolve(meObj())},id:function(){return Promise.resolve(UID)},isOwner:function(){return Promise.resolve(ME.role==="owner")},canEdit:function(){return Promise.resolve(ME.role==="owner"||ME.role==="full")},
  can:function(k){return Promise.resolve(k==="data.write")},
  profiles:function(ids){var o={};[].concat(ids||[]).forEach(function(id){var s=STAFF.filter(function(x){return x.user_id===id})[0],n=s?(s.name||s.email):"";o[id]={id:id,name:n,avatarUrl:avatar(n),color:"#131315",email:s?s.email:null,isMe:id===UID,guest:false}});return Promise.resolve(o)}};
var DOWN={save:function(o){try{var data=o.data,blob=data instanceof Blob?data:new Blob([data],{type:/\.xlsx$/i.test(o.filename)?"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":/\.json$/i.test(o.filename)?"application/json":/\.html$/i.test(o.filename)?"text/html":"application/octet-stream"});
    var a=document.createElement("a"),u=URL.createObjectURL(blob);a.href=u;a.download=o.filename||"file";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);return Promise.resolve()}catch(e){return Promise.reject({code:"failed"})}}};
window.__siteApi={updateStaff:function(uid,patch){return SB.from("staff").update(patch).eq("user_id",uid).select("user_id").then(function(r){if(r.error||!r.data||!r.data.length)throw perr(r.error||{code:"42501"});return fetchStaff()}).then(function(){notify("config");userSubs.forEach(function(s){s.emit()})})},
  signOut:function(){return SB.auth.signOut().then(function(){location.reload()})}};
window.claude={use:function(name){if(name==="db")return READY.then(function(){return DB});if(name==="user")return READY.then(function(){return USER});if(name==="downloads")return Promise.resolve(DOWN);return Promise.resolve(null)}};

/* ---------- sign-in screen ---------- */
var mode="in",busy=false,note="",noteOk=false;
function authEl(){var el=document.getElementById("auth");if(!el){el=document.createElement("div");el.id="auth";document.body.appendChild(el)}return el}
function showLogin(){var el=authEl(),reg=mode==="up";
  var keep={};["au_name","au_email","au_pass"].forEach(function(k){var i=document.getElementById(k);if(i)keep[k]=i.value});
  el.innerHTML='<div class="au-hands"></div><form class="au-card" id="auForm" novalidate><div class="au-t">Примирення<small>церковний облік для служителів</small></div>'+
    '<div class="au-tabs" role="tablist"><button type="button" role="tab" aria-selected="'+(!reg)+'" data-m="in">Вхід</button><button type="button" role="tab" aria-selected="'+reg+'" data-m="up">Реєстрація</button></div>'+
    (reg?'<label>Прізвище та ім\'я<input id="au_name" autocomplete="name" placeholder="Як вас записано в церкві"></label>':"")+
    '<label>Пошта<input id="au_email" type="email" autocomplete="email" placeholder="you@example.com"></label>'+
    '<label>Пароль<input id="au_pass" type="password" autocomplete="'+(reg?"new-password":"current-password")+'" placeholder="'+(reg?"Щонайменше 6 символів":"Ваш пароль")+'"></label>'+
    (note?'<div class="au-note'+(noteOk?" ok":"")+'">'+esc(note)+'</div>':"")+
    '<button class="btn primary" type="submit"'+(busy?" disabled":"")+'>'+(busy?"Зачекайте…":reg?"Зареєструватися":"Увійти")+'</button>'+
    '<div class="au-f">'+(reg?"Після реєстрації пастор або секретар підтвердить ваш доступ.":"Немає облікового запису? Оберіть «Реєстрація».")+'</div></form>';
  Object.keys(keep).forEach(function(k){var i=document.getElementById(k);if(i)i.value=keep[k]})}
function showWait(){var el=authEl(),blocked=ME&&ME.role==="blocked";
  el.innerHTML='<div class="au-hands"></div><div class="au-card"><div class="au-t">'+(blocked?"Доступ закрито":"Майже готово")+'<small>'+esc(EMAIL)+'</small></div><div class="au-f" style="text-align:left;font-size:15px;color:inherit">'+(blocked?"Ваш обліковий запис заблоковано. Зверніться до пастора або секретаря.":"Вас зареєстровано. Тепер пастор або секретар має підтвердити ваш доступ у розділі «Журнал змін → Користувачі». Напишіть йому, що ви зареєструвалися — сторінка відкриється сама, щойно доступ підтвердять.")+'</div><button class="btn" type="button" id="auOut">Вийти</button></div>'}
function tr(m){m=String(m||"");if(/Invalid login/i.test(m))return "Невірна пошта або пароль.";if(/already registered|already been registered/i.test(m))return "Така пошта вже зареєстрована — оберіть «Вхід».";if(/not confirmed/i.test(m))return "Пошту ще не підтверджено. Відкрийте лист-підтвердження у своїй скриньці.";if(/at least 6|should be at least/i.test(m))return "Пароль має містити щонайменше 6 символів.";if(/valid email|invalid format|is invalid/i.test(m))return "Перевірте адресу пошти.";if(/rate limit|too many/i.test(m))return "Забагато спроб. Зачекайте кілька хвилин.";if(/fetch|network/i.test(m))return "Немає з'єднання. Перевірте інтернет.";return "Не вдалося: "+m}
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-m]");if(t&&t.closest("#auth")){mode=t.dataset.m;note="";showLogin();return}
  if(e.target.closest&&e.target.closest("#auOut,#siteOut")){window.__siteApi.signOut()}});
document.addEventListener("submit",function(e){if(e.target.id!=="auForm")return;e.preventDefault();if(busy)return;
  var em=(document.getElementById("au_email").value||"").trim(),pw=document.getElementById("au_pass").value||"",nm=mode==="up"?(document.getElementById("au_name").value||"").trim():"";
  if(!em||!pw||(mode==="up"&&!nm)){note=mode==="up"?"Заповніть ім'я, пошту і пароль.":"Введіть пошту і пароль.";noteOk=false;showLogin();return}
  busy=true;note="";showLogin();
  var p=mode==="up"?SB.auth.signUp({email:em,password:pw,options:{data:{name:nm}}}):SB.auth.signInWithPassword({email:em,password:pw});
  p.then(function(r){busy=false;if(r.error){note=tr(r.error.message);noteOk=false;showLogin();return}
    if(r.data&&r.data.session){enter(r.data.session.user);return}
    note="Ми надіслали лист на "+em+". Відкрийте його й підтвердіть пошту, потім увійдіть.";noteOk=true;mode="in";showLogin()},function(e){busy=false;note=tr(e&&e.message);noteOk=false;showLogin()})});
var waitT=null;
function enter(user){UID=user.id;EMAIL=user.email||"";var tries=0,errs=0;
  (function load(){fetchStaff().then(function(){
    if(!ME&&tries++<4){setTimeout(load,700);return}
    if(!ME||ME.role==="pending"||ME.role==="blocked"){showWait();clearTimeout(waitT);waitT=setTimeout(load,7000);return}
    clearTimeout(waitT);var el=document.getElementById("auth");if(el)el.remove();
    window.__site={role:ME.role,uid:UID,email:EMAIL};live();readyRes();

  },function(e){if(errs++<8){setTimeout(load,2500);return}note="Немає з'єднання із сервером. Перевірте інтернет і оновіть сторінку — входити заново не потрібно.";noteOk=false;showLogin()})})()}
SB.auth.getSession().then(function(r){var s=r.data&&r.data.session;if(s)enter(s.user);else showLogin()},function(){showLogin()});
/* ---------- push notifications for reminders ---------- */
(function(){var FN="__SB_URL__/functions/v1/push",ua=navigator.userAgent||"",ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),alone=!!navigator.standalone||(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches);
  var P={ok:("serviceWorker" in navigator)&&("PushManager" in window)&&("Notification" in window)&&/^https:$/.test(location.protocol),on:false,busy:false,reg:null};
  function base(){return location.pathname.indexOf("/prymyrennia-site")>=0?"../":""}
  function b64(s){s=(s+"===".slice((s.length+3)%4)).replace(/-/g,"+").replace(/_/g,"/");var r=atob(s),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a}
  function reg(){if(P.reg)return Promise.resolve(P.reg);return navigator.serviceWorker.register(base()+"sw.js").then(null,function(){return navigator.serviceWorker.register(base()+"prymyrennia-site/sw.js")}).then(function(r){P.reg=r;return new Promise(function(res){if(r.active)return res(r);var w=r.installing||r.waiting;if(!w)return res(r);w.addEventListener("statechange",function(){if(w.state==="activated")res(r)});setTimeout(function(){res(r)},8000)})})}
  function call(body){return SB.auth.getSession().then(function(r){var t=r.data&&r.data.session&&r.data.session.access_token||"";return fetch(FN,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+t},body:JSON.stringify(body)})}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j&&j.error||"push");return j})})}
  function tell(){try{window.dispatchEvent(new Event("pushstate"))}catch(e){}}
  function save(s){var j=s.toJSON();return call({op:"sub",endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth,ua:ua.slice(0,180)})}
  window.__push={
    /* on | off | denied | home (iPhone: add to the home screen first) | none (browser cannot do it) */
    state:function(){if(!P.ok)return ios&&!alone?"home":"none";if(Notification.permission==="denied")return "denied";return P.on?"on":"off"},
    busy:function(){return P.busy},
    enable:function(){if(!P.ok)return Promise.reject(new Error("unsupported"));P.busy=true;tell();
      return Promise.resolve(Notification.requestPermission()).then(function(p){if(p!=="granted")throw new Error("denied");return reg()})
        .then(function(r){return r.pushManager.getSubscription().then(function(s){if(s)return s;return fetch(FN+"?op=key").then(function(x){return x.json()}).then(function(j){if(!j.publicKey)throw new Error("no key");return r.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(j.publicKey)})})})})
        .then(save).then(function(){P.on=true;return call({op:"test"})})
        .then(function(x){P.busy=false;tell();return x},function(e){P.busy=false;tell();throw e})},
    disable:function(){if(!P.ok)return Promise.resolve();P.busy=true;tell();
      return reg().then(function(r){return r.pushManager.getSubscription()}).then(function(s){if(!s)return;return call({op:"unsub",endpoint:s.endpoint}).then(function(){},function(){}).then(function(){return s.unsubscribe()})})
        .then(function(){P.on=false;P.busy=false;tell()},function(){P.busy=false;tell()})}};
  /* after sign-in: find out whether this device is already subscribed and refresh its record */
  READY.then(function(){if(!P.ok||Notification.permission!=="granted")return;reg().then(function(r){return r.pushManager.getSubscription()}).then(function(s){P.on=!!s;tell();if(s)save(s).then(function(){},function(){})},function(){})})})();
/* new version check: the page knows its own build id and compares it with version.txt on the server */
(function(){var dir=location.pathname.indexOf("/prymyrennia-site")>=0?"":"prymyrennia-site/",cur="__BUILD__",shown=false;
  function latest(){return fetch(dir+"version.txt?v="+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.text():""}).then(function(t){return String(t).trim()})}
  function busy(){if(document.querySelector("dialog[open]"))return true;var f=document.querySelectorAll("input,textarea");for(var i=0;i<f.length;i++){var e=f[i];if(e.type==="checkbox"||e.type==="radio"||e.type==="date"||e.id==="gq")continue;if(e.value&&e.value!==e.defaultValue)return true}return false}
  function reload(v){location.replace(location.pathname+"?v="+encodeURIComponent(v))}
  function offer(v){if(shown)return;shown=true;var b=document.createElement("button");b.type="button";b.id="updBtn";
    b.style.cssText="position:fixed;z-index:60;left:50%;top:calc(14px + env(safe-area-inset-top,0px));transform:translateX(-50%);display:flex;align-items:center;gap:10px;height:48px;padding:0 20px 0 16px;border:0;border-radius:99px;background:#131315;color:#fff;font:inherit;font-size:14.5px;cursor:pointer;box-shadow:0 14px 44px rgba(0,0,0,.3);white-space:nowrap";
    b.innerHTML='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#d9f23a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg><span>Є нова версія — оновити</span>';
    b.onclick=function(){reload(v)};document.body.appendChild(b)}
  /* auto=true: reload silently (once per version) when nothing is being typed; otherwise show the button */
  function check(auto){if(shown||document.hidden)return;latest().then(function(v){if(!v||v===cur||!/^[a-f0-9]{6,40}$/.test(v))return;
      var k="upd:"+v,ok=false;try{if(sessionStorage.getItem(k)!=="1"){sessionStorage.setItem(k,"1");ok=sessionStorage.getItem(k)==="1"}}catch(e){ok=false}
      if(auto&&ok&&!busy())reload(v);else offer(v)},function(){})}
  if(/^https?:$/.test(location.protocol)&&cur.charAt(0)!=="_"){check(true);setInterval(function(){check(false)},120000);
    document.addEventListener("visibilitychange",function(){check(true)});window.addEventListener("pageshow",function(e){if(e.persisted)check(true)});window.addEventListener("focus",function(){check(true)})}})();
})();
