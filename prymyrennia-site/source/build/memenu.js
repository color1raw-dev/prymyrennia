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
/* ---------- pastors can be chosen as the person someone is assigned to; the list of ministries is editable ---------- */
function careList(){var out=deaconList().slice();S.pastors.forEach(function(p){if(p&&p.name&&out.indexOf(p.name)<0)out.push(p.name)});return out}
function roleNames(){var hid=S.cfg.hiddenRoles||[],out=DEFROLES.filter(function(r){return hid.indexOf(r)<0});S.customRoles.concat(Object.keys(S.min)).forEach(function(r){if(out.indexOf(r)<0)out.push(r)});return out}
function rolesEdit(rn,emptyR,w){var can=w&&!lim(),hid=(S.cfg.hiddenRoles||[]).length;
  if(!S.roleEdit)return (emptyR.length?'<div class="muted small">Без призначених: '+esc(emptyR.join(", "))+'</div>':"")+(can?'<div class="bar"><button class="btn" data-act="roleEdit">'+ico("sliders")+' Редагувати список служінь</button></div>':"");
  return '<div class="blk"><h3>Список служінь</h3><div class="muted small hint">Натисніть хрестик, щоб прибрати служіння зі списку варіантів. Якщо у служінні є люди, застосунок перепитає — призначення теж знімуться.</div><div class="chips">'+rn.map(function(r){var n=(S.min[r]||[]).length,ask=S.roleAsk===r;
      return '<span class="chip'+(ask?" warn":"")+'">'+esc(r)+(n?' <span class="muted small">· '+n+'</span>':"")+'<button class="link" data-act="roleRm" data-r="'+esc(r)+'" aria-label="Прибрати служіння '+esc(r)+'" title="Прибрати" style="color:var(--bad)">'+(ask?"точно прибрати?":ico("x"))+'</button></span>'}).join("")+'</div>'+
    '<div class="bar"><button class="btn primary" data-act="roleEdit">'+ico("check")+' Готово</button>'+(hid?'<button class="btn" data-act="roleRestore">Повернути стандартні ('+hid+')</button>':"")+'</div></div>'}
/* ---------- verse of the day: one reference per day for everyone; the text is read from a public Bible API ---------- */
var VERSES=[[4,6,24,26],[5,31,6],[6,1,9],[14,7,14],[19,23,1],[19,27,1],[19,37,5],[19,91,1,2],[19,103,2],[19,119,105],[19,121,1,2],[20,3,5,6],[23,26,3],[23,40,31],[23,41,10],[24,29,11],[25,3,22,23],[33,6,8],[34,1,7],[36,3,17],[40,5,16],[40,6,33],[40,11,28],[40,28,20],[43,3,16],[43,8,12],[43,13,34,35],[43,14,6],[43,14,27],[43,15,5],[43,16,33],[44,1,8],[45,5,8],[45,8,28],[45,8,38,39],[45,12,2],[45,12,12],[45,15,13],[46,13,13],[46,16,13,14],[47,5,17],[47,12,9],[48,2,20],[48,5,22,23],[48,6,9],[49,2,8,9],[49,4,32],[50,1,6],[50,4,6,7],[50,4,13],[51,3,23],[52,5,16,18],[55,1,7],[58,11,1],[58,13,8],[59,1,5],[60,5,7],[62,1,9],[62,4,19],[66,3,20],[66,21,4]];
var VBOOK={4:"Числа",5:"Повторення Закону",6:"Ісус Навин",14:"2 Хронік",19:"Псалом",20:"Приповісті",23:"Ісая",24:"Єремія",25:"Плач Єремії",33:"Михей",34:"Наум",36:"Софонія",40:"Від Матвія",43:"Від Івана",44:"Дії",45:"До римлян",46:"1 до коринтян",47:"2 до коринтян",48:"До галатів",49:"До ефесян",50:"До филип'ян",51:"До колоссян",52:"1 до солунян",55:"2 до Тимофія",58:"До євреїв",59:"Якова",60:"1 Петра",62:"1 Івана",66:"Об'явлення"};
var VD={day:"",state:"",ref:"",text:""},VTR="CUV23"; /* Сучасний переклад УБТ (Турконяк), 2020–2023 */
function versePick(){var n=Math.floor(new Date(today()+"T12:00:00").getTime()/864e5);return VERSES[(n*7+3)%VERSES.length]}
function verseRef(r){return VBOOK[r[0]]+" "+r[1]+":"+r[2]+(r[3]?"\u2013"+r[3]:"")}
function verseLoad(){var k=today();if(VD.day===k)return;VD={day:k,state:"load",ref:"",text:""};var r=versePick(),ck="verse:"+VTR+":"+k;
  try{var c=JSON.parse(localStorage.getItem(ck)||"null");if(c&&c.t&&c.r){VD.state="ok";VD.text=c.t;VD.ref=c.r;return}}catch(e){}
  if(!window.fetch)return;
  fetch("https://bolls.life/get-text/"+VTR+"/"+r[0]+"/"+r[1]+"/").then(function(x){if(!x.ok)throw new Error("http");return x.json()}).then(function(a){
    var t=a.filter(function(v){return v.verse>=r[2]&&v.verse<=(r[3]||r[2])}).map(function(v){return String(v.text||"").replace(/<[^>]+>/g," ")}).join(" ").replace(/[\u24b6-\u24e9]/g," ").replace(/\s+/g," ").trim();
    if(r[0]===19&&r[2]===1)t=t.replace(/^[^.!?]{3,40}\.\s+(?=[А-ЯІЇЄҐ])/,"");t=t.replace(/[,;:]$/,".");if(!t||VD.day!==k)return;t=t.charAt(0).toUpperCase()+t.slice(1);
    VD.state="ok";VD.text=t;VD.ref=verseRef(r);
    try{for(var i=localStorage.length-1;i>=0;i--){var key=localStorage.key(i);if(key&&key.indexOf("verse:")===0)localStorage.removeItem(key)}localStorage.setItem(ck,JSON.stringify({t:t,r:VD.ref}))}catch(e){}
    if(S.ready&&S.tab==="home"){var r0=window.__remote,u0=UACT;window.__remote=true;UACT=0;try{render()}finally{window.__remote=r0;UACT=u0}}},function(){VD.state="err"})}
function verseCard(){verseLoad();if(VD.state!=="ok")return "";
  return '<section class="verse" aria-label="Слово на сьогодні"><span class="si t-lime">'+ico("book")+'</span><div class="vs-b"><blockquote>'+esc(VD.text)+'</blockquote><div class="vs-ref"><b>'+esc(VD.ref)+'</b><span>Слово на сьогодні</span></div></div></section>'}
/* ---------- deacons on a trial period ---------- */
function dkTrial(name){return S.dk.some(function(d){return d.name===name&&d.trial})}
function dkTrialP(id){return S.dk.some(function(d){return d.pid===id&&d.trial})}

/* ---------- age statistics dialog ---------- */
var AGEG=[["Діти до 12",0,12],["Підлітки 13–17",13,17],["Молодь 18–25",18,25],["26–35",26,35],["36–50",36,50],["51–60",51,60],["61 і старші",61,200]];
function agesDlg(){var A=act(),K=A.filter(function(x){return x.a!=null}),ages=K.map(function(x){return x.a}),unk=A.length-K.length;
  function med(xs){var m=median(xs.map(function(x){return x.a}));return m===""?"—":num(m)}
  function box(v,t,c){return '<div class="stat"><span class="dn">'+v+'</span><span class="tag'+(c?" "+c:"")+'">'+t+'</span></div>'}
  var avg=ages.length?Math.round(ages.reduce(function(a,b){return a+b},0)/ages.length*10)/10:"—";
  var G=AGEG.map(function(g){return K.filter(function(x){return x.a>=g[1]&&x.a<=g[2]})});
  var h='<div class="dlg"><div class="dlg-head"><h2>Вік членів церкви</h2><button class="iconbtn x" data-act="close" aria-label="Закрити">'+ico("x")+'</button></div>';
  if(!ages.length)return h+'<div class="muted">Ще немає жодної дати народження. Вкажіть їх у картках людей, і тут з\'явиться статистика.</div></div>';
  h+='<section class="stats ages-s">'+box(med(K),"медіанний вік","lime")+box(String(avg).replace(".",","),"середній вік")+box(Math.min.apply(null,ages),"наймолодший")+box(Math.max.apply(null,ages),"найстарший")+'</section>';
  h+='<div class="muted small">Чоловіки: медіанний вік '+med(K.filter(function(x){return x.p.sex==="ч"}))+' · жінки: '+med(K.filter(function(x){return x.p.sex==="ж"}))+(unk?' · без дати народження: '+unk:"")+'</div>';
  h+='<h3>За віковими групами</h3><div class="ages-b">'+hbars(AGEG.map(function(g,i){return [g[0],G[i].length,i]}),"ageG")+'</div>';
  if(S.ageG>=0&&G[S.ageG]){var L=G[S.ageG].slice().sort(function(a,b){return a.a-b.a||a.n.localeCompare(b.n,"uk")}),m=L.filter(function(x){return x.p.sex==="ч"}).length,w=L.filter(function(x){return x.p.sex==="ж"}).length;
    h+='<div class="box"><div><b>'+esc(AGEG[S.ageG][0])+'</b> <span class="muted small">'+L.length+' · '+m+' чол. · '+w+' жін. · '+Math.round(L.length/ages.length*100)+'% від усіх</span></div>'+(L.length?'<ul class="list rem">'+L.map(function(x){return '<li><span class="grow">'+plink(x,x.a+" р.")+'</span></li>'}).join("")+'</ul>':'<div class="muted small">У цій групі нікого немає.</div>')+'</div>'}
  else h+='<div class="muted small">Натисніть на групу, щоб побачити людей.</div>';
  return h+'</div>'}
