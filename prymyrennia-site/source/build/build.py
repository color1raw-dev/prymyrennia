import re,sys
src=open('src/body.html',encoding='utf8').read()
a=src.index('<script>')+8; b=src.rindex('</script>')
js=src[a:b]
i=js.index('/* ---------- views ---------- */'); j=js.index('function vReminders(){')
js=js[:i]+open('build/vhome.js',encoding='utf8').read()+js[j:]
def rep(old,new,n=1):
    global js
    c=js.count(old); assert c==n,(old,c)
    js=js.replace(old,new)
rep('function reminders(){','function reminders0(){')
rep('function filtered(){','function filtered0(){')
rep('function hay(x){','function hay0(x){')
rep('function usersPanel(){','function usersPanel0(){')
rep('(S.sort===key?(S.dir>0?" ↑":" ↓"):"")','(S.sort===key?ico(S.dir>0?"up":"down"):"")')
rep("SPECIAL[S.fSpecial]+' ✕</button>'","SPECIAL[S.fSpecial]+' '+ico(\"x\")+'</button>'")
rep('style="color:var(--bad)">✕</button>','style="color:var(--bad)">\'+ico("x")+\'</button>')
rep('>=0?"✓":','>=0?ico("check"):')
rep('data-m="contact">+ контакт</button>','data-m="contact">\'+ico("plus")+\' контакт</button>')
rep('<button class="btn small x" data-act="close">Закрити</button>','<button class="iconbtn x" data-act="close" aria-label="Закрити">\'+ico("x")+\'</button>',2)
rep('''h='<div class="dlg"><div class="dlg-head"><span class="av big">\'''','''h='<div class="dlg"><div class="dlg-head hero-head '+({member:"g-olive",note:"g-sun",excluded:"g-rose",none:"g-steel"}[d.st]||"g-ink")+'"><span class="av big">\'''')
rep('document.getElementById("title").textContent=TITLES[S.tab];','setHead();')
rep('if(a==="noop")return true;','if(a==="noop")return true;if(extra(a,t,v))return true;')
rep('S.q=e.target.value;S.fStatus="all";S.fDeacon="";S.fSpecial="";if(S.tab!=="people"){S.tab="people"}render()','S.q=e.target.value;if(S.tab!=="people"){S.fStatus="all";S.fDeacon="";S.fSpecial="";S.tab="people"}render()')
i=js.index("if(W||nd.length)h+='<div><h3 style=\"margin-bottom:8px\">Потреби</h3>"); j=js.index("</div></div>';",i)+len("</div></div>';")
js=js[:i]+"h+=needsBlock(p,W)+rolesBlock(p,W);"+js[j:]
i=js.index("var h='<div class=\"panel pad\"><div class=\"bar\"><label class=\"bar\" style=\"font-weight:600\">Рік"); e='<div id="repOut" style="display:flex;flex-direction:column;gap:18px">\';'; j=js.index(e,i)+len(e)
js=js[:i]+open('build/rephead.js',encoding='utf8').read().strip()+js[j:]
rep('<div><h3 style="margin-bottom:8px">Родина</h3>','<div class="blk"><h3>Родина</h3>',0) if False else None
rep('function logRows(L){return \'<table><thead>','function logRows(L){return \'<table class="logt"><thead>')
rep('var b=e.target.closest("button");if(b)go(b.dataset.tab)','var b=e.target.closest("button");if(b&&b.dataset.tab)go(b.dataset.tab)')
k=js.rindex('start();'); js=js[:k]+open('build/override.js',encoding='utf8').read()+'\n'+open('build/ailocal.js',encoding='utf8').read()+'\n'+open('build/memenu.js',encoding='utf8').read()+'\n'+js[k:]
rep('set({date:cm.date,type:cm.type,note:val("m_edit")})','set({date:cm.date,type:cm.type,note:val("m_edit"),video:cm.video||""})')
rep('else if(col==="meetings")o=scal(a,b,["date","type","note"]);','else if(col==="meetings")o=scal(a,b,["date","type","note","video"]);')
rep('db.collection("groups").limit(500).onSnapshot(','db.collection("reminders").limit(500).onSnapshot(function(snap){S.rem=snap.docs.map(function(d){return Object.assign({id:d.id},d.data())});if(S.ready)render()},function(){});\n    db.collection("groups").limit(500).onSnapshot(')
rep('col==="gmeet"?"Зустріч групи "','col==="reminders"?"Нагадування: "+(d.text||""):col==="gmeet"?"Зустріч групи "')
rep('if(col==="gmeet")return cp(S.gmeet.filter(function(g){return g.id===id})[0]);return null}','if(col==="gmeet")return cp(S.gmeet.filter(function(g){return g.id===id})[0]);if(col==="reminders")return cp((S.rem||[]).filter(function(g){return g.id===id})[0]);return null}')
rep('var ev={date:val("f_adate")||today(),type:"accepted",how:val("f_how")};','var ev={date:val("f_adate"),type:"accepted",how:val("f_how")};')
rep('nb=Object.assign(body(p),readForm());','nb=Object.assign(body(p),readForm());fixJoined(p,nb);')
rep('document.getElementById("addBtn").hidden=!S.canWrite;','document.getElementById("addBtn").hidden=!S.canWrite||lim();')
rep("<b>Contributor</b> — вносить зміни, <b>Editor</b> — повні права й цей журнал. Contributor за замовчуванням має обмежені права (контакти, дані, потреби, малі групи); повні права йому можна ввімкнути нижче.","<b>Contributor</b> — вносить зміни, <b>Editor</b> — повні права й цей журнал. Прив\\'яжіть кожного користувача до його картки нижче: пастор, секретар і адміністратор отримують повні права автоматично, диякон бачить усіх, але змінює лише закріплених за ним людей. Повні права можна також увімкнути вручну.")
rep('''var h='<div class="box small"><div><b>Хто має доступ.</b>''','''var h=window.__SITE?"":'<div class="box small"><div><b>Хто має доступ.</b>''')
rep('  if(dlg.open)renderDlg()}','  if(dlg.open)renderDlg();if(TOUR)tourMark()}')
rep('h+=needsBlock(p,W)+rolesBlock(p,W);','h+=partBlock(p,W)+needsBlock(p,W)+rolesBlock(p,W);')
rep('"kind","followUp","remindOff"])','"kind","followUp","remindOff","part"])')
rep('"Служіння","Малі групи","Потреби"','"Служіння","Малі групи","Стан у церкві","Потреби"')
rep('groupsOf(p.id).map(function(g){return g.name}).join(", "),(p.needs||[]).join(", "),fd(lastContact(p)),p.notes]','groupsOf(p.id).map(function(g){return g.name}).join(", "),p.part||"",(p.needs||[]).join(", "),fd(lastContact(p)),p.notes]')
rep('["non","Не члени церкви",0]','["part","Стан у церкві",0],["non","Не члени церкви",0]')
rep('  var any=false;REPORTS.forEach','  R.part=function(){var o={};A.forEach(function(x){var k=x.p.part||"не вказано";o[k]=(o[k]||0)+1});var rows=A.filter(function(x){return x.p.part&&x.p.part!==PART[0]}).map(function(x){return [pl(x.p),esc(x.p.part),esc(x.d.deacon),esc(x.p.phone||"")]});sec("part","Стан у церкві",\'<div>\'+hbars(srt(o))+\'</div>\'+tbl([["Людина"],["Стан"],["Диякон"],["Телефон"]],rows,"Усі чинні члени активні або стан не вказано."))};\n  var any=false;REPORTS.forEach')
for ch in '✕✓↑↓': assert ch not in js, ch
import base64
hd=open('build/head.html',encoding='utf8').read().replace('{{HANDS}}','data:image/webp;base64,'+open('logo/hands2.b64.txt').read().strip())
out=hd+'\n<script>'+js+'</script>\n'

open('build/page.html','w',encoding='utf8').write(out)
print(len(out))
