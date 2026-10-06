/* ---------- account menu ---------- */
function meIni(n){return String(n||"?").trim().split(/\s+/).map(function(w){return w.charAt(0)}).slice(0,2).join("").toUpperCase()||"?"}
function meRoleT(){var w=document.getElementById("who"),r=w?(w.textContent.split(" \u00b7 ")[1]||""):"";return r?r.charAt(0).toUpperCase()+r.slice(1):""}
function meAvH(c){var n=S.me&&S.me.name||"";return S.me&&S.me.avatarUrl?'<img class="'+c+'" src="'+esc(S.me.avatarUrl)+'" alt="">':'<span class="'+c+'">'+esc(meIni(n))+'</span>'}
function meSync(){var b=document.getElementById("meBtn"),m=document.getElementById("meBtnM");if(!b)return;var has=!!S.me;b.hidden=!has;if(m)m.hidden=!has;if(!has)return;
  var nm=S.me.name||"Без імені",ini=document.getElementById("meIn");document.getElementById("meName").textContent=nm;document.getElementById("meRole").textContent=meRoleT();
  ini.hidden=!!S.me.avatarUrl;ini.textContent=meIni(nm);
  if(m){var k=(S.me.avatarUrl||"")+"|"+nm;if(m.dataset.k!==k){m.dataset.k=k;m.innerHTML=S.me.avatarUrl?'<img src="'+esc(S.me.avatarUrl)+'" alt="">':esc(meIni(nm))}}}
function meClose(){var el=document.getElementById("meMenu");if(el)el.remove();var b=document.getElementById("meBtn");if(b)b.setAttribute("aria-expanded","false")}
function meItem(act,ic,label,id){return '<button type="button" role="menuitem"'+(id?' id="'+id+'"':' data-act="'+act+'"')+'><span class="si">'+ico(ic)+'</span><span class="grow">'+label+'</span>'+(id?"":'<span class="go">'+ico("arrow")+'</span>')+'</button>'}
function meMenu(src){if(document.getElementById("meMenu")){meClose();return}if(!S.me)return;
  var el=document.createElement("div"),nm=S.me.name||"Без імені",role=meRoleT(),nl=document.getElementById("navLog"),users=nl&&!nl.hidden;el.id="meMenu";el.setAttribute("role","menu");el.setAttribute("aria-label","Обліковий запис");
  el.innerHTML='<div class="mm-h g-ink"><div class="mm-top">'+meAvH("mm-av")+(role?'<span class="mm-r">'+esc(role)+'</span>':"")+'</div><div class="mm-t"><b>'+esc(nm)+'</b>'+(S.me.email?'<span>'+esc(S.me.email)+'</span>':"")+'</div></div>'+
    '<div class="mm-l">'+meItem("tourStart","help","Як користуватись")+meItem("meDash","sliders","Налаштувати огляд")+(users?meItem("meUsers","users",window.__SITE?"Користувачі й доступ":"Журнал і користувачі"):"")+(window.__push&&window.__push.state()==="on"?meItem("pushOff","bell","Вимкнути сповіщення"):window.__push&&window.__push.state()==="off"?meItem("pushOn","bell","Увімкнути сповіщення"):"")+'</div>'+
    (window.__SITE?'<div class="mm-l mm-out">'+meItem("","out","Вийти","siteOut")+'</div>':"");
  document.body.appendChild(el);var r=src.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight;
  if(src.id==="meBtnM"){var w=Math.min(320,vw-32);el.style.width=w+"px";el.style.top=(r.bottom+10)+"px";el.style.left=Math.max(16,Math.min(vw-16-w,r.right-w))+"px";el.style.transformOrigin="top right"}
  else{el.style.width=Math.max(r.width,292)+"px";el.style.left=r.left+"px";el.style.bottom=(vh-r.top+10)+"px";el.style.transformOrigin="bottom left";src.setAttribute("aria-expanded","true")}
  if(src.id!=="meBtnM"&&!window.matchMedia("(pointer:coarse)").matches){var f=el.querySelector(".mm-l button");if(f)f.focus({preventScroll:true})}}
document.addEventListener("click",function(e){var m=document.getElementById("meMenu");if(!m)return;var t=e.target;if(t.closest("#meBtn,#meBtnM"))return;if(!m.contains(t)||t.closest("button"))setTimeout(meClose,0)});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&document.getElementById("meMenu")){meClose();var b=document.getElementById("meBtn");if(b&&b.offsetParent)b.focus()}});
window.addEventListener("resize",meClose);
(function(){var w=document.getElementById("who");if(w&&window.MutationObserver)new MutationObserver(meSync).observe(w,{childList:true,characterData:true,subtree:true});setInterval(meSync,1500);meSync()})();
/* mobile "more" sheet closes on any tap outside its toggle */
document.addEventListener("click",function(e){var nv=document.getElementById("nav");if(!nv||!nv.classList.contains("more"))return;if(e.target.closest&&e.target.closest("#navMore"))return;nv.classList.remove("more");var m=document.getElementById("navMore");if(m)m.setAttribute("aria-expanded","false")});
/* phone: the assistant takes the whole screen and follows the on-screen keyboard */
(function(){var p=document.getElementById("aiPanel");if(!p)return;var mq=window.matchMedia("(max-width:920px)"),vv=window.visualViewport;
  function fit(){var on=!p.hidden&&mq.matches;document.body.classList.toggle("ai-full",on);
    if(on&&vv){p.style.height=vv.height+"px";p.style.top=vv.offsetTop+"px";var m=document.getElementById("aiMsgs");if(m)m.scrollTop=m.scrollHeight}else{p.style.height="";p.style.top=""}}
  if(window.MutationObserver)new MutationObserver(fit).observe(p,{attributes:true,attributeFilter:["hidden"]});
  if(vv){vv.addEventListener("resize",fit);vv.addEventListener("scroll",fit)}window.addEventListener("resize",fit);fit()})();
function aiSync(){var f=document.getElementById("aiFab");if(f)f.hidden=!S.ready||AI.open;var m=document.getElementById("aiBtnM");if(m)m.hidden=!S.ready}
(function(){var m=document.getElementById("aiBtnM");if(m)m.innerHTML=ico("spark")})();
(function(){var g=document.getElementById("gq"),mq=window.matchMedia("(max-width:920px)");function f(){if(g)g.placeholder=mq.matches?"Пошук…":"Пошук по всьому…"}f();if(mq.addEventListener)mq.addEventListener("change",f)})();
/* ---------- push notifications UI (standalone site only) ---------- */
function pushOn(){var p=window.__push;if(!p)return;meClose();p.enable().then(function(x){toast(x&&x.sent?"Сповіщення увімкнено — надіслав пробне.":"Сповіщення увімкнено.")},function(e){var m=e&&e.message;toast(m==="denied"?"Сповіщення заборонені. Дозвольте їх для цього сайту в налаштуваннях.":"Не вдалося увімкнути сповіщення. Спробуйте ще раз.")})}
function pushCard(){var p=window.__push;if(!p)return "";var st=p.state();if(st==="on")return "";
  var t=st==="home"?"На iPhone спершу додайте застосунок на головний екран: «Поділитися» → «На початковий екран», і відкрийте його звідти. Тоді тут з'явиться кнопка.":st==="denied"?"Сповіщення для цього сайту заборонені. Дозвольте їх у налаштуваннях браузера або телефона і поверніться сюди.":st==="none"?"Цей браузер не підтримує сповіщення. Спробуйте Chrome або Safari.":"У день нагадування прийде звичайне сповіщення на цей пристрій, навіть коли застосунок закритий.";
  return '<div class="notice"><span class="si t-lime">'+ico("bell")+'</span><span class="nt"><b>Сповіщення про нагадування</b><span class="muted small">'+esc(t)+'</span></span>'+(st==="off"?'<button class="btn primary" data-act="pushOn"'+(p.busy()?" disabled":"")+'>'+(p.busy()?"Вмикаю…":"Увімкнути")+'</button>':"")+'</div>'}
window.addEventListener("pushstate",function(){if(S.ready&&S.tab==="reminders")render()});
/* ---------- keep what the person is typing when the screen redraws because someone else's data arrived ---------- */
var UACT=0;
["pointerdown","submit","keydown","change"].forEach(function(ev){document.addEventListener(ev,function(e){if(ev==="keydown"&&e.key!=="Enter")return;if(ev==="change"&&!/^(SELECT)$/.test(e.target.tagName)&&e.target.type!=="checkbox")return;UACT=Date.now()},true)});
function fieldsKeep(){var remote=window.__SITE?!!window.__remote:Date.now()-UACT>4000;if(!remote)return null;
  var o={k:S.tab+"|"+(S.card||"")+"|"+(S.mode||"")+"|"+(dlg.open?1:0),v:{},n:0},a=document.activeElement;
  Array.prototype.forEach.call(document.querySelectorAll("#app input[id],#app textarea[id],#app select[id],dialog[open] input[id],dialog[open] textarea[id],dialog[open] select[id]"),function(e){if(e.type==="file")return;o.v[e.id]=e.type==="checkbox"||e.type==="radio"?{c:e.checked}:{t:e.value};o.n++});
  o.f=a&&a.id&&o.v[a.id]?{id:a.id,s:a.selectionStart,e:a.selectionEnd}:null;o.sc=dlg.open?dlg.scrollTop:null;return o.n?o:null}
function fieldsBack(o){if(!o||o.k!==S.tab+"|"+(S.card||"")+"|"+(S.mode||"")+"|"+(dlg.open?1:0))return;
  Object.keys(o.v).forEach(function(id){var e=document.getElementById(id),x=o.v[id];if(!e)return;if("c" in x){e.checked=x.c;return}
    if(e.tagName==="SELECT"){for(var i=0;i<e.options.length;i++)if(e.options[i].value===x.t){e.value=x.t;break}}else e.value=x.t});
  if(o.sc!=null&&dlg.open)dlg.scrollTop=o.sc;
  if(o.f){var el=document.getElementById(o.f.id);if(el&&document.activeElement!==el){try{el.focus({preventScroll:true});if(o.f.s!=null&&el.setSelectionRange)el.setSelectionRange(o.f.s,o.f.e)}catch(x){}}}}
function render(){var keep=null;try{keep=fieldsKeep()}catch(e){}render0();try{fieldsBack(keep)}catch(e){}}
