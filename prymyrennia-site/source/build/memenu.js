/* ---------- account menu ---------- */
function meIni(n){return String(n||"?").trim().split(/\s+/).map(function(w){return w.charAt(0)}).slice(0,2).join("").toUpperCase()||"?"}
function meRoleT(){var w=document.getElementById("who"),r=w?(w.textContent.split(" \u00b7 ")[1]||""):"";return r?r.charAt(0).toUpperCase()+r.slice(1):""}
function meKind(){var id=myPid();if(id&&isPastor(id))return ["pastor","Пастор"];if(id&&isDeacon(id))return dkTrialP(id)?["trial","Диякон · випробувальний"]:["deacon","Диякон"];return [S.isOwner?"owner":S.isAdmin?"full":"user",""]}
function meAvH(c){var n=S.me&&S.me.name||"",mp=person(myPid());if(mp&&avOk(mp))return '<span class="'+c+' fig">'+avOf(mp)+'</span>';return S.me&&S.me.avatarUrl?'<img class="'+c+'" src="'+esc(S.me.avatarUrl)+'" alt="">':'<span class="'+c+'">'+esc(meIni(n))+'</span>'}
function meSync(){var b=document.getElementById("meBtn"),m=document.getElementById("meBtnM");if(!b)return;var has=!!S.me;if(b.hidden===has)b.hidden=!has;if(m&&m.hidden===has)m.hidden=!has;if(!has)return;
  var nm=S.me.name||"Без імені",ini=document.getElementById("meIn");var en=document.getElementById("meName"),er=document.getElementById("meRole"),rt=meRoleT();if(en.textContent!==nm)en.textContent=nm;if(er.textContent!==rt)er.textContent=rt;
  var mp=person(myPid()),mfig=!!(mp&&avOk(mp)),hideIni=!mfig&&!!S.me.avatarUrl,avI=document.getElementById("meAv");if(ini.hidden!==hideIni)ini.hidden=hideIni;if(avI&&mfig&&!avI.hidden)avI.hidden=true;var mk0=mfig?"f"+mp.id+"|"+mp.sex+"|"+mp.birth+"|"+avRole(mp.id):"t"+nm;if(ini.dataset.k!==mk0){ini.dataset.k=mk0;ini.classList.toggle("fig",!!mfig);if(mfig)ini.innerHTML=avOf(mp);else ini.textContent=meIni(nm)}
  if(m){var k=(S.me.avatarUrl||"")+"|"+nm+"|"+mk0;if(m.dataset.k!==k){m.dataset.k=k;m.classList.toggle("fig",mfig);m.innerHTML=mfig?avOf(mp):S.me.avatarUrl?'<img src="'+esc(S.me.avatarUrl)+'" alt="">':esc(meIni(nm))}}}
function meClose(){var el=document.getElementById("meMenu");if(el)el.remove();var b=document.getElementById("meBtn");if(b)b.setAttribute("aria-expanded","false")}
function meItem(act,ic,label,id){return '<button type="button" role="menuitem"'+(id?' id="'+id+'"':' data-act="'+act+'"')+'><span class="si">'+ico(ic)+'</span><span class="grow">'+label+'</span>'+(id?"":'<span class="go">'+ico("arrow")+'</span>')+'</button>'}
function meMenu(src){if(document.getElementById("meMenu")){meClose();return}if(!S.me)return;
  var el=document.createElement("div"),nm=S.me.name||"Без імені",role=meRoleT(),nl=document.getElementById("navLog"),users=nl&&!nl.hidden;el.id="meMenu";el.setAttribute("role","menu");el.setAttribute("aria-label","Обліковий запис");
  var mk=meKind();el.innerHTML='<div class="mm-h mk-'+mk[0]+'"><div class="mm-top">'+meAvH("mm-av")+'<span class="mm-rs">'+(mk[1]?'<span class="mm-r pos">'+esc(mk[1])+'</span>':"")+(role?'<span class="mm-r'+(mk[1]?" acc":"")+'">'+esc(role)+'</span>':"")+'</span></div><div class="mm-t"><b>'+esc(nm)+'</b>'+(S.me.email?'<span>'+esc(S.me.email)+'</span>':"")+'</div></div>'+
    '<div class="mm-l">'+meItem("tourStart","help","Як користуватись")+meItem("news","spark","Що нового")+meItem("meDash","sliders","Налаштувати огляд")+(users?meItem("meUsers","users",window.__SITE?"Користувачі й доступ":"Журнал і користувачі"):"")+(window.__push&&window.__push.state()==="on"?meItem("pushOff","bell","Вимкнути сповіщення"):window.__push&&window.__push.state()==="off"?meItem("pushOn","bell","Увімкнути сповіщення"):"")+'</div>'+
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
window.addEventListener("pushstate",function(){if(S.ready&&S.mode==="rems"&&dlg.open)renderDlg()});
function remOpen(){if(TOUR)return;meClose();if(typeof AI!=="undefined"&&AI.open){AI.open=false;aiRender()}S.card=null;S.mode="rems";renderDlg()}
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
function render(){var keep=null;try{keep=fieldsKeep()}catch(e){}if(S.tab==="reminders")S.tab="home";render0();try{var rb=document.getElementById("remBtn"),cb=document.getElementById("c_rem");if(rb&&cb)rb.classList.toggle("has",!cb.hidden)}catch(e){}try{if(S.tab!==render.t){render.t=S.tab;var nv=document.getElementById("nav"),cur=nv&&nv.querySelector('button[aria-current="page"]');if(cur&&nv.scrollWidth>nv.clientWidth+2)nv.scrollTo({left:cur.offsetLeft-(nv.clientWidth-cur.offsetWidth)/2,behavior:"smooth"})}}catch(e){}try{fieldsBack(keep)}catch(e){}}
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

/* who a person is assigned to may be a pastor or a deacon: name the role as it really is */
function careWord(name,cap){var p=S.pastors.some(function(x){return x&&x.name===name}),w=p?"пастор":"диякон";return cap?w.charAt(0).toUpperCase()+w.slice(1):w}

/* ---------- what's new: shown once after an update, and always available in the account menu ---------- */
var NEWS=[
 {id:"2026-10-08-3",d:"8 жовтня 2026",t:"Діти прямо в картці",items:[
  ["heart","Діти в анкеті людини","В анкеті з'явилось питання «Чи є діти». Якщо так — одразу впишіть ім'я і вік кожної дитини, окрему картку для дитини заводити не треба. Кнопка «Додати дитину» додає ще рядок."],
  ["users","Де це видно","Діти з віком показуються в картці, у друці та в Excel. Вік сам зростає щороку. Якщо дітей вписано в картці чоловіка або дружини, вони видно і в картці другого з подружжя."]]},
 {id:"2026-10-08-2",d:"8 жовтня 2026",t:"Хто є в чаті «Примирення»",items:[
  ["users","Нове поле в анкеті","В анкеті людини з'явилось поле «У чаті «Примирення»» з вибором «так» або «ні». Воно видно в картці, друці та Excel."],
  ["grid","Видно одразу в списку","У списку людей поруч зі статусом є колонка «Чат»: «у чаті», «не в чаті» або «не вказано». Натисніть на заголовок колонки, щоб зібрати разом тих, кого ще не додали."],
  ["sliders","Хто ще не в чаті","На огляді в блоці «Варто перевірити» є рядок «не в чаті «Примирення»»: натисніть, щоб побачити список."]]},
 {id:"2026-10-07-4",d:"7 жовтня 2026",t:"Нагадування переїхали у дзвіночок",items:[
  ["bell","Дзвіночок замість пункту меню","Нагадування тепер відкриваються дзвіночком біля назви «Примирення» (на телефоні — вгорі праворуч). Цифра на ньому показує, скільки справ на сьогодні."],
  ["grid","Зручніші вікна","Поки відкрите вікно, сторінка під ним не прокручується."],
  ["swap","Меню на телефоні гортається","Кнопки «Ще» більше немає: усі розділи в одному рядку внизу, просто проведіть по меню вбік."]]},
 {id:"2026-10-07-2",d:"7 жовтня 2026",t:"У кожного свій чоловічок, у кожного статусу свій колір",items:[
  ["users","Аватарки замість ініціалів","Застосунок сам малює чоловічка за даними картки: стать, вік і служіння. У пастора посох і помаранчевий фон, у диякона стрічка й зелений, в інших служителів лаймовий пояс."],
  ["heart","Щоб чоловічок з'явився","Вкажіть у картці стать, а для точнішого вигляду ще й дату народження. Доки стать не вказана, лишається кружечок з ініціалами."],
  ["grid","Колір картки за статусом","Шапка картки людини тепер показує, хто це: член — зелена, пастор — помаранчева, диякон — оливкова, на випробувальному — сіро-блакитна, на замітці — золота, служить у ЗСУ — хакі, за кордоном або перейшов — синя, у процесі переходу — фіолетова, давно не відвідує — сіро-бежева, самоусунувся — теракотова, вилучений — червона, помер — чорна, не член — пісочна."],
  ["sliders","Кольорові мітки","Мітки статусу, стану в церкві, потреб і служінь у списку людей теж мають свої кольори."]]},
 {id:"2026-10-07",d:"7 жовтня 2026",t:"Нове меню, пастори з дияконами і статистика віку",items:[
  ["grid","Меню-острів","Меню стало окремою панеллю з логотипом. У світлій темі воно світле, у темній — темне."],
  ["shield","Пастори і диякони разом","Один список із кольоровими картками: помаранчева — пастор, зелена — диякон, сіро-блакитна — диякон на випробувальному терміні. Натисніть на картку, щоб побачити закріплених людей."],
  ["clock","Випробувальний термін","Диякона можна додати на випробувальний термін, а згодом затвердити однією кнопкою."],
  ["users","За ким закріплена людина","За людиною можна закріпити і пастора. У картках, списках і звітах тепер пишеться, хто це насправді: пастор чи диякон."],
  ["chart","Статистика віку","Картка «Медіанний вік» на огляді відкриває вік за групами: натисніть на групу, щоб побачити людей."],
  ["book","Слово на сьогодні","Щодня новий вірш із Біблії вгорі огляду, у сучасному перекладі."],
  ["bell","Сповіщення","Нагадування можуть приходити на телефон або комп'ютер. Увімкніть їх у розділі «Нагадування»."],
  ["sliders","Дрібніше","Список служінь можна редагувати. У «як прийшов» з'явилось «невідомо», у контактах — «переписка». Дані у формі більше не зникають під час заповнення."]]}
];
function newsLast(){try{return localStorage.getItem("newsSeen")||""}catch(e){return NEWS[0].id}}
function newsSeen(){if(S.newsFrom==null)S.newsFrom=newsLast();try{localStorage.setItem("newsSeen",NEWS[0].id)}catch(e){}}
function newsIsNew(){try{return localStorage.getItem("newsSeen")!==NEWS[0].id}catch(e){return false}}
var NEWS_T=0;
function newsMaybe(){if(NEWS_T||!S.ready||!S.roleKnown||!S.tourDone||TOUR||dlg.open||(typeof AI!=="undefined"&&AI.open)||document.getElementById("meMenu"))return;if(!newsIsNew()){NEWS_T=1;return}
  var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;NEWS_T=1;S.card=null;S.mode="news";S.newsAll=false;renderDlg();newsSeen()}
function newsDlg(){var from=S.newsFrom==null?newsLast():S.newsFrom,cut=-1;NEWS.forEach(function(n,i){if(cut<0&&n.id===from)cut=i});var L=S.newsAll||cut<0?NEWS:NEWS.filter(function(n,i){return i<Math.max(1,cut)||n.d===NEWS[0].d});
  return '<div class="dlg news"><div class="dlg-head news-h"><div><span class="news-k">'+ico("spark")+' Оновлення · '+esc(NEWS[0].d)+'</span><h2>Що нового</h2></div><button class="iconbtn x" data-act="close" aria-label="Закрити">'+ico("x")+'</button></div>'+
    L.map(function(n,i){return (i&&n.d!==NEWS[0].d?'<h3 class="news-d">Раніше · '+esc(n.d)+'</h3>':"")+'<div class="news-t">'+esc(n.t)+'</div><ul class="news-l">'+n.items.map(function(x){return '<li><span class="si">'+ico(x[0])+'</span><span><b>'+esc(x[1])+'</b><span class="muted">'+esc(x[2])+'</span></span></li>'}).join("")+'</ul>'}).join("")+
    '<div class="bar">'+(L.length<NEWS.length?'<button class="btn" data-act="newsAll">Попередні оновлення</button>':"")+'<button class="btn" data-act="newsTour">'+ico("help")+' Пройти підказки заново</button><span class="grow"></span><button class="btn primary" data-act="close">Зрозуміло</button></div></div>'}

/* ---------- generated avatars: a little figure drawn from the card (sex, age, ministry) ---------- */
/* little biblical-style figures, drawn from what the card says about a person: sex, age, ministry. Same person -> same figure. */
var AVP={skin:["#f0c9a6","#e3b48c","#d19f76","#b9835a","#f5d8bf"],hair:["#1d1a18","#2a211c","#4a3324","#6a4a30","#a67a48"],
  bg:{sun:["#ee8a28","#f7b521","#ef5a26","#b4c3cd"],olive:["#4b5c19","#708a22","#d2ec4c","#2c3610"],steel:["#8399a7","#8fa6b3","#e79a48","#547a92"],rose:["#b56d5f","#c07a6b","#e9bba9","#8c463c"],ink:["#232327","#2c2c31","#5a5a64","#131316"],sand:["#c2ab7c","#d1bc8e","#f0e2bb","#94783f"],plum:["#6d5c8a","#7d6c9b","#cdbbe8","#40355a"],teal:["#3f7470","#4f8782","#bfe3c9","#234946"]},any:["rose","ink","sand","plum","teal","steel","olive","sun"]};
function avHash(s){var h=2166136261;s=String(s||"");for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function avShade(hex,k){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;function f(v){return Math.max(0,Math.min(255,Math.round(k<0?v*(1+k):v+(255-v)*k)))}return "#"+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1)}
function avatarSvg(o){o=o||{};var h=avHash(o.id||o.name||"x"),pick=function(a,sh){return a[(h>>>sh)%a.length]};
  var sex=o.sex==="ч"?"m":o.sex==="ж"?"f":"",age=o.age==null?null:+o.age,kid=age!=null&&age<13,teen=age!=null&&age>=13&&age<20,old=age!=null&&age>=60,mid=age!=null&&age>=40&&age<60;
  var skin=pick(AVP.skin,0),hair=old?(age>=72?"#f1eee8":"#cfcac2"):mid&&(h>>>9)%3===0?"#8a8079":pick(AVP.hair,3),ink="#17171a";
  var bk=o.role==="pastor"?"sun":o.role==="deacon"?"olive":o.role==="trial"?"steel":AVP.any[(h>>>14)%5],B=AVP.bg[bk],dark=(h>>>6)%3===0&&bk!=="ink",robe=dark?"#17171a":"#f7f6f2",cloth=dark?"#f7f6f2":(h>>>10)%2?"#f7f6f2":avShade(B[2],.55),acc="#d9f23a",gid="avg"+h+bk;if(o.role==="trial")o=Object.assign({},o,{role:"deacon"});
  var role=o.role||"",cy=kid?31:28,r=kid?12.5:12,ey=cy+(kid?1:0),s="";
  s+='<rect width="64" height="64" fill="'+B[0]+'"/><rect width="64" height="64" fill="url(#'+gid+'a)"/><rect width="64" height="64" fill="url(#'+gid+'b)"/><rect width="64" height="64" fill="url(#'+gid+'c)"/>';
  /* veil behind the body for women */
  var veil=sex==="f"&&!kid&&(!teen||(h>>>17)%2===0);
  if(veil)s+='<path d="M32 '+(cy-17)+'C21.500 '+(cy-17)+' 16 '+(cy-9)+' 16 '+(cy+2)+'C16 42 13 52 9 64H55C51 52 48 42 48 '+(cy+2)+'C48 '+(cy-9)+' 42.500 '+(cy-17)+' 32 '+(cy-17)+'Z" fill="'+cloth+'"/>';
  /* robe */
  s+='<path d="M'+(kid?14:10)+' 64C'+(kid?14:10)+' '+(kid?54:50)+' 21 '+(kid?47:44)+' 32 '+(kid?47:44)+'C43 '+(kid?47:44)+' '+(kid?50:54)+' '+(kid?54:50)+' '+(kid?50:54)+' 64Z" fill="'+robe+'"/>';
  var ny=kid?47:44;
  s+='<path d="M26.500 '+(ny+.4)+'Q32 '+(ny+7.5)+' 37.500 '+(ny+.4)+'Z" fill="'+avShade(skin,-.1)+'"/>';
  if(role==="pastor")s+='<path d="M24.500 '+(ny+1.5)+'L21.500 64H27.500L29.200 '+(ny+4.5)+'Z" fill="'+acc+'"/><path d="M39.500 '+(ny+1.5)+'L42.500 64H36.500L34.800 '+(ny+4.5)+'Z" fill="'+acc+'"/>';
  else if(role==="deacon")s+='<path d="M21 '+(ny+2.5)+'L41 64H48.500L25.500 '+(ny+.8)+'Z" fill="'+acc+'"/>';
  else if(role==="serve")s+='<path d="M17 59.500Q32 62.500 47 59.500" fill="none" stroke="'+acc+'" stroke-width="2.400" stroke-linecap="round"/>';
  /* neck + head */
  s+='<rect x="28.500" y="'+(cy+r-3)+'" width="7" height="6" rx="2.500" fill="'+avShade(skin,-.1)+'"/>';
  s+='<circle cx="32" cy="'+cy+'" r="'+r+'" fill="'+skin+'"/>';
  /* ears for men/boys without veil */
  if(!veil)s+='<circle cx="'+(32-r+.3)+'" cy="'+(cy+1.5)+'" r="2" fill="'+skin+'"/><circle cx="'+(32+r-.3)+'" cy="'+(cy+1.5)+'" r="2" fill="'+skin+'"/>';
  var headcloth=sex==="m"&&!kid&&((h>>>24)%3===0||role==="pastor"&&(h>>>24)%2===0);
  var beard=sex==="m"&&age!=null&&age>=24&&((h>>>20)%5!==0||age>=45||headcloth),longB=beard&&(old||(age>=45&&(h>>>22)%2===0));
  if(beard)s+='<path d="M'+(32-r+.4)+' '+(cy+1)+'C'+(32-r+.2)+' '+(cy+(longB?15:11))+' 26 '+(cy+(longB?23:15.500))+' 32 '+(cy+(longB?23:15.500))+'C38 '+(cy+(longB?23:15.500))+' '+(32+r-.2)+' '+(cy+(longB?15:11))+' '+(32+r-.4)+' '+(cy+1)+'C'+(32+r-2)+' '+(cy+5)+' 37.500 '+(cy+5.800)+' 32 '+(cy+5.800)+'C26.500 '+(cy+5.800)+' '+(32-r+2)+' '+(cy+5)+' '+(32-r+.4)+' '+(cy+1)+'Z" fill="'+hair+'"/>';
  /* hair / head cloth */
  if(veil){s+='<path d="M'+(32-r+.6)+' '+(cy-1)+'C'+(32-r+1)+' '+(cy-8)+' 27 '+(cy-10.500)+' 32 '+(cy-10.500)+'C37 '+(cy-10.500)+' '+(32+r-1)+' '+(cy-8)+' '+(32+r-.6)+' '+(cy-1)+'C'+(32+r-3.500)+' '+(cy-5.500)+' 36 '+(cy-6.800)+' 32 '+(cy-6.800)+'C28 '+(cy-6.800)+' '+(32-r+3.500)+' '+(cy-5.500)+' '+(32-r+.6)+' '+(cy-1)+'Z" fill="'+hair+'"/>';
    s+='<path d="M32 '+(cy-17)+'C22 '+(cy-17)+' 16.500 '+(cy-9.500)+' 16 '+(cy+2)+'C16 '+(cy+8)+' 15.600 '+(cy+12)+' 15 '+(cy+16)+'C18.500 '+(cy+13)+' 20 '+(cy+8)+' 20.200 '+(cy+1)+'C20.600 '+(cy-7)+' 25.500 '+(cy-12.200)+' 32 '+(cy-12.200)+'C38.500 '+(cy-12.200)+' 43.400 '+(cy-7)+' 43.800 '+(cy+1)+'C44 '+(cy+8)+' 45.500 '+(cy+13)+' 49 '+(cy+16)+'C48.400 '+(cy+12)+' 48 '+(cy+8)+' 48 '+(cy+2)+'C47.500 '+(cy-9.500)+' 42 '+(cy-17)+' 32 '+(cy-17)+'Z" fill="'+cloth+'"/>'}
  else if(headcloth){s+='<path d="M32 '+(cy-15)+'C23.500 '+(cy-15)+' 18.500 '+(cy-9.500)+' 18.500 '+(cy-1)+'C18.500 '+(cy+6)+' 18 '+(cy+11)+' 16.500 '+(cy+15)+'C20 '+(cy+12)+' 21 '+(cy+6)+' 21 '+(cy-1)+'C22.500 '+(cy-6.500)+' 26.500 '+(cy-8.800)+' 32 '+(cy-8.800)+'C37.500 '+(cy-8.800)+' 41.500 '+(cy-6.500)+' 43 '+(cy-1)+'C43 '+(cy+6)+' 44 '+(cy+12)+' 47.500 '+(cy+15)+'C46 '+(cy+11)+' 45.500 '+(cy+6)+' 45.500 '+(cy-1)+'C45.500 '+(cy-9.500)+' 40.500 '+(cy-15)+' 32 '+(cy-15)+'Z" fill="'+cloth+'"/><path d="M19.600 '+(cy-7.200)+'Q32 '+(cy-13.500)+' 44.400 '+(cy-7.200)+'" fill="none" stroke="'+(role?acc:ink)+'" stroke-width="2.400" stroke-linecap="round"/>'}
  else if(sex==="f"){/* girl / young woman without veil: long hair */
    s+='<path d="M32 '+(cy-r-2.500)+'C23 '+(cy-r-2.500)+' '+(32-r-2.500)+' '+(cy-6)+' '+(32-r-2.500)+' '+(cy+2)+'C'+(32-r-2.500)+' '+(cy+9)+' '+(32-r-3.500)+' '+(cy+14)+' '+(32-r-1)+' '+(cy+17)+'C'+(32-r+1.500)+' '+(cy+12)+' '+(32-r+1.500)+' '+(cy+5)+' '+(32-r+1.200)+' '+(cy-.5)+'C'+(32-r+5)+' '+(cy-3)+' 28 '+(cy-6)+' 30 '+(cy-9)+'C33 '+(cy-5)+' 39 '+(cy-2.500)+' '+(32+r-1.200)+' '+(cy-.5)+'C'+(32+r-1.500)+' '+(cy+5)+' '+(32+r-1.500)+' '+(cy+12)+' '+(32+r+1)+' '+(cy+17)+'C'+(32+r+3.500)+' '+(cy+14)+' '+(32+r+2.500)+' '+(cy+9)+' '+(32+r+2.500)+' '+(cy+2)+'C'+(32+r+2.500)+' '+(cy-6)+' 41 '+(cy-r-2.500)+' 32 '+(cy-r-2.500)+'Z" fill="'+hair+'"/>';
    if(kid||(h>>>19)%2)s+='<path d="M'+(32-r+1.500)+' '+(cy-7.500)+'Q32 '+(cy-13.500)+' '+(32+r-1.500)+' '+(cy-7.500)+'" fill="none" stroke="'+cloth+'" stroke-width="2.200" stroke-linecap="round"/>'}
  else{var bald=sex==="m"&&age!=null&&age>=50&&(h>>>26)%3===0;
    if(bald)s+='<path d="M'+(32-r+.3)+' '+(cy-.5)+'C'+(32-r-.2)+' '+(cy-5)+' '+(32-r+1.500)+' '+(cy-7)+' '+(32-r+3)+' '+(cy-8)+'C'+(32-r+2.500)+' '+(cy-5)+' '+(32-r+2)+' '+(cy-2.500)+' '+(32-r+.3)+' '+(cy-.5)+'ZM'+(32+r-.3)+' '+(cy-.5)+'C'+(32+r+.2)+' '+(cy-5)+' '+(32+r-1.500)+' '+(cy-7)+' '+(32+r-3)+' '+(cy-8)+'C'+(32+r-2.500)+' '+(cy-5)+' '+(32+r-2)+' '+(cy-2.500)+' '+(32+r-.3)+' '+(cy-.5)+'Z" fill="'+hair+'"/>';
    else if((h>>>27)%2||kid)s+='<path d="M'+(32-r+.2)+' '+(cy-.5)+'C'+(32-r-1.500)+' '+(cy-9)+' 25 '+(cy-r-2.200)+' 32 '+(cy-r-2.200)+'C39 '+(cy-r-2.200)+' '+(32+r+1.500)+' '+(cy-9)+' '+(32+r-.2)+' '+(cy-.5)+'C'+(32+r-2)+' '+(cy-4.500)+' 40 '+(cy-6.500)+' 37 '+(cy-7)+'C33 '+(cy-5)+' 26 '+(cy-5)+' '+(32-r+.2)+' '+(cy-.5)+'Z" fill="'+hair+'"/>';
    else s+='<path d="M'+(32-r+.2)+' '+(cy-.5)+'C'+(32-r-1.800)+' '+(cy-10)+' 25 '+(cy-r-2.800)+' 32 '+(cy-r-2.800)+'C39 '+(cy-r-2.800)+' '+(32+r+1.800)+' '+(cy-10)+' '+(32+r-.2)+' '+(cy-.5)+'C'+(32+r-2.500)+' '+(cy-5.500)+' 37 '+(cy-7.500)+' 32 '+(cy-7.500)+'C27 '+(cy-7.500)+' '+(32-r+2.500)+' '+(cy-5.500)+' '+(32-r+.2)+' '+(cy-.5)+'Z" fill="'+hair+'"/>'}
  /* face */
  var er=kid?1.900:1.600,ex=kid?4.800:4.500;
  s+='<circle cx="'+(32-ex)+'" cy="'+(ey+.5)+'" r="'+er+'" fill="'+ink+'"/><circle cx="'+(32+ex)+'" cy="'+(ey+.5)+'" r="'+er+'" fill="'+ink+'"/>';
  /* shepherd's staff for a pastor */
  if(role==="pastor")s+='<path d="M54.500 64V35C54.500 28.500 62 28.500 62 35" fill="none" stroke="#fff" stroke-width="2.800" stroke-linecap="round"/>';
  return '<svg class="avf" viewBox="0 0 64 64" role="img" aria-label="'+(o.label||"")+'"><defs><clipPath id="avc'+h+'"><circle cx="32" cy="32" r="32"/></clipPath><radialGradient id="'+gid+'a" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="'+B[1]+'"/><stop offset="1" stop-color="'+B[1]+'" stop-opacity="0"/></radialGradient><radialGradient id="'+gid+'b" cx=".95" cy="1" r=".75"><stop offset="0" stop-color="'+B[2]+'"/><stop offset="1" stop-color="'+B[2]+'" stop-opacity="0"/></radialGradient><radialGradient id="'+gid+'c" cx=".05" cy="0" r=".7"><stop offset="0" stop-color="'+B[3]+'"/><stop offset="1" stop-color="'+B[3]+'" stop-opacity="0"/></radialGradient></defs><g clip-path="url(#avc'+h+')">'+s+'</g></svg>'}
function avRole(id){return isPastor(id)?"pastor":isDeacon(id)?(dkTrialP(id)?"trial":"deacon"):Object.keys(S.min).some(function(k){return (S.min[k]||[]).indexOf(id)>=0})?"serve":""}
function avOk(p){return !!p&&(p.sex==="ч"||p.sex==="ж")}
function avOf(p){return avatarSvg({id:p.id,sex:p.sex,age:age(p.birth),role:avRole(p.id)})}
function avFig(p,cls){return avOk(p)?'<span class="av fig'+(cls&&cls.indexOf("big")>=0?" big":"")+'">'+avOf(p)+'</span>':'<span class="av '+(cls||"")+'">'+esc(ini(p))+'</span>'}
/* colour of the card header: what matters most about the person wins */
function heroCls(p,d){var st=d.st;if(st==="excluded")return "g-red";if(st==="left")return "g-clay";if(st==="moved")return "g-blue";if(st==="died")return "g-ink";if(st==="none")return "g-sand";if(st==="note")return "g-gold";
  var i=PART.indexOf(p.part);if(i===1)return "g-dust";if(i===2)return "g-khaki";if(i===3)return "g-blue";if(i===4)return "g-violet";
  if(isPastor(p.id))return "g-sun";if(isDeacon(p.id))return dkTrialP(p.id)?"g-steel":"g-olive";return "g-green"}

/* ---------- children are kept inside the parent's card: name + birth year (entered as an age) ---------- */
FL.hasKids="Чи є діти";
function kidAge(k){var y=+k.by;return y?Math.max(0,new Date().getFullYear()-y):null}
function kidFmt(k){var a=kidAge(k);return (k.name||"без імені")+(a!=null?" ("+a+" р.)":"")}
function kidsOwner(p){if(p.hasKids==="так"&&(p.kids||[]).length)return p;var ids=[];(p.rel||[]).forEach(function(r){if(/^(дружина|чоловік)$/.test(r.type||"")&&r.pid)ids.push(r.pid)});
  S.people.forEach(function(q){(q.rel||[]).forEach(function(r){if(r.pid===p.id&&/^(дружина|чоловік)$/.test(r.type||""))ids.push(q.id)})});
  for(var i=0;i<ids.length;i++){var q=person(ids[i]);if(q&&q.hasKids==="так"&&(q.kids||[]).length)return q}return null}
function kidsText(p,plain){var o=kidsOwner(p);if(o)return o.kids.map(kidFmt).join(", ")+(o!==p&&!plain?" · з картки: "+short(o):"");return p.hasKids==="ні"?"немає":p.hasKids==="так"?"є, не вписані":""}
function kidRow(i,k){var a=kidAge(k);return '<div class="kid"><input id="k_n_'+i+'" class="k-n" placeholder="Ім\'я" aria-label="Ім\'я дитини" value="'+esc(k.name||"")+'"><input id="k_a_'+i+'" class="k-a" type="number" inputmode="numeric" min="0" max="80" placeholder="Вік" aria-label="Вік дитини" value="'+(a==null?"":a)+'"><button type="button" class="iconbtn" data-act="kidDel" aria-label="Прибрати рядок" title="Прибрати">'+ico("x")+'</button></div>'}
function kidsForm(p,isNew){var kids=p.kids||[],key=(isNew?"new":p.id)+"|"+S.mode;if(S.kidKey!==key){S.kidKey=key;S.kidN=kids.length}var n=Math.max(kids.length,S.kidN||0,1),rows="";for(var i=0;i<n;i++)rows+=kidRow(i,kids[i]||{});
  return '<div class="wide kids"><label>Чи є діти<select id="f_haskids">'+opts(["так","ні"],p.hasKids,"—")+'</select></label><div id="kidsBox"'+(p.hasKids==="так"?"":" hidden")+'><div id="kidRows">'+rows+'</div><div class="bar"><button type="button" class="btn small" data-act="kidAdd">'+ico("plus")+' Додати дитину</button><span class="muted small">Вік вписуйте на сьогодні, далі він рахується сам.</span></div></div></div>'}
function kidsRead(){if(val("f_haskids")!=="так")return [];var y=new Date().getFullYear(),out=[];Array.prototype.forEach.call(document.querySelectorAll("#kidRows .kid"),function(r){var n=r.querySelector(".k-n").value.trim(),a=r.querySelector(".k-a").value.trim();if(!n&&a==="")return;var k={name:n.slice(0,80)};if(a!==""&&!isNaN(+a))k.by=y-Math.max(0,Math.min(80,Math.round(+a)));out.push(k)});return out}
document.addEventListener("change",function(e){if(e.target&&e.target.id==="f_haskids"){var b=document.getElementById("kidsBox");if(b){b.hidden=e.target.value!=="так";if(!b.hidden){var f=b.querySelector(".k-n");if(f&&!f.value)f.focus()}}}});
dlg.addEventListener("close",function(){S.kidKey=null});
