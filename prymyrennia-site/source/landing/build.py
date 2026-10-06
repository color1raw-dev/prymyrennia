import base64,re
head=open('build/head.html',encoding='utf8').read().split('\n')
tokens='\n'.join(head[4:30])
bgl=[]
for n,l in enumerate(head):
    if l.startswith('.bgfx') or l.startswith('@keyframes fx') or 'prefers-reduced-motion:reduce){.bgfx' in l:
        bgl.append(l);k=n
        while '\n'.join(bgl).count('{')>'\n'.join(bgl).count('}'):
            k+=1;bgl.append(head[k])
bg='\n'.join(bgl)
grad='\n'.join(l for l in head if re.match(r'\.g-(olive|sun|rose|steel|ink)\{',l))
hands='data:image/webp;base64,'+base64.b64encode(open('logo/hands2.webp','rb').read()).decode()
I=lambda d:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>'
IC=dict(
 arrow=I('<path d="M7 17L17 7"/><path d="M8 7h9v9"/>'),
 play=I('<path d="M7 5l12 7-12 7z"/>'),
 pin=I('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>'),
 clock=I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
 book=I('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.500z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>'),
 heart=I('<path d="M12 20s-7-4.4-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.500C19 15.600 12 20 12 20z"/>'),
 users=I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.870"/><path d="M16 3.130a4 4 0 0 1 0 7.750"/>'),
 hand=I('<path d="M7 11V6a1.500 1.500 0 0 1 3 0v4"/><path d="M10 10V4.500a1.500 1.500 0 0 1 3 0V10"/><path d="M13 10V6a1.500 1.500 0 0 1 3 0v5"/><path d="M16 9a1.500 1.500 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.700L4 15.500a1.500 1.500 0 0 1 2.500-1.600L7 14.500"/>'),
 music=I('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
 cup=I('<path d="M5 8h12v5a6 6 0 0 1-12 0z"/><path d="M17 9h1.500a2.500 2.500 0 0 1 0 5H17"/><path d="M4 21h14"/>'),
 circles=I('<circle cx="12" cy="7" r="3.500"/><circle cx="6.500" cy="16.500" r="3.500"/><circle cx="17.500" cy="16.500" r="3.500"/>'),
 cam=I('<rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10l5-3v10l-5-3z"/>'),
 spark=I('<path d="M12 3l1.900 5.100L19 10l-5.100 1.900L12 17l-1.900-5.100L5 10l5.100-1.900z"/>'),
 smile=I('<circle cx="12" cy="12" r="9"/><path d="M8.500 14.500a4.500 4.500 0 0 0 7 0"/><path d="M9 9.500h.010M15 9.500h.010"/>'),
 child=I('<circle cx="12" cy="6" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/>'),
 menu=I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
 lock=I('<rect x="5" y="11" width="14" height="9" rx="2.500"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
)
YT='https://www.youtube.com/@PrymyrennyaChurch'
html=open('landing/body.html',encoding='utf8').read()
for k,v in IC.items(): html=html.replace('{{i:'+k+'}}',v)
html=html.replace('{{YT}}',YT).replace('{{TOKENS}}',tokens).replace('{{BGFX}}',bg).replace('{{GRAD}}',grad).replace('{{HANDS}}',hands)
assert '{{' not in html, re.findall(r'\{\{[^}]*\}\}',html)[:5]
open('landing/landing.html','w',encoding='utf8').write(html)
print(len(html))
