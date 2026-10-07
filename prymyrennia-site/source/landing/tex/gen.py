import numpy as np, io, base64
from PIL import Image, ImageFilter
rng=np.random.default_rng(7)
def fbm(w,h,base=4,oct=6,pers=.55,seed=0):
    r=np.random.default_rng(seed); out=np.zeros((h,w),np.float32); amp=1; tot=0
    for o in range(oct):
        n=base*2**o; a=r.random((max(2,int(n*h/w))+1,n+1)).astype(np.float32)
        im=Image.fromarray((a*255).astype(np.uint8)).resize((w,h),Image.BICUBIC)
        out+=np.asarray(im,np.float32)/255*amp; tot+=amp; amp*=pers
    out/=tot; return (out-out.min())/(out.max()-out.min())
def sm(x,a,b):
    t=np.clip((x-a)/(b-a),0,1); return t*t*(3-2*t)
def grain(img,amt,seed=1):
    r=np.random.default_rng(seed); n=r.normal(0,amt,img.shape[:2]).astype(np.float32)[...,None]
    return np.clip(img+n,0,255)
def save(arr,name,q):
    Image.fromarray(arr.astype(np.uint8)).save('landing/tex/'+name,quality=q,optimize=True,progressive=True)
# sky with clouds
W,H=1500,860
y=np.linspace(0,1,H,dtype=np.float32)[:,None]
top=np.array([70,132,200],np.float32); bot=np.array([138,186,226],np.float32)
sky=top+(bot-top)*y[...,None]**1.1
sky=np.broadcast_to(sky,(H,W,3)).copy()
n=fbm(W,H,3,7,.56,3); n2=fbm(W,H,6,5,.5,9)
dens=n*.75+n2*.25+ (y-.45)*.28
a=sm(dens,.52,.74)[...,None]
shade=sm(fbm(W,H,5,5,.5,21),.3,.8)[...,None]
cloud=np.array([252,250,246],np.float32)-shade*np.array([40,34,26],np.float32)
sky=sky*(1-a*.93)+cloud*a*.93
save(grain(sky,9,2),'sky.jpg',62)
# sand dunes
W2,H2=1100,760
yy,xx=np.mgrid[0:H2,0:W2].astype(np.float32)
warp=fbm(W2,H2,3,4,.5,5)*150+fbm(W2,H2,8,3,.5,6)*26
rip=np.sin((yy*0.105+xx*0.028+warp*0.11))
rip2=np.sin((yy*0.33+xx*0.07+warp*0.3))*.25
big=fbm(W2,H2,2,3,.5,12)
base=np.array([214,170,108],np.float32)
sand=base[None,None,:]*(0.86+0.2*big[...,None])+ (rip[...,None]*17+rip2[...,None]*8)*np.array([1,.86,.6],np.float32)
save(grain(sand,11,4),'sand.jpg',58)
# grain tile (transparent speckles)
T=160; g=np.zeros((T,T,4),np.uint8); v=rng.normal(0,1,(T,T))
g[...,:3]=np.where(v[...,None]>0,255,0); g[...,3]=np.clip(np.abs(v)*30,0,90)
Image.fromarray(g,'RGBA').save('landing/tex/grain.png',optimize=True)
import os
for f in ('sky.jpg','sand.jpg','grain.png'): print(f,os.path.getsize('landing/tex/'+f))
