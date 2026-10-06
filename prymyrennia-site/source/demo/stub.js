/* Demo backend: everything lives in the page's memory, the people are invented, nothing is sent anywhere and a reload resets it. */
(function(){
function D(off){var d=new Date();d.setDate(d.getDate()+off);return d.toISOString().slice(0,10)}
function Y(age,m,day){var y=new Date().getFullYear()-age;return y+"-"+("0"+m).slice(-2)+"-"+("0"+day).slice(-2)}
var mNow=new Date().getMonth()+1,dNow=new Date().getDate();
function acc(date,how,deacon){return {date:date,type:"accepted",how:how,deacon:deacon||""}}
var DK1="Гончар Тарас",DK2="Савчук Назар",DK3="Литвин Остап",PA="Мороз Данило";
var P={
 a01:{last:"Мороз",first:"Данило",mid:"Іванович",sex:"ч",birth:Y(47,3,14),phone:"050 111 22 01",place:"Чернівці",address:"вул. Зелена, 12",family:"Мороз",marital:"у шлюбі",baptism:"1998-06-07",events:[acc("1998-06-07","хрещення (світ)")],rel:[{type:"дружина",pid:"a02"}]},
 a02:{last:"Мороз",first:"Соломія",mid:"Петрівна",sex:"ж",birth:Y(44,8,2),phone:"050 111 22 02",place:"Чернівці",address:"вул. Зелена, 12",family:"Мороз",marital:"у шлюбі",baptism:"2001-07-15",events:[acc("2001-07-15","хрещення (ДВР)",PA)],contacts:[{date:D(-9),kind:"дзвінок",by:PA,note:"Домовились про допомогу з недільною школою."}]},
 a03:{last:"Гончар",first:"Тарас",mid:"Миколайович",sex:"ч",birth:Y(52,11,23),phone:"067 222 33 03",place:"Чернівці",address:"вул. Садова, 5, кв. 14",family:"Гончар",marital:"у шлюбі",baptism:"1995-08-20",events:[acc("1995-08-20","хрещення (світ)",PA)]},
 a04:{last:"Гончар",first:"Леся",mid:"Андріївна",sex:"ж",birth:Y(49,mNow,Math.min(28,dNow+3)),phone:"067 222 33 04",place:"Чернівці",address:"вул. Садова, 5, кв. 14",family:"Гончар",marital:"у шлюбі",baptism:"1997-06-01",events:[acc("1997-06-01","хрещення (світ)",DK1)]},
 a05:{last:"Савчук",first:"Назар",mid:"Олегович",sex:"ч",birth:Y(38,5,9),phone:"093 333 44 05",place:"Чернівці",address:"просп. Незалежності, 88",family:"Савчук",marital:"у шлюбі",baptism:"2009-05-31",events:[acc("2009-05-31","хрещення (ДВР)",DK1)]},
 a06:{last:"Савчук",first:"Марта",mid:"Василівна",sex:"ж",birth:Y(35,1,30),phone:"093 333 44 06",place:"Чернівці",address:"просп. Незалежності, 88",family:"Савчук",marital:"у шлюбі",baptism:"2011-06-12",events:[acc("2011-06-12","хрещення (світ)",DK2)]},
 a07:{last:"Литвин",first:"Остап",mid:"Романович",sex:"ч",birth:Y(29,9,17),phone:"063 444 55 07",place:"Чернівці",address:"вул. Руська, 140",marital:"неодружений",baptism:"2015-08-09",events:[acc("2015-08-09","хрещення (ДВР)",DK2)]},
 a08:{last:"Кравець",first:"Ганна",mid:"Степанівна",sex:"ж",birth:Y(78,2,11),phone:"0372 55 10 08",place:"Чернівці",address:"вул. Головна, 201, кв. 3",marital:"вдова",baptism:"1979-07-01",needs:["потребує відвідин","лежачий / не виходить з дому"],notes:"Живе сама, син за кордоном. Найкраще дзвонити до обіду.",events:[acc("1979-07-01","хрещення (світ)",DK1)],contacts:[{date:D(-20),kind:"відвідини",by:DK1,note:"Привезли продукти, помолились разом."},{date:D(-52),kind:"дзвінок",by:DK1,note:"Просила молитись за здоров'я."}]},
 a09:{last:"Бойко",first:"Микола",mid:"Федорович",sex:"ч",birth:Y(66,12,5),phone:"050 555 66 09",place:"с. Магала",address:"вул. Центральна, 7",marital:"у шлюбі",baptism:"1990-09-02",needs:["потребує допомоги"],events:[acc("1990-09-02","хрещення (світ)",DK1)],contacts:[{date:D(-110),kind:"відвідини",by:DK1,note:"Потрібна допомога з дровами на зиму."}]},
 a10:{last:"Руденко",first:"Ірина",mid:"Олексіївна",sex:"ж",birth:Y(41,4,25),phone:"097 666 77 10",place:"Чернівці",address:"вул. Героїв Майдану, 60",marital:"розлучена",baptism:"2018-06-03",events:[acc("2018-06-03","хрещення (світ)",DK2),{date:D(-40),type:"note_on",until:D(50),note:"Перестала відвідувати зібрання, потрібна розмова."}],contacts:[{date:D(-35),kind:"переписка",by:DK2,note:"Відповіла, що має складний період на роботі."}]},
 a11:{last:"Ткачук",first:"Богдан",mid:"Ігорович",sex:"ч",birth:Y(27,7,19),phone:"068 777 88 11",place:"Чернівці",marital:"неодружений",baptism:"2019-08-18",part:"служить у ЗСУ",events:[acc("2019-08-18","хрещення (ДВР)",DK2)],contacts:[{date:D(-6),kind:"переписка",by:PA,note:"На зв'язку, просить молитись за побратимів."}]},
 a12:{last:"Ткачук",first:"Вікторія",mid:"Ігорівна",sex:"ж",birth:Y(23,10,8),phone:"068 777 88 12",place:"Чернівці",marital:"неодружена",baptism:"2022-06-05",events:[acc("2022-06-05","хрещення (ДВР)",DK2)]},
 a13:{last:"Олійник",first:"Юрій",mid:"Васильович",sex:"ч",birth:Y(34,6,27),phone:"095 888 99 13",place:"Чернівці",marital:"у шлюбі",family:"Олійник",baptism:"2012-07-08",part:"за кордоном",events:[acc("2012-07-08","хрещення (світ)",DK3)]},
 a14:{last:"Олійник",first:"Христина",mid:"Юріївна",sex:"ж",birth:Y(31,3,3),phone:"095 888 99 14",place:"Чернівці",marital:"у шлюбі",family:"Олійник",baptism:"2014-06-22",part:"давно не відвідує",events:[acc("2014-06-22","хрещення (світ)",DK3)]},
 a15:{last:"Павленко",first:"Степан",mid:"Дмитрович",sex:"ч",birth:Y(58,1,16),phone:"066 999 00 15",place:"с. Мамаївці",marital:"у шлюбі",baptism:"1996-05-26",events:[acc("2021-03-14","з іншої церкви",DK3)]},
 a16:{last:"Зінченко",first:"Катерина",mid:"Сергіївна",sex:"ж",birth:Y(19,mNow,Math.max(1,dNow-2)),phone:"073 100 20 16",place:"Чернівці",marital:"неодружена",baptism:D(-70),events:[acc(D(-70),"хрещення (ДВР)",DK3)]},
 a17:{last:"Лисенко",first:"Артем",mid:"Павлович",sex:"ч",birth:Y(21,2,28),phone:"073 100 20 17",place:"Чернівці",marital:"неодружений",baptism:D(-70),events:[acc(D(-70),"хрещення (світ)",DK3)]},
 a18:{last:"Власенко",first:"Орест",mid:"Богданович",sex:"ч",birth:Y(45,9,1),phone:"050 300 40 18",place:"Чернівці",marital:"у шлюбі",baptism:"2005-06-19",part:"у процесі переходу до іншої церкви",events:[acc("2005-06-19","хрещення (світ)")]},
 a19:{last:"Яременко",first:"Любов",mid:"Іванівна",sex:"ж",birth:Y(72,5,21),phone:"0372 52 30 19",place:"Чернівці",address:"вул. Комарова, 31",marital:"вдова",baptism:"1984-08-12",needs:["потребує відвідин"],events:[acc("1984-08-12","хрещення (світ)",DK1)]},
 a20:{last:"Дорошенко",first:"Петро",mid:"Семенович",sex:"ч",birth:Y(63,7,4),place:"Чернівці",marital:"у шлюбі",baptism:"1993-06-06",events:[acc("1993-06-06","хрещення (світ)",DK1),{date:D(-150),type:"moved",note:"Переїхав до Львова, перейшов у місцеву церкву."}]},
 a21:{last:"Гаврилюк",first:"Зоя",mid:"Михайлівна",sex:"ж",birth:Y(84,11,11),place:"Чернівці",marital:"вдова",baptism:"1972-07-30",events:[acc("1972-07-30","хрещення (світ)",DK1),{date:D(-400),type:"died",note:""}]},
 a22:{last:"Шевчук",first:"Максим",mid:"Олександрович",sex:"ч",birth:Y(9,4,12),place:"Чернівці",kind:"дитина",family:"Савчук",events:[]},
 a23:{last:"Петренко",first:"Аліна",sex:"ж",birth:Y(26,8,30),phone:"098 700 80 23",place:"Чернівці",kind:"гість",notes:"Прийшла з подругою, відвідує вже місяць. Цікавиться хрещенням.",events:[],contacts:[{date:D(-12),kind:"дзвінок",by:PA,note:"Запросили на малу групу."}]}
};
var cols={people:P,
 groups:{g1:{name:"Центр",leader:"a05",members:["a05","a06","a07","a12","a16","a17","a23"],info:"середа, 19:00, у Савчуків"},g2:{name:"Садгора",leader:"a03",members:["a03","a04","a09","a15","a19"],info:"четвер, 18:30"},g3:{name:"Молодь",leader:"a07",members:["a07","a12","a16","a17"],info:"п'ятниця, 19:00"}},
 gmeet:{},
 reminders:{r1:{text:"Відвідати Ганну Степанівну",date:D(0),pid:"a08",by:"demo",byName:"Гість"},r2:{text:"Подзвонити Миколі щодо дров",date:D(2),pid:"a09",by:"demo",byName:"Гість"},r3:{text:"Привітати Катерину з днем народження",date:D(-1),pid:"a16",by:"demo",byName:"Гість"}},
 meetings:{m1:{date:D(-70),type:"членське зібрання",note:"Хрещення і прийняття двох нових членів."},m2:{date:D(-21),type:"братерська рада",note:"Обговорили відвідування літніх людей і підготовку до свята жнив."}},
 annual:{},archive:{},log:{},"log/demo/e":{}};
cols.gmeet["g1_"+D(-6)]={gid:"g1",date:D(-6),present:["a05","a06","a07","a12","a16"],note:"Читали Послання до филип'ян, розділ 2."};
cols.gmeet["g1_"+D(-13)]={gid:"g1",date:D(-13),present:["a05","a06","a12","a16","a17","a23"],note:""};
cols.gmeet["g2_"+D(-5)]={gid:"g2",date:D(-5),present:["a03","a04","a15","a19"],note:"Молитва за хворих."};
var docs={"config/main":{youtube:"https://www.youtube.com/@PrymyrennyaChurch",pastors:[{pid:"a01",name:PA}],deacons:[{pid:"a03",name:DK1,aliases:[]},{pid:"a05",name:DK2,aliases:[]},{pid:"a07",name:DK3,aliases:[],trial:true}],ministries:{"Лідер прославлення":["a06"],"Керівник недільної школи":["a02"],"Вчитель недільної школи":["a04","a12"],"Медіа та звук":["a17"],"Лідер молоді":["a07"]},userLinks:{demo:"a01"}}};
var cl={},dl={};
function snapC(c){var o=cols[c]||{};var a=Object.keys(o).map(function(k){return {id:k,data:function(){return JSON.parse(JSON.stringify(o[k]))}}});return {docs:a,forEach:function(f){a.forEach(f)},size:a.length,empty:!a.length}}
function snapD(p){var parts=p.split("/"),id=parts.pop(),c=parts.join("/"),v=docs[p]!==undefined?docs[p]:(cols[c]||{})[id];return {id:id,exists:v!==undefined,data:function(){return v===undefined?undefined:JSON.parse(JSON.stringify(v))}}}
function emit(c,p){(cl[c]||[]).forEach(function(f){setTimeout(function(){f(snapC(c))},0)});(dl[p]||[]).forEach(function(f){setTimeout(function(){f(snapD(p))},0)})}
function ref(c,id){var p=c+"/"+id;return {id:id,path:p,
  set:function(b,o){b=JSON.parse(JSON.stringify(b||{}));if(docs[p]!==undefined||!cols[c]&&c.split("/").length%2===0){docs[p]=o&&o.merge?Object.assign({},docs[p],b):b}else{cols[c]=cols[c]||{};cols[c][id]=o&&o.merge?Object.assign({},cols[c][id],b):b}emit(c,p);return Promise.resolve()},
  update:function(b){return this.set(b,{merge:true})},
  delete:function(){if(cols[c])delete cols[c][id];delete docs[p];emit(c,p);return Promise.resolve()},
  get:function(){return Promise.resolve(snapD(p))},
  onSnapshot:function(f){(dl[p]=dl[p]||[]).push(f);setTimeout(function(){f(snapD(p))},0);return function(){dl[p]=(dl[p]||[]).filter(function(x){return x!==f})}}}}
function col(c){var q={limit:function(){return q},orderBy:function(){return q},where:function(){return q},
  onSnapshot:function(f){(cl[c]=cl[c]||[]).push(f);setTimeout(function(){f(snapC(c))},0);return function(){cl[c]=(cl[c]||[]).filter(function(x){return x!==f})}},
  get:function(){return Promise.resolve(snapC(c))},
  doc:function(id){return ref(c,id||"d"+Date.now().toString(36)+Math.random().toString(36).slice(2,7))},
  add:function(b){var r=q.doc();return r.set(b).then(function(){return r})}};return q}
var db={collection:col,doc:function(p){var a=p.split("/"),id=a.pop();return ref(a.join("/"),id)}};
var user={me:function(){return Promise.resolve({id:"demo",name:"Гість демо",isOwner:true,canEdit:true,email:""})},id:function(){return Promise.resolve("demo")},isOwner:function(){return Promise.resolve(true)},canEdit:function(){return Promise.resolve(true)},can:function(){return Promise.resolve(true)},profiles:function(){return Promise.resolve({demo:{id:"demo",name:"Гість демо",isMe:true}})}};
var down={save:function(o){try{var data=o.data,blob=data instanceof Blob?data:new Blob([data]);var a=document.createElement("a"),u=URL.createObjectURL(blob);a.href=u;a.download=o.filename||"file";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);return Promise.resolve()}catch(e){return Promise.reject({code:"failed"})}}};
window.claude={use:function(n){return Promise.resolve(n==="db"?db:n==="user"?user:n==="downloads"?down:null)}};
window.__DEMO=true;
addEventListener("DOMContentLoaded",function(){var b=document.createElement("div");b.setAttribute("role","note");b.textContent="Демо: усі люди вигадані, зміни зникають після оновлення сторінки";b.style.cssText="position:fixed;z-index:45;left:50%;top:calc(8px + env(safe-area-inset-top,0px));transform:translateX(-50%);max-width:calc(100vw - 24px);padding:7px 14px;border-radius:99px;background:#131315;color:#fff;font:500 12.5px/1.2 system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 8px 24px rgba(0,0,0,.25);pointer-events:none;opacity:.92";document.body.appendChild(b);setTimeout(function(){b.style.transition="opacity .8s";b.style.opacity="0";setTimeout(function(){b.textContent="Демо";b.style.left="auto";b.style.right="12px";b.style.transform="none";b.style.top="auto";b.style.bottom="calc(12px + env(safe-area-inset-bottom,0px))";b.style.opacity=".7"},900)},9000)});
})();
