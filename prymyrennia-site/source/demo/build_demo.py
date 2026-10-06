# Builds the public demo (invented people, in-memory data): run after build/build.py, from the source folder. Writes ../demo/index.html
import os
page=open('build/page.html',encoding='utf8').read().replace('<title>Церковний облік</title>','<title>Примирення · демо</title>')
stub=open('demo/stub.js',encoding='utf8').read(); assert '</script' not in stub
doc='<!doctype html>\n<html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#e5e5e8">\n<link rel="icon" type="image/png" href="../favicon.png"><link rel="apple-touch-icon" href="../apple-touch-icon.png">\n<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>\n</head><body>\n<script>\n'+stub+'</script>\n'+page+'\n</body></html>\n'
os.makedirs('../demo',exist_ok=True); open('../demo/index.html','w',encoding='utf8').write(doc); print(len(doc))
