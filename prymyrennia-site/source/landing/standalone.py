# wraps landing/landing.html (artifact body) into a full page; arg1 = output path, arg2 = "local" to use locally installed fonts for test screenshots
import sys,os,glob
b=open('landing/landing.html',encoding='utf8').read()
i=b.index('<style>'); head=b[:i]; rest=b[i:]; j=rest.index('</style>')+8
if len(sys.argv)>2 and sys.argv[2]=='local':
    F=os.path.abspath('landing/fonts/node_modules/@fontsource'); css=''
    spec=[('Comforter Brush','comforter-brush',[(400,'normal')]),('Playfair Display','playfair-display',[(900,'normal'),(900,'italic')]),('Cormorant Garamond','cormorant-garamond',[(500,'italic'),(600,'italic')]),('Unbounded','unbounded',[(500,'normal'),(800,'normal')]),('Oswald','oswald',[(600,'normal')]),('Onest','onest',[(400,'normal'),(500,'normal'),(600,'normal')])]
    for fam,pk,ws in spec:
        for w,st in ws:
            for sub,ur in (('latin','U+0000-00FF,U+2000-206F,U+20AC'),('cyrillic','U+0400-04FF,U+2116')):
                f='%s/%s/files/%s-%s-%d-%s.woff2'%(F,pk,pk,sub,w,st)
                if os.path.exists(f): css+='@font-face{font-family:"%s";font-style:%s;font-weight:%d;src:url("file://%s");unicode-range:%s}\n'%(fam,st,w,f,ur)
                else: print('missing',f)
    import re
    head=re.sub(r'<link rel="stylesheet"[^>]*>','<style>'+css+'</style>',head)
doc='<!doctype html>\n<html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="robots" content="noindex">\n<meta name="description" content="Церква «Примирення» в Чернівцях. Зібрання щонеділі об 11:00.">\n<link rel="icon" type="image/png" href="../favicon.png"><link rel="apple-touch-icon" href="../apple-touch-icon.png">\n<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'+head+'<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'+rest[:j]+'\n</head><body>\n'+rest[j:]+'\n</body></html>\n'
os.makedirs(os.path.dirname(os.path.abspath(sys.argv[1])),exist_ok=True); open(sys.argv[1],'w',encoding='utf8').write(doc); print(len(doc))
