/* ---------- built-in assistant: understands commands by rules, no AI model needed ---------- */
function aiLoc(){return !AI.fn||AI.off}
function aiSync(){var f=document.getElementById("aiFab");if(f)f.hidden=!S.ready||AI.open}
function lcN(s){return String(s||"").toLowerCase().replace(/[’ʼ`‘]/g,"'").replace(/ё/g,"е")}
function lcTok(q){return String(q||"").trim().split(/\s+/).filter(Boolean).map(function(w){return {o:w,n:lcN(w).replace(/^[^a-zа-яіїєґ0-9']+|[^a-zа-яіїєґ0-9']+$/g,""),u:false}})}
var LC_MON=["січ","лют","берез","квіт","трав","черв","лип","серп","верес","жовт","листопад","груд"];
var LC_NUM={"один":1,"одну":1,"два":2,"дві":2,"три":3,"чотири":4,"п'ять":5,"шість":6,"сім":7,"вісім":8,"дев'ять":9,"десять":10};
var LC_WD=[/^неділ[юяі]$/,/^понеділ(ок|ка|ку)$/,/^вівтор(ок|ка|ку)$/,/^серед[уаи]$/,/^четвер(га|гу)?$/,/^п'?ятниц[юяі]$/,/^субот[уаи]$/];
function lcIso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function lcShift(n){var d=new Date(today()+"T12:00:00");d.setDate(d.getDate()+n);return lcIso(d)}
function lcYmd(y,m,d,past){if(!(m>=1&&m<=12&&d>=1&&d<=31))return "";var given=!!y;y=given?+y:new Date().getFullYear();if(given&&y<100)y+=y>40?1900:2000;
  var dt=new Date(y,m-1,d,12);if(dt.getDate()!==d)return "";var iso=lcIso(dt),t=today();
  if(!given&&!past&&iso<t)iso=lcIso(new Date(y+1,m-1,d,12));if(!given&&past&&iso>t)iso=lcIso(new Date(y-1,m-1,d,12));return iso}
/* finds one date in the tokens, marks the words it used; past=true for things that already happened */
function lcDate(T,past){var t=today(),out="",a=-1,b=-1,i,n,nx,m,k,j,un,dd,mi,y,c,w,cur,df;
  for(i=0;i<T.length&&!out;i++){if(T[i].u)continue;n=T[i].n;nx=T[i+1];a=b=i;
    if(n==="сьогодні"||n==="нині")out=t;
    else if(n==="завтра")out=lcShift(1);
    else if(n==="післязавтра")out=lcShift(2);
    else if(n==="вчора"||n==="учора")out=lcShift(-1);
    else if(n==="позавчора")out=lcShift(-2);
    else if(n==="через"&&nx){k=1;j=i+1;if(/^\d{1,3}$/.test(nx.n)){k=+nx.n;j++}else if(LC_NUM[nx.n]){k=LC_NUM[nx.n];j++}un=T[j]?T[j].n:"";
      if(/^(день|дні|днів|дня)$/.test(un))out=lcShift(k);else if(/^тиж/.test(un))out=lcShift(7*k);else if(/^місяц/.test(un))out=addMonths(t,k);else if(/^(рік|роки|років)$/.test(un))out=addMonths(t,12*k);b=j}
    else if(/^наступн/.test(n)&&nx&&/^тиж/.test(nx.n)){out=lcShift(7);b=i+1}
    else if(/^наступн/.test(n)&&nx&&/^місяц/.test(nx.n)){out=addMonths(t,1);b=i+1}
    else if((m=n.match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{2,4}))?$/)))out=lcYmd(m[3],+m[2],+m[1],past);
    else if(/^\d{1,2}(-го|-е)?$/.test(n)&&nx){dd=parseInt(n,10);mi=-1;LC_MON.forEach(function(s,x){if(nx.n.indexOf(s)===0)mi=x});
      if(mi>=0){y=T[i+2]&&/^\d{4}$/.test(T[i+2].n)?T[i+2].n:"";out=lcYmd(y,mi+1,dd,past);b=i+1+(y?1:0);if(T[b+1]&&/^(року|р)$/.test(T[b+1].n))b++}
      else if(nx.n==="числа"){c=new Date();mi=c.getMonth();if(!past&&dd<c.getDate())mi++;if(past&&dd>c.getDate())mi--;c=new Date(c.getFullYear(),mi,dd,12);if(c.getDate()===dd)out=lcIso(c);b=i+1}}
    else{w=-1;LC_WD.forEach(function(re,x){if(re.test(n))w=x});
      if(w>=0){cur=new Date(t+"T12:00:00").getDay();if(past){df=(cur-w+7)%7;out=lcShift(-df)}else{df=(w-cur+7)%7||7;out=lcShift(df)}}}}
  if(!out)return "";for(i=a;i<=b;i++)T[i].u=true;
  for(i=a-1;i>=0&&!T[i].u&&/^(на|у|в|до|цієї|цю|цей|наступну|наступний|наступного|наступної|минулу|минулого|минулої|минулий)$/.test(T[i].n);i--)T[i].u=true;
  return out}
var LC_STOP=/^(і|й|та|у|в|на|до|з|із|зі|за|для|про|що|щоб|як|це|цей|ця|хто|де|коли|чи|не|по|від|я|ми|мені|нам|будь|ласка|його|її|йому|їй|ним|нею|такий|така|людину|людина|людини|людей|люди|картку|картка|картки|брата|брат|брату|сестру|сестра|сестрі|познач|позначити|постав|зміни|змінити|встанови|запиши|записати|додай|додати|зроби|онови|оновити|зніми|прибери|очисти|скасуй|відкрий|покажи|знайди|знайти|шукай|скільки|нагадай|нагадати|створи|видали|закрий|виконано|стан|телефон|номер|адреса|адресу|примітка|примітку)$/;
function lcNameHit(w,t){if(!t||w.length<3)return 0;var c=0,m=Math.min(w.length,t.length);while(c<m&&w.charCodeAt(c)===t.charCodeAt(c))c++;
  if(c<3||c<t.length-2||w.length-c>3)return 0;return c+(w===t?3:0)}
/* people whose first or last name matches words of the request, in any grammatical case */
function lcPeople(T){var A=all(),hits={},L,mc,ms;
  T.forEach(function(k){if(k.u||k.n.length<3||LC_STOP.test(k.n)||/\d/.test(k.n))return;
    A.forEach(function(x){var s=Math.max(lcNameHit(k.n,lcN(x.p.last)),lcNameHit(k.n,lcN(x.p.first)));if(s){var h=hits[x.p.id]||(hits[x.p.id]={x:x,c:0,s:0});h.c++;h.s+=s}})});
  L=Object.keys(hits).map(function(k){return hits[k]});if(!L.length)return [];
  mc=Math.max.apply(null,L.map(function(h){return h.c}));L=L.filter(function(h){return h.c===mc});
  ms=Math.max.apply(null,L.map(function(h){return h.s}));return L.filter(function(h){return h.s===ms}).map(function(h){return h.x})}
function lcRest(T){return T.filter(function(k){return !k.u}).map(function(k){return k.o}).join(" ").replace(/^[\s:,.—–-]+|[\s:,—–-]+$/g,"")}
function lcUse(T,re){T.forEach(function(k){if(!k.u&&re.test(k.n))k.u=true})}
function lcCap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s}
function lcSt(x){return x.d.st==="none"&&x.p.kind?x.p.kind:ST[x.d.st]}
function lcLine(x,sub){return {id:x.p.id,t:x.n,s:sub!=null?sub:[lcSt(x),x.p.part,x.p.phone].filter(Boolean).join(" · ")}}
function lcList(title,arr,sub){if(!arr.length)return {kind:"info",say:title+": нікого немає."};
  return {kind:"info",say:title+" — "+arr.length+(arr.length>30?" (показано перших 30)":"")+":",list:arr.slice(0,30).map(function(x){return lcLine(x,sub?sub(x):null)})}}
function lcAsk(P){return {kind:"ask",say:"Знайшов кількох людей. Уточніть прізвище або оберіть картку:",list:P.slice(0,12).map(function(x){return lcLine(x)})}}
function lcNoOne(){return {kind:"ask",say:"Не зрозумів, про кого мова. Напишіть прізвище або ім'я так, як у картці."}}
function lcCard(x,lead){var p=x.p,lc=lastContact(p),L=[];if(lead)L.push(lead);
  L.push(x.n+" — "+lcSt(x)+(p.part?", "+p.part:""));
  if(p.phone)L.push("Телефон: "+p.phone);if(p.place||p.address)L.push("Адреса: "+[p.place,p.address].filter(Boolean).join(", "));
  if(p.birth)L.push("Народження: "+fd(p.birth)+(x.a!=null?" ("+x.a+" р.)":""));if(x.d.deacon)L.push("Закріплений за: "+x.d.deacon);
  if((p.needs||[]).length)L.push("Потреби: "+p.needs.join(", "));var rl=roles(p.id);if(rl.length)L.push("Служіння: "+rl.join(", "));
  L.push("Останній контакт: "+(lc?fd(lc):"записів немає"));return {kind:"info",say:L.join("\n"),list:[lcLine(x,"відкрити картку")],who:p.id}}
function lcPartOf(s){var r=null;partList().forEach(function(p){if(!r&&PART.indexOf(p)<0&&s.indexOf(lcN(p))>=0)r=p});if(r)return r;
  if(/зсу|війсь|в армі|на фронт|мобіліз/.test(s))return PART[2];if(/давно не|не відвіду|не ходить|перестав ходити|перестала ходити/.test(s))return PART[1];
  if(/за кордон/.test(s))return PART[3];if(/переход|перехід|іншої церкви|іншу церкву/.test(s))return PART[4];if(/активн/.test(s))return PART[0];return null}
function lcNeedOf(s,p){var r=null,L=NEEDS.concat(S.cfg.customNeeds||[]);if(p)L=needList(p);L.forEach(function(n){if(!r&&NEEDS.indexOf(n)<0&&s.indexOf(lcN(n))>=0)r=n});if(r)return r;
  if(/лежач|не виходить/.test(s))return NEEDS[2];if(/потреб\S*\s+відвід|відвідин(?!и)/.test(s))return NEEDS[0];if(/потреб\S*\s+допомог|потреб\S*\s+опік/.test(s))return NEEDS[1];return null}
function lcAfter(q){var k=q.indexOf(":");if(k>=0)return q.slice(k+1).trim();var m=q.match(/\sна\s+(.+)$/i);return m?m[1].trim():""}
function lcFind(o){return aiTools()[0].execute(o)}
function lcByIds(r){return r.people.map(function(b){var p=person(b.id);return p?all().filter(function(x){return x.p.id===b.id})[0]:null}).filter(Boolean)}
var LC_HELP=["Знайди Бурлаку","Нагадай у п'ятницю подзвонити Вадиму","Запиши: сьогодні відвідав Вадима","Познач Вадима як служить у ЗСУ","Хто без контакту понад 3 місяці?","Дні народження","Скільки членів церкви?","Мої нагадування"];
function lcHelp(lead){return {kind:"info",help:true,say:(lead?lead+"\n\n":"")+"Я розумію прості команди:\n• знайти людину — «знайди Бурлаку», «телефон Вадима»\n• нагадування — «нагадай завтра подзвонити Вадиму», «мої нагадування», «виконано: подзвонити»\n• контакт — «запиши: вчора відвідав Вадима: все добре»\n• стан у церкві — «познач Вадима як служить у ЗСУ», «хто давно не відвідує»\n• потреби — «познач, що Вадим потребує відвідин»\n• дані картки — «зміни телефон Вадима на 0971234567», «примітка Вадиму: текст»\n• списки — «без телефону», «без контакту», «на замітці», «дні народження», «люди диякона …»\n• цифри — «скільки членів церкви»\n• розділи — «відкрий звіти»"}}
/* returns {kind: act|info|ask|none, say, list, acts, help, who} */
function aiLocal(q){var s=lcN(q).replace(/\s+/g," ").trim(),T=lcTok(q),P,x,d,v,m,r,A,R,verb=/^(познач|постав|зміни|змінити|встанови|запиши|записати|додай|зроби|онови|зніми|прибери|очисти|скасуй)/.test(s),off=/^(зніми|прибери|очисти|скасуй|видали)/.test(s);
  if(!s)return null;
  if(/^(\?|допомог|довідка|команди|що (ти )?(вмієш|можеш|умієш)|як (тобою )?користуват|привіт|добрий|вітаю|доброго)/.test(s))return lcHelp();
  /* reminders: done */
  if(/нагадуван/.test(s)&&/^(викона|закрий|зніми|видали|прибери)/.test(s)||/^виконано\b|^виконано[:\s]|^зроблено[:\s]/.test(s)){
    lcUse(T,/^(виконано|виконав|виконала|виконай|закрий|зніми|видали|прибери|зроблено|нагадування|нагадуванню)$/);var ws=T.filter(function(k){return !k.u&&k.n.length>=3}).map(function(k){return k.n});
    A=(S.rem||[]).filter(function(r0){var h=lcN(r0.text)+" "+lcN(r0.pid?pn(r0.pid):"");return ws.length&&ws.every(function(w){return h.indexOf(w.slice(0,Math.max(3,w.length-2)))>=0})});
    if(A.length===1)return {kind:"act",acts:[{"do":"complete_reminder",id:A[0].id}]};
    if(!(S.rem||[]).length)return {kind:"info",say:"Власних нагадувань немає."};
    return {kind:"ask",say:(A.length?"Підходить кілька нагадувань":"Не знайшов такого нагадування")+". Напишіть «виконано: » і кілька слів із потрібного:\n"+(A.length?A:S.rem).slice(0,10).map(function(r0){return "• "+(r0.date?fd(r0.date)+" — ":"")+r0.text}).join("\n")}}
  /* reminders: add */
  if(/^(нагадай|нагадати|нагадайте|нагадування:|нове нагадування)/.test(s)||/^(додай|створи|постав|запиши|зроби)\s+(мені\s+)?нагадування/.test(s)){
    var first=true;T.forEach(function(k){if(first&&/^(нагадай|нагадати|нагадайте|нагадування|нове|додай|створи|постав|запиши|зроби|мені|нам|щоб|що|треба|потрібно)$/.test(k.n))k.u=true;else first=false});
    d=lcDate(T,false);v=lcRest(T).replace(/^(щоб|що|про те що|про)\s+/i,"");if(!v)return {kind:"ask",say:"Що саме нагадати? Наприклад: «нагадай завтра подзвонити Вадиму»."};
    P=lcPeople(T);return {kind:"act",acts:[{"do":"add_reminder",text:lcCap(v),date:d||today(),person_id:P.length===1?P[0].p.id:""}],who:P.length===1?P[0].p.id:""}}
  /* sections */
  if((m=s.match(/^(відкрий|перейди|перейти)\s+(у\s+|в\s+|до\s+)?(розділ\s+)?(огляд|головн|нагадуван|люди|людей|список|служител|диякон|мал|груп|зібран|трансляц|рух|звіт|журнал)/))&&T.length<=5){
    v=m[4];return {kind:"act",acts:[{"do":"go",tab:v==="огляд"||v==="головн"?"home":v==="нагадуван"?"reminders":v==="люди"||v==="людей"||v==="список"?"people":v==="служител"||v==="диякон"?"deacons":v==="мал"||v==="груп"?"groups":v==="зібран"||v==="трансляц"?"meetings":v==="рух"?"journal":v==="звіт"?"reports":"log"}]}}
  /* new card */
  if(/^(додай|створи|нова|новий|запиши)\s+(нову\s+|нового\s+)?(людину|картку|відвідувача|відвідувачку|гостя|гостю|кандидата|кандидатку)/.test(s)){
    var nm=T.filter(function(k,i){return i>0&&/^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґ'’ʼ-]+$/.test(k.o.replace(/[,.;:]+$/,""))}).map(function(k){return k.o.replace(/[,.;:]+$/,"")});
    if(nm.length<2)return {kind:"ask",say:"Напишіть прізвище та ім'я з великої літери: «додай людину Шевченко Тарас 0971234567»."};
    m=q.match(/\+?\d[\d\s()\-]{7,}\d/);return {kind:"act",acts:[{"do":"add_person",last:nm[0],first:nm[1],mid:nm[2]&&/(ич|вна)$/.test(nm[2])?nm[2]:"",phone:m?m[0].trim():"",kind:/кандидат/.test(s)?KINDS[1]:KINDS[0]}]}}
  d="";P=lcPeople(T);x=P.length===1?P[0]:null;
  if(!P.length&&AI.lastP&&/(^|\s)(його|її|йому|їй|ним|нею|цю людину|цієї людини)(\s|$|[,.:?])/.test(s)){x=all().filter(function(z){return z.p.id===AI.lastP})[0]||null;if(x)P=[x]}
  /* needs */
  v=lcNeedOf(s,x&&x.p);
  if(v&&(verb||/^(познач|запиши)/.test(s))){if(!P.length)return lcNoOne();if(!x)return lcAsk(P);return {kind:"act",who:x.p.id,acts:[{"do":"set_need",id:x.p.id,need:v,on:!off}]}}
  if(v&&!P.length){A=all().filter(function(z){return (z.p.needs||[]).indexOf(v)>=0});return lcList("«"+lcCap(v)+"»",A)}
  if(/потреб/.test(s)&&!P.length&&!verb){A=all().filter(function(z){return (z.p.needs||[]).length});return lcList("Мають позначені потреби",A,function(z){return z.p.needs.join(", ")})}
  /* state in church */
  if(verb&&/стан/.test(s)&&off){if(!P.length)return lcNoOne();if(!x)return lcAsk(P);return {kind:"act",who:x.p.id,acts:[{"do":"update_person",id:x.p.id,fields:{part:""}}]}}
  v=lcPartOf(s);if(!v&&/^(познач|постав|зміни|встанови|зроби)/.test(s)&&(m=q.match(/\sяк\s+(.+)$/i)))v=m[1].replace(/[.!]+$/,"").trim().slice(0,60);
  if(v&&verb&&!/(відвідав|відвідала|подзвонив|подзвонила|дзвінок|розмов)/.test(s)){if(!P.length)return lcNoOne();if(!x)return lcAsk(P);return {kind:"act",who:x.p.id,acts:[{"do":"update_person",id:x.p.id,fields:{part:v}}]}}
  if(v&&!P.length){A=all().filter(function(z){return z.p.part===v});return lcList("Стан «"+v+"»",A,function(z){return [lcSt(z),z.p.phone].filter(Boolean).join(" · ")})}
  /* contact */
  if(/(відвідав|відвідала|відвідали|відвідини|провідав|провідала|провідали|подзвонив|подзвонила|подзвонили|дзвонив|дзвонила|дзвонили|зателефонував|зателефонувала|телефонував|телефонувала|дзвінок|розмовляв|розмовляла|розмовляли|поговорив|поговорила|поговорили|розмову|зустрівся|зустрілась|зустрілася|зустрілися|зустрілись|допоміг|допомогла|допомогли|написав|написала|написали|переписка|переписку|листувався|листувалась|списався|списалась|списалися)/.test(s)&&!/^(хто|кого|коли|скільки|чи)\s/.test(s)){
    if(!P.length)return lcNoOne();if(!x)return lcAsk(P);d=lcDate(T,true)||today();
    v=/відвід|провід/.test(s)?CKIND[0]:/дзв|телефон/.test(s)?CKIND[1]:/допом/.test(s)?CKIND[3]:/написа|переписк|листува|списа/.test(s)?CKIND[4]:CKIND[2];var k1=q.indexOf(":"),k2=q.indexOf(":",k1+1),note=k2>=0?q.slice(k2+1).trim():(k1>=0&&k1>12?q.slice(k1+1).trim():"");
    return {kind:"act",who:x.p.id,acts:[{"do":"add_contact",id:x.p.id,kind:v,date:d,note:note}]}}
  /* card fields */
  if(/телефон|номер/.test(s)&&(m=q.match(/\+?\d[\d\s()\-]{7,}\d/))){if(!P.length)return lcNoOne();if(!x)return lcAsk(P);return {kind:"act",who:x.p.id,acts:[{"do":"update_person",id:x.p.id,fields:{phone:m[0].trim()}}]}}
  if(/приміт|нотатк/.test(s)&&q.indexOf(":")>=0){if(!P.length)return lcNoOne();if(!x)return lcAsk(P);v=lcAfter(q);if(!v)return {kind:"ask",say:"Напишіть текст примітки після двокрапки."};
    return {kind:"act",who:x.p.id,acts:[{"do":"update_person",id:x.p.id,fields:{notes:(x.p.notes?x.p.notes+"\n":"")+v}}]}}
  if(verb&&/адрес/.test(s)){if(!P.length)return lcNoOne();if(!x)return lcAsk(P);v=lcAfter(q);if(!v)return {kind:"ask",say:"Напишіть так: «зміни адресу Вадима на вул. Шевченка, 5»."};return {kind:"act",who:x.p.id,acts:[{"do":"update_person",id:x.p.id,fields:{address:v}}]}}
  if(verb&&/народж|хрещен|вінчан/.test(s)){if(!P.length)return lcNoOne();if(!x)return lcAsk(P);d=lcDate(T,true);if(!d)return {kind:"ask",say:"Вкажіть дату повністю, наприклад 12.03.1990."};
    r={};r[/хрещен/.test(s)?"baptism":/вінчан/.test(s)?"wedding":"birth"]=d;return {kind:"act",who:x.p.id,acts:[{"do":"update_person",id:x.p.id,fields:r}]}}
  if(/^(прийми|прийняти|вилучи|вилучити|відлучи|переведи|постав на замітку|зніми із замітки|зніми з замітки)/.test(s)){
    if(x)return {kind:"act",who:x.p.id,say:"Події членства записуються в самій картці — там є дата, спосіб і диякон. Відкриваю картку.",acts:[{"do":"open_card",id:x.p.id}]};
    return P.length?lcAsk(P):{kind:"info",say:"Події членства (прийняття, замітка, вилучення) записуються в картці людини. Напишіть «відкрий» і прізвище."}}
  /* open */
  if(/^(відкрий|відкрити)\s/.test(s)){if(x)return {kind:"act",who:x.p.id,acts:[{"do":"open_card",id:x.p.id}]};if(P.length)return lcAsk(P)}
  /* deacon's people */
  if(/диякон|підопічн/.test(s)&&!/хто диякон|який диякон|чий диякон/.test(s)){var D=deaconList(),bd="",bs=0;
    D.forEach(function(n){var sc=0;lcN(n).split(/\s+/).forEach(function(w){T.forEach(function(k){if(!LC_STOP.test(k.n))sc+=lcNameHit(k.n,w)})});if(sc>bs){bs=sc;bd=n}});
    if(bd){A=act().filter(function(z){return z.d.deacon===bd});return lcList("Люди диякона "+bd,A)}
    if(!P.length)return {kind:"info",say:D.length?"Диякони:\n"+D.map(function(n){return "• "+n+" — "+act().filter(function(z){return z.d.deacon===n}).length}).join("\n"):"Дияконів ще не додано."}}
  if(/пастор/.test(s)&&!P.length)return {kind:"info",say:S.pastors.length?"Пастори: "+S.pastors.map(function(p){return p.name}).join(", ")+".":"Пасторів ще не вказано."};
  /* own reminders */
  if(/нагадуван|що (в мене |у мене )?(на )?(сьогодні|завтра)|мої справи|що зробити/.test(s)){R=reminders();A=[];
    if(R.due.length)A.push("На сьогодні й прострочені:\n"+R.due.slice(0,12).map(function(r0){return "• "+fd(r0.date)+" — "+r0.text}).join("\n"));
    if(R.later.length)A.push("Попереду:\n"+R.later.slice(0,12).map(function(r0){return "• "+(r0.date?fd(r0.date):"без дати")+" — "+r0.text}).join("\n"));
    if(R.noteDue.length)A.push("Закінчився термін замітки: "+R.noteDue.map(function(r0){return r0.x.n}).join(", ")+".");
    if(R.excl.length)A.push("Час перевірити вилучених: "+R.excl.map(function(r0){return r0.x.n}).join(", ")+".");
    return {kind:"info",say:A.length?A.join("\n\n")+(R.mine.length?"\n\nЩоб закрити, напишіть «виконано: » і кілька слів із нагадування.":""):"Нагадувань немає."}}
  /* lists */
  if(!P.length){
    if(/народж|іменин|річниц|найближчі дат|ювіле/.test(s)){A=upcoming(30);return A.length?{kind:"info",say:"Найближчі 30 днів — "+A.length+":",list:A.slice(0,30).map(function(b){return lcLine(b.x,b.dm+" · "+b.label+(b.diff===0?" · сьогодні":b.diff===1?" · завтра":" · через "+b.diff+" дн."))})}:{kind:"info",say:"У найближчі 30 днів дат немає."}}
    var F=[[/без контакт|давно не (дзвон|відвід|контакт|було контакт)|кого (треба )?відвідати/,"nocontact","Без контакту понад 3 місяці","active"],[/без телефон|без номер/,"nophone","Без телефону","active"],[/без адрес/,"noaddr","Без адреси","active"],[/без (дати |дня )?народж/,"nobirth","Без дати народження","active"],[/без (дати )?хрещ/,"nobapt","Без дати хрещення","active"],[/не в (малій |малих )?груп|без (малої )?груп/,"nogroup","Не в малій групі","active"],[/75|літн|старш|похил/,"old","75 років і старші","active"],[/прийнят|нові член|новоприйнят|нових член/,"newyear","Прийняті цього року","all"]];
    for(var fi=0;fi<F.length;fi++)if(F[fi][0].test(s))return lcList(F[fi][2],lcByIds(lcFind({filter:F[fi][1],status:F[fi][3]})));
    if(/замітц|замітк/.test(s))return lcList("На замітці",all().filter(function(z){return z.d.st==="note"}));
    if(/вилучен|відлучен/.test(s))return lcList("Вилучені",all().filter(function(z){return z.d.st==="excluded"}));
    if(/вибул|перейшли|самоусун|померл/.test(s))return lcList("Вибули",all().filter(function(z){return ["left","moved","died"].indexOf(z.d.st)>=0}));
    if(/кандидат/.test(s))return lcList("Кандидати на хрещення",all().filter(function(z){return z.d.st==="none"&&z.p.kind===KINDS[1]}));
    if(/відвідувач|гост/.test(s))return lcList("Відвідувачі",all().filter(function(z){return z.d.st==="none"&&z.p.kind===KINDS[0]}));
    if(/не член/.test(s))return lcList("Не члени церкви",all().filter(function(z){return z.d.st==="none"}));
    var mk=Object.keys(S.min||{}).filter(function(k){var w=lcN(k).split(/\s+/).filter(function(a){return a.length>=4});return w.length&&w.every(function(a){return s.indexOf(a.slice(0,5))>=0})})[0];
    if(mk){A=(S.min[mk]||[]).map(function(id){return all().filter(function(z){return z.p.id===id})[0]}).filter(Boolean);return lcList(lcCap(mk),A)}
    if(/служінн/.test(s)){A=Object.keys(S.min||{}).filter(function(k){return (S.min[k]||[]).length});return {kind:"info",say:A.length?A.map(function(k){return "• "+k+": "+S.min[k].map(pn).join(", ")}).join("\n"):"Служіння ще не розподілені."}}
    if(/груп/.test(s))return {kind:"info",say:S.groups.length?"Малі групи:\n"+S.groups.map(function(g){var l=person(g.leader);return "• "+g.name+(l?" — "+fio(l):"")+", людей: "+gMembers(g).length}).join("\n"):"Малих груп ще немає."};
    if(/скільки|статистик|цифри|кількість|загалом|членів церкви/.test(s)){r=aiStats();return {kind:"info",say:"Чинних членів: "+r.members+" (чоловіків "+r.men+", жінок "+r.women+").\nЦього року прийнято: "+r.acceptedThisYear+", вибуло: "+r.leftThisYear+".\nНа замітці: "+(r.onNote.length?r.onNote.join(", "):"нікого")+".\nДияконів: "+r.deacons.length+", малих груп: "+r.groups.length+"."}}}
  /* a person */
  if(x){v=/телефон|номер/.test(s)?(x.p.phone?"Телефон: "+x.p.phone:"Телефону в картці немає."):/адрес|де живе|де мешкає/.test(s)?(x.p.place||x.p.address?"Адреса: "+[x.p.place,x.p.address].filter(Boolean).join(", "):"Адреси в картці немає."):/народж|скільки років|вік/.test(s)?(x.p.birth?"Народження: "+fd(x.p.birth)+(x.a!=null?", "+x.a+" р.":""):"Дати народження в картці немає."):/диякон/.test(s)?(x.d.deacon?"Закріплений за: "+x.d.deacon:"Ні за ким не закріплений."):"";return lcCard(x,v)}
  if(P.length)return {kind:"info",say:"Знайшов "+P.length+":",list:P.slice(0,30).map(function(z){return lcLine(z)})};
  /* free text search over everything in the cards */
  lcUse(T,/^(знайди|знайти|шукай|покажи|хто|де|всіх|усіх|список)$/);var W=T.filter(function(k){return !k.u&&k.n.length>=3&&!LC_STOP.test(k.n)}).map(function(k){return k.n});
  if(W.length&&W.length<=4){A=all().filter(function(z){var h=hay(z);return W.every(function(w){return h.indexOf(w.length>5?w.slice(0,w.length-2):w)>=0})});if(A.length)return lcList("Знайдено за текстом карток",A)}
  r=lcHelp("Не зрозумів запит.");r.kind="none";return r}
function aiAsk(q){q=String(q||"").trim();if(!q||AI.busy)return;var r=null;try{r=aiLocal(q)}catch(e){r=null}
  if(!aiLoc()&&!(r&&r.kind==="act"))return aiAskAI(q);
  if(!r)r={kind:"none",say:"Не вдалося розібрати запит. Спробуйте простіше."};
  AI.log.push({r:"u",t:q});if(r.say)AI.log.push({r:"a",t:r.say});if(r.list&&r.list.length)AI.log.push({r:"ppl",l:r.list});if(r.help)AI.log.push({r:"help"});
  if(r.who)AI.lastP=r.who;AI.openCard="";AI.goTab="";
  if(!(r.acts&&r.acts.length)){aiRender();return}
  AI.busy=true;aiRender();aiRun(r.acts).then(function(){},function(){}).then(function(){AI.busy=false;aiRender();aiSync();
    if(AI.goTab)go(AI.goTab);if(AI.openCard&&person(AI.openCard)){S.card=AI.openCard;renderDlg()}})}
function aiRender(){var el=document.getElementById("aiPanel");if(!el)return;aiSync();el.hidden=!AI.open;if(!AI.open)return;
  var keep=document.getElementById("aiIn"),kv=keep?keep.value:"",foc=keep&&document.activeElement===keep,loc=aiLoc();
  var sug=loc?["Що ти вмієш?","Мої нагадування","Хто без контакту понад 3 місяці?","Дні народження","Скільки членів церкви?"]:["Скільки зараз чинних членів і як змінилось за рік?","Хто без контакту понад 3 місяці?","У кого день народження найближчим часом?"];
  el.innerHTML='<div class="ai-h"><span class="ai-orb"></span><span class="grow"><b>Помічник</b><span class="muted small">'+(loc?"шукає і записує за командою":"знає все, що є в обліку")+'</span></span>'+(AI.log.length?'<button class="iconbtn" data-act="aiClear" aria-label="Очистити чат" title="Очистити чат">'+ico("trash")+'</button>':"")+'<button class="iconbtn" data-act="aiOpen" aria-label="Закрити чат">'+ico("x")+'</button></div>'+
    '<div class="ai-m" id="aiMsgs">'+(AI.log.length?AI.log.map(function(m,i){var last=i===AI.log.length-1;
      if(m.r==="act")return '<div class="ai-act'+(m.bad?" bad":"")+'">'+ico(m.bad?"alert":"check")+'<span>'+esc(m.t)+'</span>'+(m.id&&person(m.id)?'<button class="link" data-act="open" data-id="'+esc(m.id)+'">відкрити</button>':"")+'</div>';
      if(m.r==="ppl")return '<div class="ai-l">'+m.l.map(function(p){return '<button class="ai-p" data-act="open" data-id="'+esc(p.id)+'"><b>'+esc(p.t)+'</b>'+(p.s?'<span>'+esc(p.s)+'</span>':"")+ico("arrow")+'</button>'}).join("")+'</div>';
      if(m.r==="help")return '<div class="chips ai-hc">'+LC_HELP.map(function(s0){return '<button class="chip" data-act="aiSug">'+esc(s0)+'</button>'}).join("")+'</div>';
      return '<div class="ai-b '+(m.r==="u"?"u":"a")+(m.wait?" wait":"")+(m.err?" err":"")+'"'+(last&&m.r==="a"&&AI.busy?' id="aiCur"':"")+'>'+esc(m.wait?AI.status:m.t)+'</div>'}).join(""):
      '<div class="ai-e"><b>'+(loc?"Напишіть, кого знайти або що записати":"Запитайте про будь-кого або попросіть записати")+'</b><span class="muted small">Наприклад: «знайди Бурлаку», «нагадай у суботу подзвонити Вадиму», «запиши: сьогодні відвідав Вадима».</span><div class="chips">'+sug.map(function(s0){return '<button class="chip" data-act="aiSug">'+esc(s0)+'</button>'}).join("")+'</div></div>')+'</div>'+
    '<form class="ai-f" id="aiForm"><input id="aiIn" placeholder="'+(loc?"Команда або запитання…":"Ваше запитання…")+'" aria-label="Запитання до помічника" autocomplete="off"'+(AI.busy?" disabled":"")+'>'+(AI.busy&&AI.ctl?'<button type="button" class="iconbtn inv" data-act="aiStop" aria-label="Зупинити">'+ico("stop")+'</button>':'<button type="submit" class="iconbtn inv" aria-label="Надіслати">'+ico("send")+'</button>')+'</form>';
  var ni=document.getElementById("aiIn");if(!AI.busy){ni.value=kv;if(foc)ni.focus()}var ms=document.getElementById("aiMsgs");ms.scrollTop=ms.scrollHeight}
