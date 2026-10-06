/* Примирення: service worker for push notifications only (no caching, so updates are never held back). */
var IN=self.location.pathname.indexOf("/prymyrennia-site/")>=0,DIR=IN?"":"prymyrennia-site/",ROOT=IN?self.registration.scope.replace(/prymyrennia-site\/$/,""):self.registration.scope;
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : "" }; }
  var o = { body: d.body || "", icon: DIR + "icon-192.png", badge: DIR + "icon-192.png", data: { url: d.url || "" } };
  if (d.tag) o.tag = d.tag;
  e.waitUntil(self.registration.showNotification(d.title || "Примирення", o));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var u = ROOT + ((e.notification.data && e.notification.data.url) || "");
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) {
      if (cs[i].url.indexOf(ROOT) === 0 && "focus" in cs[i]) {
        if (cs[i].navigate) cs[i].navigate(u).catch(function () {});
        return cs[i].focus();
      }
    }
    return self.clients.openWindow(u);
  }));
});
