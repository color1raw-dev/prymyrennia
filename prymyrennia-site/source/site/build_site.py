import re,os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'))
page=open('build/page.html',encoding='utf8').read()
i=page.rindex('<script>'); markup=page[:i]; app=page[i:]
lib=open('site/lib/supabase.js',encoding='utf8').read()
assert '</script' not in lib.lower()
shim=open('site/shim.js',encoding='utf8').read().replace('__SB_URL__','https://nbxsomiypukivlnralrv.supabase.co').replace('__SB_KEY__','sb_publishable_jJqOvUT8q7Gj54h4xZ45ng_YxUR0eMV')
shim+='''
(function(){var t0=Date.now();function hidePre(){var p=document.getElementById("pre");if(p&&document.getElementById("auth"))p.classList.add("out")}setTimeout(hidePre,2900);setTimeout(hidePre,4200)})();
'''
css='''<style>
#auth{position:fixed;inset:0;z-index:55;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden auto;padding:16px}
.au-hands{flex:none;width:max(112vw,960px);aspect-ratio:1900/483;background:var(--hands) center/100% 100% no-repeat;margin:-6vh 0 -7vh;pointer-events:none}
.au-card{position:relative;flex:none;width:min(410px,100%);display:flex;flex-direction:column;gap:14px;padding:26px;border-radius:34px;background:var(--surface);box-shadow:0 30px 90px rgba(0,0,0,.18)}
.au-t{font-size:30px;font-weight:500;letter-spacing:-.045em;line-height:1}
.au-t small{display:block;font-size:13px;font-weight:400;letter-spacing:0;color:var(--muted);margin-top:8px}
.au-tabs{display:flex;gap:4px;padding:4px;border-radius:99px;background:var(--soft)}
.au-tabs button{flex:1;height:38px;border:0;border-radius:99px;background:none;color:var(--fg);font:inherit;font-size:14px;cursor:pointer}
.au-tabs button[aria-selected="true"]{background:var(--accent);color:var(--accent-fg)}
.au-card label{display:flex;flex-direction:column;gap:6px;font-size:12.5px;color:var(--muted)}
.au-card input{width:100%;height:48px;border-color:var(--line)}
.au-card .btn{height:50px;width:100%}
.au-note{font-size:13.5px;padding:10px 14px;border-radius:16px;background:var(--bad-bg);color:var(--bad)}
.au-note.ok{background:var(--ok-bg);color:var(--ok)}
.au-f{font-size:12.5px;color:var(--muted);text-align:center;line-height:1.45}
#siteOut{margin-left:8px}
</style>
'''
doc='''<!doctype html>
<html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#e5e5e8"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Примирення">
<style>:root{color-scheme:light;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>
'''+markup.replace('<title>Церковний облік</title>','<title>Примирення · церковний облік</title>')+css+'<script>'+lib+'</script>\n<script>'+shim+'</script>\n'+app+'\n</body></html>\n'
os.makedirs('site/out',exist_ok=True)
open('../index.html','w',encoding='utf8').write(doc)
print(len(doc))
