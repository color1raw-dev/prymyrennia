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
    '<div class="mm-l">'+meItem("tourStart","help","Як користуватись")+meItem("news","spark","Що нового")+meItem("meDash","sliders","Налаштувати огляд")+meItem("navEdit","swap","Порядок меню")+(users?meItem("meUsers","users",window.__SITE?"Користувачі й доступ":"Журнал і користувачі"):"")+(window.__push&&window.__push.state()==="on"?meItem("pushOff","bell","Вимкнути сповіщення"):window.__push&&window.__push.state()==="off"?meItem("pushOn","bell","Увімкнути сповіщення"):"")+'</div>'+
    (window.__SITE?'<div class="mm-l mm-out">'+meItem("","out","Вийти","siteOut")+'</div>':"");
  document.body.appendChild(el);var r=src.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight;
  if(src.id==="meBtnM"){var w=Math.min(320,vw-32);el.style.width=w+"px";el.style.top=(r.bottom+10)+"px";el.style.left=Math.max(16,Math.min(vw-16-w,r.right-w))+"px";el.style.transformOrigin="top right"}
  else{el.style.width=Math.max(r.width,292)+"px";el.style.left=r.left+"px";el.style.bottom=(vh-r.top+10)+"px";el.style.transformOrigin="bottom left";src.setAttribute("aria-expanded","true")}
  el.tabIndex=-1;if(src.id!=="meBtnM"&&!window.matchMedia("(pointer:coarse)").matches)el.focus({preventScroll:true})}
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
function render(){if(window.__wgBusy){window.__wgPending=1;return}var keep=null;try{keep=fieldsKeep()}catch(e){}if(S.tab==="reminders")S.tab="home";render0();try{var rb=document.getElementById("remBtn"),cb=document.getElementById("c_rem");if(rb&&cb)rb.classList.toggle("has",!cb.hidden)}catch(e){}try{if(S.tab!==render.t){render.t=S.tab;var nv=document.getElementById("nav"),cur=nv&&nv.querySelector('button[aria-current="page"]');if(cur&&nv.scrollWidth>nv.clientWidth+2)nv.scrollTo({left:cur.offsetLeft-(nv.clientWidth-cur.offsetWidth)/2,behavior:"smooth"})}}catch(e){}try{fieldsBack(keep)}catch(e){}}
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
 {id:"2026-10-09",d:"8 жовтня 2026",t:"Нова вкладка «Статистика» і мапа Чернівців",items:[
  ["pie","Вкладка «Статистика»","Усі цифри церкви тепер на одній сторінці, з кольоровими картками і діаграмами; кожен член церкви — крапка, на яку можна натиснути. Усередині: вік і стать, диякони і пастори, служіння, сім'ї, діти, як люди прийшли в церкву, чат. Шукайте її в меню перед «Звітами». Картки складаються щільно: коротка не розтягується під сусідню довгу, а наступна піднімається на вільне місце."],
  ["shield","Статистика служінь","Скільки людей у кожному служінні і скільки членів церкви служать загалом. Цей блок є й на головній сторінці — його можна сховати в «Налаштувати огляд»."],
  ["users","Сім'ї","Скільки в церкві сімей, скільки з дітьми, скільки без дітей і скільки з дітьми до 18 років."],
  ["heart","Діти до 18 років і недільна школа","Окрема статистика дітей, які не є членами церкви: скільки їх і якого віку. У картці батьків біля кожної дитини з'явилась галочка «нед. школа»."],
  ["pin","Мапа Чернівців за районами","Чиста мапа міста зі справжніми обрисами, Прутом і головними дорогами. На мапі райони: Садгора, Рогізна, Ленківці, Жучка, Калічанка, Клокучка, Роша, Цецино, Центр, Гореча, Гравітон, Проспект, Бульвар. Цифра показує, скільки членів церкви там живе; натисніть на район — відкриється вікно з його власною статистикою (люди, сім'ї, діти, вік, за ким закріплені) і списком людей. У картці з'явилось поле «Район Чернівців»; якщо район написаний в адресі, застосунок знайде його сам."],
  ["swap","«Як прийшов у церкву» можна змінити","Це поле тепер є в «Редагувати дані» поруч із датою прийняття."],
  ["shield","Служіння — окремими картками","У розділі «Служителі» кожне служіння тепер у своїй картці з кількістю людей, тож список легко читати. Перед тим як прибрати людину зі служіння, застосунок перепитає."],
  ["grid","Огляд, який можна зібрати під себе","На комп'ютері будь-який блок на головній можна затиснути мишкою і перетягнути на інше місце — решта плавно посунуться, як віджети на телефоні. За правий нижній кут блок можна зробити ширшим, вужчим або вищим — сусідні блоки самі підлаштуються, і порожнього місця не лишиться. Розташування зберігається за вами; повернути як було — у «Налаштувати огляд»."],
  ["swap","Свій порядок меню","Розділи меню можна розставити під себе: меню під вашим іменем → «Порядок меню», там просто перетягніть рядки. Порядок зберігається за вами і не змінюється в інших служителів."],
  ["help","Підказки тільки про нове","Після оновлення застосунок сам коротко покаже, що з'явилось, — без повторення всього навчання. Нові користувачі, як і раніше, бачать повне знайомство. Обидва варіанти є в меню під вашим іменем → «Що нового»."],
  ["clock","«Останні зміни» показують усе","На головній сторінці цей блок тепер показує справжні останні дії з журналу: хто, що і коли змінив. Раніше там були лише події членства."]]},
 {id:"2026-10-08-3",d:"7 жовтня 2026",t:"Діти прямо в картці",items:[
  ["heart","Діти в анкеті людини","В анкеті з'явилось питання «Чи є діти». Якщо так — одразу впишіть ім'я і вік кожної дитини, окрему картку для дитини заводити не треба. Кнопка «Додати дитину» додає ще рядок."],
  ["users","Де це видно","Діти з віком показуються в картці, у друці та в Excel. Вік сам зростає щороку. Якщо дітей вписано в картці чоловіка або дружини, вони видно і в картці другого з подружжя."]]},
 {id:"2026-10-08-2",d:"7 жовтня 2026",t:"Хто є в чаті «Примирення»",items:[
  ["users","Нове поле в анкеті","В анкеті людини з'явилось поле «У чаті «Примирення»» з вибором «так» або «ні». Воно видно в картці, друці та Excel."],
  ["grid","Видно одразу в списку","У списку людей поруч зі статусом є колонка «Чат»: «у чаті», «не в чаті» або «не вказано». Натисніть на заголовок колонки, щоб зібрати разом тих, кого ще не додали."],
  ["sliders","Хто ще не в чаті","На огляді в блоці «Варто перевірити» є рядок «не в чаті «Примирення»»: натисніть, щоб побачити список."]]},
 {id:"2026-10-07-4",d:"6 жовтня 2026",t:"Нагадування переїхали у дзвіночок",items:[
  ["bell","Дзвіночок замість пункту меню","Нагадування тепер відкриваються дзвіночком біля назви «Примирення» (на телефоні — вгорі праворуч). Цифра на ньому показує, скільки справ на сьогодні."],
  ["grid","Зручніші вікна","Поки відкрите вікно, сторінка під ним не прокручується."],
  ["swap","Меню на телефоні гортається","Кнопки «Ще» більше немає: усі розділи в одному рядку внизу, просто проведіть по меню вбік."]]},
 {id:"2026-10-07-2",d:"6 жовтня 2026",t:"У кожного свій чоловічок, у кожного статусу свій колір",items:[
  ["users","Аватарки замість ініціалів","Застосунок сам малює чоловічка за даними картки: стать, вік і служіння. У пастора посох і помаранчевий фон, у диякона стрічка й зелений, в інших служителів лаймовий пояс."],
  ["heart","Щоб чоловічок з'явився","Вкажіть у картці стать, а для точнішого вигляду ще й дату народження. Доки стать не вказана, лишається кружечок з ініціалами."],
  ["grid","Колір картки за статусом","Шапка картки людини тепер показує, хто це: член — зелена, пастор — помаранчева, диякон — оливкова, на випробувальному — сіро-блакитна, на замітці — золота, служить у ЗСУ — хакі, за кордоном або перейшов — синя, у процесі переходу — фіолетова, давно не відвідує — сіро-бежева, самоусунувся — теракотова, вилучений — червона, помер — чорна, не член — пісочна."],
  ["sliders","Кольорові мітки","Мітки статусу, стану в церкві, потреб і служінь у списку людей теж мають свої кольори."]]},
 {id:"2026-10-07",d:"6 жовтня 2026",t:"Нове меню, пастори з дияконами і статистика віку",items:[
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
  var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;NEWS_T=1;if(tourNewStart())return;S.card=null;S.mode="news";S.newsAll=false;renderDlg();newsSeen()}
function newsDlg(){var from=S.newsFrom==null?newsLast():S.newsFrom,cut=-1;NEWS.forEach(function(n,i){if(cut<0&&n.id===from)cut=i});var L=S.newsAll||cut<0?NEWS:NEWS.filter(function(n,i){return i<Math.max(1,cut)||n.d===NEWS[0].d});
  return '<div class="dlg news"><div class="dlg-head news-h"><div><span class="news-k">'+ico("spark")+' Оновлення · '+esc(NEWS[0].d)+'</span><h2>Що нового</h2></div><button class="iconbtn x" data-act="close" aria-label="Закрити">'+ico("x")+'</button></div>'+
    L.map(function(n,i){return (i&&n.d!==NEWS[0].d?'<h3 class="news-d">Раніше · '+esc(n.d)+'</h3>':"")+'<div class="news-t">'+esc(n.t)+'</div><ul class="news-l">'+n.items.map(function(x){return '<li><span class="si">'+ico(x[0])+'</span><span><b>'+esc(x[1])+'</b><span class="muted">'+esc(x[2])+'</span></span></li>'}).join("")+'</ul>'}).join("")+
    '<div class="bar">'+(L.length<NEWS.length?'<button class="btn" data-act="newsAll">Попередні оновлення</button>':"")+'<button class="btn" data-act="newsTour">'+ico("help")+' Усі підказки</button>'+(tourNewSteps().length?'<button class="btn" data-act="newsTourNew">'+ico("spark")+' Показати нове</button>':"")+'<span class="grow"></span><button class="btn primary" data-act="close">Зрозуміло</button></div></div>'}

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
function kidFmt(k){var a=kidAge(k),x=[a!=null?a+" р.":"",k.ss?"нед. школа":""].filter(Boolean).join(", ");return (k.name||"без імені")+(x?" ("+x+")":"")}
function kidsOwner(p){if(p.hasKids==="так"&&(p.kids||[]).length)return p;var ids=[];(p.rel||[]).forEach(function(r){if(/^(дружина|чоловік)$/.test(r.type||"")&&r.pid)ids.push(r.pid)});
  S.people.forEach(function(q){(q.rel||[]).forEach(function(r){if(r.pid===p.id&&/^(дружина|чоловік)$/.test(r.type||""))ids.push(q.id)})});
  for(var i=0;i<ids.length;i++){var q=person(ids[i]);if(q&&q.hasKids==="так"&&(q.kids||[]).length)return q}return null}
function kidsText(p,plain){var o=kidsOwner(p);if(o)return o.kids.map(kidFmt).join(", ")+(o!==p&&!plain?" · з картки: "+short(o):"");return p.hasKids==="ні"?"немає":p.hasKids==="так"?"є, не вписані":""}
function kidRow(i,k){var a=kidAge(k);return '<div class="kid"><input id="k_n_'+i+'" class="k-n" placeholder="Ім\'я" aria-label="Ім\'я дитини" value="'+esc(k.name||"")+'"><input id="k_a_'+i+'" class="k-a" type="number" inputmode="numeric" min="0" max="80" placeholder="Вік" aria-label="Вік дитини" value="'+(a==null?"":a)+'"><label class="k-s" title="Відвідує недільну школу"><input type="checkbox" id="k_s_'+i+'"'+(k.ss?" checked":"")+'><span>нед. школа</span></label><button type="button" class="iconbtn" data-act="kidDel" aria-label="Прибрати рядок" title="Прибрати">'+ico("x")+'</button></div>'}
function kidsForm(p,isNew){var kids=p.kids||[],key=(isNew?"new":p.id)+"|"+S.mode;if(S.kidKey!==key){S.kidKey=key;S.kidN=kids.length}var n=Math.max(kids.length,S.kidN||0,1),rows="";for(var i=0;i<n;i++)rows+=kidRow(i,kids[i]||{});
  return '<div class="wide kids"><label>Чи є діти<select id="f_haskids">'+opts(["так","ні"],p.hasKids,"—")+'</select></label><div id="kidsBox"'+(p.hasKids==="так"?"":" hidden")+'><div id="kidRows">'+rows+'</div><div class="bar"><button type="button" class="btn small" data-act="kidAdd">'+ico("plus")+' Додати дитину</button><span class="muted small">Вік вписуйте на сьогодні, далі він рахується сам.</span></div></div></div>'}
function kidsRead(){if(val("f_haskids")!=="так")return [];var y=new Date().getFullYear(),out=[];Array.prototype.forEach.call(document.querySelectorAll("#kidRows .kid"),function(r){var n=r.querySelector(".k-n").value.trim(),a=r.querySelector(".k-a").value.trim();if(!n&&a==="")return;var k={name:n.slice(0,80)};if(a!==""&&!isNaN(+a))k.by=y-Math.max(0,Math.min(80,Math.round(+a)));var c=r.querySelector(".k-s input");if(c&&c.checked)k.ss=1;out.push(k)});return out}
document.addEventListener("change",function(e){if(e.target&&e.target.id==="f_haskids"){var b=document.getElementById("kidsBox");if(b){b.hidden=e.target.value!=="так";if(!b.hidden){var f=b.querySelector(".k-n");if(f&&!f.value)f.focus()}}}});
dlg.addEventListener("close",function(){S.kidKey=null});

/* ---------- statistics: ministries, families, children, map of districts, the «Статистика» tab ---------- */
TITLES.stats="Статистика";SUBT.stats="Уся церква в цифрах";
ICO.pie='<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15.5 3.6a9 9 0 0 1 4.9 4.9h-4.9z"/>';
ICO.pin='<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>';
var SPO=/^(дружина|чоловік)$/;
/* districts of Chernivtsi: name, x, y on the map (projected from OpenStreetMap coordinates), label side, pattern to find the district in an address */
var DIST=[["Садгора",402,203,"r",/садг[оі]р/],["Рогізна",340,204,"l",/рогізн/],["Ленківці",243,280,"l",/ленківц/],["Жучка",419,313,"r",/жучк/],["Калічанка",433,397,"r",/кал[іи]чанк/],["Клокучка",279,370,"l",/клокучк/],["Роша",225,418,"l",/(^|[^а-яіїєґ'])рош[аіу]|ст[иі]нк/],["Цецино",116,406,"l",/цецин/],["Центр",343,422,"l",/(^|[^а-яіїєґ'])центр([^а-яіїєґ']|$)|старе місто/],["Гореча",517,452,"r",/гореч/],["Гравітон",470,500,"r",/гравітон/],["Проспект",382,500,"l",/проспект|пр-т|просп\./],["Бульвар",394,572,"r",/бульвар|героїв крут|комаров|південно|кільцев/]];
var MAPG={b:"M0 381L125 484L298 545L332 582L338 608L349 590L361 593L358 583L388 600L413 599L409 578L456 557L472 580L478 577L466 554L487 544L508 508L517 512L549 486L512 433L553 390L525 313L529 303L587 330L600 209L566 191L589 144L568 128L588 115L599 127L608 110L584 90L577 100L518 97L542 46L516 0L485 6L441 70L426 74L420 65L333 108L300 112L271 94L232 102L181 85L161 216L188 230L175 255L188 264L185 275L155 263L152 289L228 299L233 321L246 327L250 318L259 328L200 356L86 354L96 369L73 363L25 385L6 372Z",r:"M-26 234l6 1 8-2 15-7 7-1 7 2 9 7 11 2 8-2 16-11 4-1 12 6 6 5 9 17 11 11 8 15 7 8 4 1 21 2 11-1 4-3 14 3 12-1 31 10 17 3 10 6 19 23 9 6 26 11 11 2 36 2 32 10 31 1 32-3 14 2 11 4 23 13 7 7 4 8 1 7-5 16 1 7 3 5 14 9 9 10 10 14 9 18 12 16 9 5 7 2 7-1 17-8 10 0 10 2 10 6 20 21 8 4",h:"M344 442l-5-1-7 29M344 442l-4-9 7-21M321 517l-2 7 4 37 6 17M344 442l63 136M398 437l17-18 3-1 7 4M418 413l-12-31M406 382l-1-19 3-43M406 382l-1-14 2-48M552 392l-13 8-10 21-28 20-5 0-11-3-10-8-8-3-5 0-16 5-16-7M416 295l25-6 9-5 21 15 25 11 27 4 3 5 17 52 6 11 5 5M346 400l-1 5 2 7M332 470l-75 62-6 2-19-3-10 4-53 71-50 42M557 392l5 8 19 23M297 352l4 9 5 6 5 2 5 11 22 12 8 8M47 178l72 17 98 49 30 22 11 12 8 17 3 18 10 13 4 2 14 3M525 524l6-8 3-17 5-6 19-12 26-2 10-3 10-7 11-13M524 516l11 6-6 5-5-2M609 443l7 9-1 4M617 454l7-6 4 0M332 581l57 5 18-8M398 437l41 18 22 15 47 37 16 9M398 437l-29-9-18-23M406 298l-99 28M407 578l23 50 11 18M414 298l-6 22M409 299l2 5-4 16M322 511l10-41M609 443l8 3 17 3 12 8M524 525l-21 17-4 8 0 10 6 10 49 49 3 12-2 11M617 440l3 3-3 11M40 176l-70-16M43 173l-62-119M617 446l-11-6M617 446l19 3 13 10M609 443l-21-13-7-7M606 440l-16-9-9-8"};
function distNames(){return DIST.map(function(d){return d[0]})}
function distOf(p){if(p.district&&distNames().indexOf(p.district)>=0)return p.district;var t=((p.address||"")+" "+(p.place||"")).toLowerCase();for(var i=0;i<DIST.length;i++)if(DIST[i][4].test(t))return DIST[i][0];return ""}
/* where a person lives: {k:"d",v:district} | {k:"c"} city, district unknown | {k:"o",v:settlement} | {k:"n"} nothing written */
function liveOf(p){var d=distOf(p);if(d)return {k:"d",v:d};var pl=(p.place||"").trim();if(!pl)return p.address?{k:"c"}:{k:"n"};return /чернівц/i.test(pl)?{k:"c"}:{k:"o",v:pl}}
function serveStats(){var A=act(),mem={},sv={},rows=[];A.forEach(function(x){mem[x.p.id]=1});
  function add(n,ids,cnt){ids.forEach(function(i){if(i)sv[i]=1});if(cnt)rows.push([n,cnt])}
  add(S.pastors.length>1?"Пастори":"Пастор",S.pastors.map(function(p){return p.pid}),S.pastors.length);
  add("Диякони",S.dk.map(function(d){return d.pid}),S.dk.length);
  var rr=roleNames().map(function(r){return [r,(S.min[r]||[]).filter(function(i){return person(i)})]}).filter(function(r){return r[1].length}).sort(function(a,b){return b[1].length-a[1].length});
  rr.forEach(function(r){add(r[0],r[1],r[1].length)});
  var ld=[];S.groups.forEach(function(g){if(g.leader&&ld.indexOf(g.leader)<0)ld.push(g.leader)});add("Лідери малих груп",ld,ld.length);
  var n=Object.keys(sv).filter(function(i){return mem[i]}).length;return {rows:rows,n:n,total:A.length,free:A.length-n}}
function servePanel(link){var s=serveStats();return '<div class="panel pad"'+(link?' id="hServe"':"")+'>'+sh("Служіння",null,'<span class="tag lime">служать '+s.n+' з '+s.total+'</span>')+(s.rows.length?'<div>'+hbars(s.rows)+'</div>':'<div class="muted">Служіння ще нікому не призначені.</div>')+'<div class="muted small">Одна людина може мати кілька служінь, тому сума рядків буває більшою. Без служіння: '+s.free+'.</div>'+(link?'<div class="bar"><button class="btn small" data-act="nav" data-v="stats">'+ico("pie")+' Уся статистика</button></div>':"")+'</div>'}
function famStats(){var A=act(),par={},byId={};A.forEach(function(x){par[x.p.id]=x.p.id;byId[x.p.id]=x});
  function f(i){while(par[i]!==i){par[i]=par[par[i]];i=par[i]}return i}function un(a,b){if(par[a]==null||par[b]==null)return;par[f(a)]=f(b)}
  var fn={},pairs=0;A.forEach(function(x){(x.p.rel||[]).forEach(function(r){if(SPO.test(r.type||"")&&r.pid&&byId[r.pid]){if(f(x.p.id)!==f(r.pid))pairs++;un(x.p.id,r.pid)}});var k=(x.p.family||"").trim().toLowerCase();if(k){if(fn[k])un(x.p.id,fn[k]);else fn[k]=x.p.id}});
  var U={};A.forEach(function(x){var r=f(x.p.id);(U[r]=U[r]||[]).push(x)});
  var cards=all().filter(function(x){return x.d.st==="none"&&(x.p.kind==="дитина члена церкви"||(x.a!=null&&x.a<18))}),used={};
  var units=Object.keys(U).map(function(k){var xs=U[k],ids={},fam={},kids=[],seen={},yes=false,no=false,mar=false;
    xs.forEach(function(x){ids[x.p.id]=1;if(x.p.family)fam[x.p.family.trim().toLowerCase()]=1;if(x.p.marital==="у шлюбі"||(x.p.rel||[]).some(function(r){return SPO.test(r.type||"")}))mar=true;if(x.p.hasKids==="так")yes=true;if(x.p.hasKids==="ні")no=true});
    var names=xs.map(function(x){return short(x.p)}).join(", ");
    xs.forEach(function(x){if(x.p.hasKids!=="так")return;(x.p.kids||[]).forEach(function(c){var key=(c.name||"").trim().toLowerCase()+"|"+(c.by||"");if(c.name&&seen[key])return;seen[key]=1;seen["n:"+(c.name||"").trim().toLowerCase()]=1;kids.push({name:c.name||"без імені",a:kidAge(c),ss:!!c.ss,par:names})})});
    cards.forEach(function(c){if(used[c.p.id])return;var link=(c.p.rel||[]).some(function(r){return ids[r.pid]&&/^(батько|мати)$/.test(r.type||"")})||xs.some(function(x){return (x.p.rel||[]).some(function(r){return r.pid===c.p.id&&/^(син|донька)$/.test(r.type||"")})})||(c.p.family&&fam[c.p.family.trim().toLowerCase()]);
      if(!link)return;used[c.p.id]=1;yes=true;var fnm=(c.p.first||"").trim().toLowerCase();if(fnm&&seen["n:"+fnm])return;kids.push({name:c.p.first||short(c.p),a:c.a,ss:false,par:names,id:c.p.id})});
    return {xs:xs,kids:kids,fam:xs.length>1||mar||yes||kids.length>0,st:kids.length||yes?"y":no?"n":"u",minor:kids.some(function(c){return c.a!=null&&c.a<18})}});
  var kids=[];units.forEach(function(u){kids=kids.concat(u.kids)});cards.forEach(function(c){if(!used[c.p.id])kids.push({name:short(c.p),a:c.a,ss:false,par:"",id:c.p.id})});
  var F=units.filter(function(u){return u.fam});
  return {units:units,fams:F.length,withK:F.filter(function(u){return u.st==="y"}).length,noK:F.filter(function(u){return u.st==="n"}).length,unk:F.filter(function(u){return u.st==="u"}).length,minor:F.filter(function(u){return u.minor}).length,single:units.length-F.length,pairs:pairs,
    kids:kids.filter(function(c){return c.a!=null&&c.a<18}).sort(function(a,b){return a.a-b.a||a.name.localeCompare(b.name,"uk")}),noAge:kids.filter(function(c){return c.a==null}).length}}
/* clean map: one green silhouette of the city, the river, a few main roads; every district with people is a white chip (number + name) */
function mapSvg(C,sel){var mob=false;try{mob=window.innerWidth<=760}catch(e){}var fs=mob?18:13.5,H=fs+13,R=H/2-3;
  var s='<svg class="cmap" viewBox="-24 -22 664 664" role="img" aria-label="Мапа Чернівців за районами"><defs><clipPath id="cmClip"><path d="'+MAPG.b+'"/></clipPath>'+
    '<linearGradient id="cmG" gradientUnits="userSpaceOnUse" x1="120" y1="40" x2="520" y2="610"><stop offset="0" stop-color="#17603a"/><stop offset=".5" stop-color="#23893f"/><stop offset="1" stop-color="#4fb04a"/></linearGradient>'+
    '<filter id="cmS" x="-20%" y="-40%" width="140%" height="200%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0b2a17" flood-opacity=".35"/></filter></defs>'+
    '<path class="cm-city" d="'+MAPG.b+'"/><g clip-path="url(#cmClip)"><path class="cm-hw" d="'+MAPG.h+'"/></g><path class="cm-riv" d="'+MAPG.r+'"/><text class="cm-rl" x="50" y="204" transform="rotate(-14 50 204)" style="font-size:'+(fs-1)+'px">Прут</text>';
  var top="";DIST.forEach(function(d){var n=C[d[0]]||0,x=d[1],y=d[2],left=d[3]==="l",on=sel===d[0],tw=d[0].length*fs*.6,g='<g class="cm-d'+(n?"":" z")+(on?" on":"")+'" data-act="mapD" data-v="'+d[0]+'" data-tip="'+d[0]+": "+n+'">';
    if(!n){g+='<circle class="cm-hit" cx="'+x+'" cy="'+y+'" r="20"/><circle class="cm-z" cx="'+x+'" cy="'+y+'" r="'+(mob?5:4)+'"/><text class="cm-zt" text-anchor="'+(left?"end":"start")+'" x="'+(left?x-10:x+10)+'" y="'+(y+fs*.34).toFixed(1)+'" style="font-size:'+(fs-1)+'px">'+d[0]+'</text></g>';s+=g;return}
    var w=H+tw+10,px=left?x+H/2-w:x-H/2,nt=String(n);
    g+='<rect class="cm-p" x="'+px.toFixed(1)+'" y="'+(y-H/2).toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+H.toFixed(1)+'" rx="'+(H/2).toFixed(1)+'" filter="url(#cmS)"/><circle class="cm-b" cx="'+x+'" cy="'+y+'" r="'+R.toFixed(1)+'"/><text class="cm-n" x="'+x+'" y="'+(y+fs*.36).toFixed(1)+'" style="font-size:'+(nt.length>2?fs-3:fs)+'px">'+nt+'</text><text class="cm-t" text-anchor="'+(left?"end":"start")+'" x="'+(left?x-H/2-2:x+H/2+2).toFixed(1)+'" y="'+(y+fs*.35).toFixed(1)+'" style="font-size:'+fs+'px">'+d[0]+'</text></g>';top+=g});
  return s+top+'</svg>'}
function mapPanel(){var A=act(),C={},city=[],none=[],out={},by={};A.forEach(function(x){var l=liveOf(x.p);if(l.k==="d"){C[l.v]=(C[l.v]||0)+1;(by[l.v]=by[l.v]||[]).push(x)}else if(l.k==="c")city.push(x);else if(l.k==="n")none.push(x);else out[l.v]=(out[l.v]||0)+1});
  var sel="",on=Object.keys(C).reduce(function(a,k){return a+C[k]},0),orows=Object.keys(out).sort(function(a,b){return out[b]-out[a]}).map(function(k){return [k,out[k]]}),nout=orows.reduce(function(a,r){return a+r[1]},0);
  var top=DIST.map(function(d){return [d[0],C[d[0]]||0]}).filter(function(r){return r[1]}).sort(function(a,b){return b[1]-a[1]});
  var side='<div class="cm-kp"><div><b>'+on+'</b><span>на мапі</span></div><div><b>'+nout+'</b><span>поза містом</span></div><div><b>'+(city.length+none.length)+'</b><span>без району</span></div></div>'+
    (top.length?'<div><div class="rl">Райони</div><div>'+hbars(top,"mapD")+'</div></div>':"")+
    (orows.length?'<div><div class="rl">Поза Чернівцями</div><div>'+hbars(orows)+'</div></div>':"")+
    (city.length||none.length?'<div class="bar">'+(city.length?'<button class="btn small" data-act="mapD" data-v="-">Район не вказано · '+city.length+'</button>':"")+(none.length?'<button class="btn small" data-act="mapD" data-v="?">Адреси немає · '+none.length+'</button>':"")+'</div>':"");
  var tips='<div class="cm-tips"><div><span class="si">'+ico("pin")+'</span><span><b>Цифра біля району</b>скільки там живе членів церкви</span></div><div><span class="si">'+ico("users")+'</span><span><b>Натисніть на район</b>відкриється його статистика і люди</span></div><div><span class="si">'+ico("sliders")+'</span><span><b>Звідки район</b>з поля «Район» у картці або з адреси</span></div></div><div class="cm-osm">Обриси міста, Прут і дороги — © OpenStreetMap</div>';
  return '<section class="panel pad mapc"><div>'+sh('<span class="si t-lime">'+ico("pin")+'</span>Де живуть члени церкви')+'<div class="cm-wrap">'+mapSvg(C,sel)+'</div>'+tips+'</div><div class="cm-side">'+side+'</div></section>'}
function stPl(n,a,b,c){var m=n%100,k=n%10;return m>10&&m<20?c:k===1?a:k>=2&&k<=4?b:c}
/* popup of one district: its own numbers and people */
function distPeople(sel){return act().filter(function(x){var l=liveOf(x.p);return sel==="-"?l.k==="c":sel==="?"?l.k==="n":l.k==="d"&&l.v===sel})}
function servIds(){var o={};S.pastors.forEach(function(p){if(p.pid)o[p.pid]=1});S.dk.forEach(function(d){if(d.pid)o[d.pid]=1});Object.keys(S.min).forEach(function(k){(S.min[k]||[]).forEach(function(i){o[i]=1})});S.groups.forEach(function(g){if(g.leader)o[g.leader]=1});return o}
function distDlg(){var sel=S.mapSel||"",A=act(),L=distPeople(sel),name=sel==="-"?"Район не вказано":sel==="?"?"Адреси немає":sel,ids={};L.forEach(function(x){ids[x.p.id]=1});
  var men=L.filter(function(x){return x.p.sex==="ч"}).length,wom=L.filter(function(x){return x.p.sex==="ж"}).length,ages=L.map(function(x){return x.a}).filter(function(a){return a!=null}),med=num(median(ages))||"—";
  var U=famStats().units.filter(function(u){return u.xs.some(function(x){return ids[x.p.id]})}),fams=U.filter(function(u){return u.fam}),kids=0,ss=0,seen=[];fams.forEach(function(u){u.kids.forEach(function(c){if(c.a!=null&&c.a<18){kids++;if(c.ss)ss++}})});
  var sv=servIds(),serv=L.filter(function(x){return sv[x.p.id]}).length,chat=L.filter(function(x){return x.p.chat==="так"}).length,pcv=A.length?Math.round(L.length/A.length*100):0;
  var h='<div class="dlg dist"><div class="dlg-head hero-head g-green"><div class="ds-h"><span class="ds-k">'+ico("pin")+(sel==="-"||sel==="?"?"Чернівці":"Район Чернівців")+'</span><h2>'+esc(name)+'</h2><div class="muted">'+L.length+' '+stPl(L.length,"член церкви","члени церкви","членів церкви")+' · '+pcv+'% церкви</div></div><button class="iconbtn x" data-act="close" aria-label="Закрити">'+ico("x")+'</button></div>';
  if(!L.length)return h+'<div class="ds-c cw-e">'+ico("pin")+'<span>'+(sel==="-"||sel==="?"?"Таких людей немає.":"У цьому районі ще ніхто не записаний. Щоб людина з\'явилась тут, виберіть район у її картці: «Редагувати дані» → «Район Чернівців» — або допишіть назву району в адресу.")+'</span></div></div>';
  function tl(v,t,c){return '<div'+(c?' class="'+c+'"':"")+'><b>'+v+'</b><span>'+t+'</span></div>'}
  h+='<div class="ds-g">'+tl(L.length,"членів церкви","hl")+tl(men,"чоловіків")+tl(wom,"жінок")+tl(med,"медіанний вік")+tl(fams.length,"сімей")+tl(kids,"дітей до 18")+tl(ss,"у недільній школі")+tl(serv,"мають служіння")+'</div>';
  var G=[["до 18",0,17],["18–35",18,35],["36–60",36,60],["61+",61,200]],gr=G.map(function(g){return [g[0],ages.filter(function(a){return a>=g[1]&&a<=g[2]}).length]}),na=L.length-ages.length;if(na)gr.push(["вік невідомий",na]);
  var dk={};L.forEach(function(x){var k=x.d.deacon||"Не закріплені";dk[k]=(dk[k]||0)+1});var dr=Object.keys(dk).sort(function(a,b){return dk[b]-dk[a]}).map(function(k){return [k,dk[k]]});
  h+='<div class="ds-2"><div class="ds-c"><h3>Вік</h3><div class="st-bars b-sun">'+hbars(gr)+'</div></div><div class="ds-c"><h3>За ким закріплені</h3><div class="st-bars b-green">'+hbars(dr)+'</div></div></div>';
  h+='<div class="ds-c"><h3>Люди <span class="cn">'+L.length+'</span></h3><div class="cw-l">'+L.map(function(x){return '<button class="cw-p" data-act="open" data-id="'+esc(x.p.id)+'">'+avFig(x.p,avc(x.n))+'<span><b>'+esc(short(x.p))+'</b><small>'+esc([x.a!=null?x.a+" р.":"",x.p.address||""].filter(Boolean).join(" · ")||x.d.deacon||"вік не вказано")+'</small></span></button>'}).join("")+'</div></div>';
  return h+'</div>'}
/* small chart helpers of the statistics tab */
function stRing(p,big,sub){var c=2*Math.PI*42,v=Math.max(0,Math.min(1,p||0));return '<span class="st-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="rt" cx="50" cy="50" r="42"/><circle class="rv" cx="50" cy="50" r="42" stroke-dasharray="'+(c*v).toFixed(1)+" "+c.toFixed(1)+'" transform="rotate(-90 50 50)"/></svg><span class="rc"><b>'+big+'</b>'+(sub?'<small>'+sub+'</small>':"")+'</span></span>'}
function stDonut(segs,big,sub){var tot=segs.reduce(function(a,s){return a+s[1]},0),c=2*Math.PI*42,off=0,h="";segs.forEach(function(s){if(!s[1]||!tot)return;var l=c*s[1]/tot,gap=segs.filter(function(q){return q[1]}).length>1?3:0;h+='<circle class="'+s[2]+'" cx="50" cy="50" r="42" stroke-dasharray="'+Math.max(0.5,l-gap).toFixed(1)+" "+c.toFixed(1)+'" stroke-dashoffset="'+(-off).toFixed(1)+'" transform="rotate(-90 50 50)"><title>'+esc(s[0]+": "+s[1])+'</title></circle>';off+=l});
  return '<span class="st-ring big"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="rt" cx="50" cy="50" r="42"/>'+h+'</svg><span class="rc"><b>'+big+'</b>'+(sub?'<small>'+sub+'</small>':"")+'</span></span>'}
function stLegend(segs){return '<ul class="st-leg">'+segs.map(function(s){return '<li><i class="'+s[2]+'"></i><span>'+esc(s[0])+'</span><b>'+s[1]+'</b></li>'}).join("")+'</ul>'}
function vStats(){var A=act(),Y=yearStats(),cy=Y[CY]||{inn:0,out:0},ages=A.map(function(x){return x.a}).filter(function(a){return a!=null}),net=cy.inn-cy.out,sign=(net>0?"+":"")+net;
  var men=A.filter(function(x){return x.p.sex==="ч"}).length,wom=A.filter(function(x){return x.p.sex==="ж"}).length,medv=median(ages),med=num(medv);
  function pc(n,t){t=t==null?A.length:t;return t?Math.round(n/t*100):0}
  function pan(t,b,r,ic,cl){return '<div class="panel pad st-bars'+(cl?" "+cl:"")+'">'+sh((ic?'<span class="si">'+ico(ic)+'</span>':"")+t,null,r)+b+'</div>'}
  function cntBy(fn){var o={};A.forEach(function(x){var k=fn(x)||"не вказано";o[k]=(o[k]||0)+1});return Object.keys(o).sort(function(a,b){return o[b]-o[a]}).map(function(k){return [k,o[k]]})}
  var sv=serveStats(),sp=pc(sv.n),dots="";for(var i=0;i<30;i++)dots+='<u'+(i<Math.round(sp/100*30)?' class="on"':"")+'></u>';
  /* bento of gradient tiles: every member is a dot */
  var F=famStats(),K=F.kids,ss=K.filter(function(c){return c.ss}).length,big=A.length>260?" sm":A.length<=45?" lg":A.length<=120?" md":"";
  var ppl=A.slice().sort(function(a,b){return (a.p.sex==="ж")-(b.p.sex==="ж")}).map(function(x){return '<button class="'+(x.p.sex==="ж"?"w":x.p.sex==="ч"?"m":"n")+'" data-act="open" data-id="'+esc(x.p.id)+'" data-tip="'+esc(x.n)+'" aria-label="'+esc(x.n)+'"></button>'}).join("");
  var fsg=[F.withK,F.noK,F.unk],kdt=K.slice(0,60).map(function(c){return '<u'+(c.ss?' class="on"':"")+'></u>'}).join("");
  var h='<section class="st-bento">'+
    '<div class="feature f-green st-main"><div class="sm-top"><span class="fl">Членів церкви</span><span class="sm-chip">'+ico(net<0?"trenddown":net>0?"trend":"trendflat")+(net?sign+" за "+CY+" рік":"без змін за "+CY+" рік")+'</span></div>'+
      '<div class="sm-mid"><span class="fv">'+A.length+'</span><span class="sm-sx"><span><b>'+men+'</b>чоловіків · '+pc(men)+'%</span><span><b>'+wom+'</b>жінок · '+pc(wom)+'%</span></span></div>'+
      '<div class="sm-ppl'+big+'">'+ppl+'</div><div class="sm-leg"><span><i class="m"></i>чоловіки</span><span><i class="w"></i>жінки</span><span class="grow"></span><span>кожна крапка — людина, натисніть на неї</span></div></div>'+
    '<button class="feature f-sun" data-act="ages"><span class="fl">Медіанний вік</span><span><span class="fv">'+(med||"—")+'</span><span class="fs">'+(ages.length?"від "+Math.min.apply(null,ages)+" до "+Math.max.apply(null,ages)+" р.":"")+'</span></span><span class="ruler-w"><span class="ruler"></span>'+(medv!==""?'<i style="left:'+Math.min(96,Math.max(4,medv))+'%"></i>':"")+'</span></button>'+
    '<button class="feature f-sky" data-act="nav" data-v="deacons"><span class="fl">Мають служіння</span><span><span class="fv">'+sp+'<small>%</small></span><span class="fs">'+sv.n+' з '+sv.total+' членів церкви</span></span><span class="st-dots">'+dots+'</span></button>'+
    '<button class="feature f-plum" data-act="stGo" data-v="stFam"><span class="fl">Сімей</span><span><span class="fv">'+F.fams+'</span><span class="fs">з дітьми '+F.withK+' · без дітей '+F.noK+'</span></span><span class="st-seg">'+fsg.map(function(n,i){return n?'<i class="s'+i+'" style="flex:'+n+'"></i>':""}).join("")+'</span></button>'+
    '<button class="feature f-rose" data-act="stGo" data-v="stKids"><span class="fl">Дітей до 18 років</span><span><span class="fv">'+K.length+'</span><span class="fs">'+(K.length?"у недільній школі "+ss:"ще не вписані")+'</span></span><span class="st-kd">'+(kdt||"<u></u><u></u><u></u>")+'</span></button></section>';
  /* dark: age and sex pyramid + movement by years */
  var G=[["до 18",0,17],["18–35",18,35],["36–60",36,60],["61+",61,200]],PR=G.map(function(g){function f(sx){return A.filter(function(x){return x.a!=null&&x.a>=g[1]&&x.a<=g[2]&&x.p.sex===sx}).length}return [g[0],f("ч"),f("ж")]}),na=A.length-ages.length;
  var pm=Math.max.apply(null,PR.map(function(r){return Math.max(r[1],r[2])}).concat([1]));
  var pyr='<div class="pyr">'+PR.map(function(r){return '<div class="pyr-r" data-tip="'+esc(r[0]+": чоловіків "+r[1]+", жінок "+r[2])+'"><span class="pyr-m"><b>'+r[1]+'</b><i style="width:'+(r[1]/pm*100)+'%"></i></span><span class="pyr-l">'+r[0]+'</span><span class="pyr-w"><i style="width:'+(r[2]/pm*100)+'%"></i><b>'+r[2]+'</b></span></div>'}).join("")+'</div>'+(na?'<div class="muted small">Вік невідомий: '+na+'</div>':"");
  var ys=[];for(var y=CY-7;y<=CY;y++)ys.push(y);var mx=Math.max.apply(null,ys.map(function(y){var r=Y[y]||{inn:0,out:0};return Math.max(r.inn,r.out)}).concat([1]));
  h+='<section class="dark st-dark"><div>'+sh("Вік і стать",null,'<div class="legend"><span><i style="background:var(--cin)"></i>чоловіки</span><span><i style="background:var(--ink-fg)"></i>жінки</span></div>')+pyr+'<div class="bar"><button class="btn small" data-act="ages">Докладніше про вік</button></div></div>'+
    '<div>'+sh("Рух за роками",null,'<div class="legend"><span><i style="background:var(--cin)"></i>прийнято</span><span><i style="background:var(--out)"></i>вибуло</span></div>')+'<div><div class="vchart">'+ys.map(function(y){var r=Y[y]||{inn:0,out:0};return '<div class="vg"><div class="vb in'+(r.inn?"":" zero")+'" style="height:'+(r.inn/mx*100)+'%" data-tip="'+y+': прийнято '+r.inn+'"><span>'+(r.inn||"")+'</span></div><div class="vb out'+(r.out?"":" zero")+'" style="height:'+(r.out/mx*100)+'%" data-tip="'+y+': вибуло '+r.out+'"><span>'+(r.out||"")+'</span></div></div>'}).join("")+'</div><div class="vx">'+ys.map(function(y){return '<div>'+y+'</div>'}).join("")+'</div></div></div></section>';
  h+=mapPanel();
  /* families and children */
  var fs=[["з дітьми",F.withK,"c1"],["без дітей",F.noK,"c2"],["про дітей не вказано",F.unk,"c3"]];
  var KG=[["до 6 років",0,6],["7–12 років",7,12],["13–17 років",13,17]];
  var kd=KG.map(function(g){var L=K.filter(function(c){return c.a>=g[1]&&c.a<=g[2]});return '<div class="kd-g"><div class="kd-h"><span>'+g[0]+'</span><b>'+L.length+'</b></div><div class="kd-d">'+(L.length?L.map(function(c){return '<u'+(c.ss?' class="on"':"")+' data-tip="'+esc(c.name+", "+c.a+" р."+(c.ss?" · недільна школа":"")+(c.par?" · "+c.par:""))+'"></u>'}).join(""):'<span class="muted small">немає</span>')+'</div></div>'}).join("");
  h+='<div class="st-duo">'+
    '<div class="panel pad" id="stFam">'+sh('<span class="si t-lime">'+ico("users")+'</span>Сім\'ї')+'<div class="st-fam">'+stDonut(fs,F.fams,"сімей")+stLegend(fs)+'</div><div class="st-chips"><span class="tag lime">з дітьми до 18 · '+F.minor+'</span><span class="tag">пар, де обоє члени · '+F.pairs+'</span><span class="tag">членів поза сім\'ями · '+F.single+'</span></div><div class="muted small">Сім\'я — це подружжя або людина з дітьми. Чоловіка з дружиною застосунок об\'єднує за зв\'язком у картці або за однаковою назвою в полі «Сім\'я».</div></div>'+
    '<div class="panel pad" id="stKids">'+sh('<span class="si t-lime">'+ico("heart")+'</span>Діти до 18 років',null,'<span class="tag">не члени церкви</span>')+'<div class="st-kids"><div class="st-kn"><span class="dn">'+K.length+'</span><span class="muted small">'+(K.length?"дітей у сім\'ях церкви":"дітей ще не вписано")+'</span></div>'+stRing(K.length?ss/K.length:0,ss,"нед. школа")+'</div><div class="kd">'+kd+'</div><div class="legend"><span><i style="background:var(--lime)"></i>ходить у недільну школу</span><span><i class="kd-o"></i>не відмічено</span></div>'+
      (K.length?'<details class="st-det"><summary>Показати список</summary>'+tbl([["Дитина"],["Вік",1],["Батьки"],["Недільна школа"]],K.map(function(c){return [c.id?'<button class="link" data-act="open" data-id="'+esc(c.id)+'">'+esc(c.name)+'</button>':esc(c.name),c.a,esc(c.par||"—"),c.ss?"відвідує":'<span class="muted">—</span>']}))+'</details>':"")+
      '<div class="muted small">Дітей вписуйте в картці батька або матері («Редагувати дані» → «Чи є діти»), там же ставте галочку «нед. школа». Дитина, вписана в обох батьків, рахується один раз.'+(F.noAge?' Без віку: '+F.noAge+' — вони сюди не потрапили.':"")+'</div></div></div>';
  /* who cares for whom, ministries, how people came */
  var dl=deaconList(),drows=dl.map(function(d){return [d,A.filter(function(x){return x.d.deacon===d}).length]}),nod=A.filter(function(x){return !x.d.deacon}).length;if(nod)drows.push(["Не закріплені",nod,"-"]);
  var chY=A.filter(function(x){return x.p.chat==="так"}).length,chN=A.filter(function(x){return x.p.chat==="ні"}).length,cs=[["у чаті",chY,"c1"],["не в чаті",chN,"c2"],["не вказано",A.length-chY-chN,"c3"]];
  h+='<div class="cols">'+pan("За дияконами і пасторами",drows.length?'<div>'+hbars(drows,"toDeacon")+'</div>':'<div class="muted">Членів ще немає.</div>',null,"shield","b-green")+servePanel().replace('class="panel pad"','class="panel pad st-bars b-sky"')+
    pan("Як прийшли в церкву",'<div>'+hbars(cntBy(function(x){var e=evs(x.p).filter(function(e){return e.type==="accepted"})[0];return e&&e.how}))+'</div>',null,"swap","b-sun")+
    pan("У чаті «Примирення»",'<div class="st-fam">'+stDonut(cs,pc(chY)+"%","у чаті")+stLegend(cs)+'</div>')+
    pan("Стан у церкві",'<div>'+hbars(cntBy(function(x){return x.p.part||partList()[0]}).concat([["на замітці",A.filter(function(x){return x.d.st==="note"}).length]]))+'</div>',null,null,"b-plum")+
    pan("Сімейний стан",'<div>'+hbars(cntBy(function(x){return x.p.marital}))+'</div>',null,null,"b-rose")+'</div>';
  return h+'<div class="bar" style="justify-content:center"><button class="btn" data-act="nav" data-v="reports">'+ico("chart")+' Звіти за рік і Excel</button></div>'}
/* dashboard: what was really done recently (the change log), admins only; others see membership events */
function lastActs(n){if(!S.isAdmin)return null;var L=logAll();if(!L.length)return null;
  return '<ul class="list">'+L.slice(0,n).map(function(e){var ex=e.col==="people"&&person(e.id),ch=(e.ch||[]),c=ch[0]?String(ch[0]):"";if(c.length>110)c=c.slice(0,108)+"…";
    return '<li><span>'+(ex?'<button class="link" data-act="open" data-id="'+esc(e.id)+'">'+esc(e.label||"")+'</button>':esc(e.label||""))+'<br><span class="muted small">'+esc((ACT[e.act]||"")+(c?": "+c:"")+(ch.length>1?" (+"+(ch.length-1)+")":""))+'</span></span><span class="small muted" style="text-align:right;white-space:nowrap">'+fts(e.ts)+'<br>'+esc(uname(e.uid))+'</span></li>'}).join("")+'</ul><div class="bar"><button class="btn small" data-act="nav" data-v="log">'+ico("history")+' Увесь журнал</button></div>'}
navApply();
/* keep the page where it was when a popup opens or closes (locking the page scroll used to throw it to the top) */
(function(){var sm=dlg.showModal.bind(dlg),y0=0;function fix(){var y=window.scrollY||document.documentElement.scrollTop||0;if(Math.abs(y-y0)>1)window.scrollTo(0,y0)}
  dlg.showModal=function(){if(!dlg.open)y0=window.scrollY||document.documentElement.scrollTop||0;sm();fix();setTimeout(fix,0)};
  dlg.addEventListener("close",function(){var y=y0;setTimeout(function(){if(!dlg.open&&S.tab===dlg._tab&&Math.abs((window.scrollY||0)-y)>1)window.scrollTo(0,y)},0)});
  var sm2=dlg.showModal;dlg.showModal=function(){dlg._tab=S.tab;sm2()}})();
/* panels in columns (.cols) are packed like bricks: a card is as tall as its content, and the next card rises into the first free place instead of waiting for the tallest neighbour. The grid has thin 4px rows; every card spans as many of them as its height needs */
(function(){var RO=null,raf=0,app=document.getElementById("app");
  function lay(c){var kids=Array.prototype.slice.call(c.children);if(kids.length<2){c.classList.remove("mas-on");return}c.classList.add("mas-on");var gap=16;kids.forEach(function(k){var h=k.getBoundingClientRect().height,n=Math.max(1,Math.ceil((h+gap)/4));if(k.style.getPropertyValue("--rs")!==String(n))k.style.setProperty("--rs",n)})}
  function all(){raf=0;Array.prototype.forEach.call(document.querySelectorAll(".cols"),lay)}
  function ask(){if(!raf)raf=requestAnimationFrame(all)}
  function watch(){all();if(!window.ResizeObserver)return;if(RO)RO.disconnect();RO=new ResizeObserver(ask);Array.prototype.forEach.call(document.querySelectorAll(".cols>*"),function(k){RO.observe(k)})}
  window.masAll=watch;window.addEventListener("resize",ask);
  if(window.MutationObserver){var mo=new MutationObserver(function(){watch()});if(app)mo.observe(app,{childList:true});mo.observe(dlg,{childList:true})}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ask);watch()})();
