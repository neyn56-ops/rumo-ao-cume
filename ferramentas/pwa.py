"""Monta o pacote PWA (app instalável e que funciona sem internet): pwa/ e rumo-ao-cume-app.zip"""
import os,shutil,re,json,hashlib,zipfile
from PIL import Image,ImageDraw
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(R,'pwa')
shutil.rmtree(O,ignore_errors=True);os.makedirs(O+'/lib');os.makedirs(O+'/icons')
s=open(R+'/jogo.html',encoding='utf8').read()
NM=R+'/testes/node_modules/three/'
libs=re.findall(r'https://cdn\.jsdelivr\.net/npm/three@0\.147\.0/([^"]+)',s)
for p in libs:
    d=O+'/lib/'+p;os.makedirs(os.path.dirname(d),exist_ok=True);shutil.copy(NM+p,d)
s=s.replace('https://cdn.jsdelivr.net/npm/three@0.147.0/','lib/')
ver=hashlib.md5(s.encode()).hexdigest()[:8]
head=('<link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#16202a">'
 '<link rel="icon" href="icons/icon-192.png"><link rel="apple-touch-icon" href="icons/icon-192.png">'
 '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">')
i=s.index('</head>');s=s[:i]+head+s[i:]  # tem que ficar dentro do <head>: no <body> o Chrome ignora o manifesto
s=s.replace('</body>','<script>if("serviceWorker" in navigator&&location.protocol!=="file:"){addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(r){try{r.update()}catch(e){}}).catch(function(){});var t0=Date.now(),rl=false,had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener("controllerchange",function(){if(had&&!rl&&Date.now()-t0<20000){rl=true;location.reload()}})/* versão nova chegou logo ao abrir: recarrega sozinho uma vez */})}</script></body>',1)
open(O+'/index.html','w',encoding='utf8').write(s)
# ícone: montanha nevada com a bandeirinha dourada no cume e a faixa vermelha do Kuro
def icon(n,mask=False):
    S=n*4;im=Image.new('RGB',(S,S));d=ImageDraw.Draw(im)
    for y in range(S):
        k=y/S;d.line([(0,y),(S,y)],fill=(int(30+60*k),int(70+90*k),int(140+70*k)))
    pad=S*(.12 if mask else 0)
    def P(x,y):return (pad+x*(S-2*pad),pad+y*(S-2*pad))
    d.polygon([P(-.1,1.05),P(.28,.55),P(.45,.7),P(.62,.3),P(1.1,1.05)],fill=(46,58,74))
    d.polygon([P(.62,.3),P(.52,.43),P(.57,.47),P(.62,.41),P(.68,.47),P(.73,.43)],fill=(240,246,255))
    d.polygon([P(.28,.55),P(.22,.63),P(.28,.62),P(.34,.64)],fill=(230,238,250))
    d.line([P(.62,.3),P(.62,.08)],fill=(250,240,220),width=int(S*.018))
    d.polygon([P(.62,.08),P(.8,.13),P(.62,.18)],fill=(255,196,58))
    d.rectangle([P(-.1,.8),P(1.1,.88)],fill=(206,40,46))
    d.polygon([P(.18,.8),P(.06,.95),P(.14,.96),P(.24,.88)],fill=(206,40,46))
    if not mask:
        m=Image.new('L',(S,S),0);ImageDraw.Draw(m).rounded_rectangle([0,0,S-1,S-1],radius=int(S*.22),fill=255)
        bg=Image.new('RGBA',(S,S),(0,0,0,0));bg.paste(im,(0,0),m);im=bg
    return im.resize((n,n),Image.LANCZOS)
for n in (192,512):icon(n).save(O+f'/icons/icon-{n}.png')
icon(512,True).save(O+'/icons/maskable-512.png')
json.dump({"name":"Rumo ao Cume","short_name":"Rumo ao Cume","description":"As aventuras do ninja Kuro","start_url":"./","scope":"./","display":"fullscreen","orientation":"landscape",
 "background_color":"#16202a","theme_color":"#16202a","lang":"pt-BR",
 "icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icons/maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},
 open(O+'/manifest.webmanifest','w'),ensure_ascii=False,indent=1)
ver=hashlib.md5(open(O+'/index.html','rb').read()+open(O+'/manifest.webmanifest','rb').read()).hexdigest()[:8]  # versão do cache = conteúdo final (muda sozinha)
files=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png']+['lib/'+p for p in libs]
open(O+'/sw.js','w').write('''/* guarda o jogo no aparelho: abre sem internet; troca de versão sozinho quando o jogo muda */
var V='rumo-%s',F=%s;
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(F)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==V}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||fetch(e.request).then(function(n){if(n&&(n.ok||n.type==='opaque')&&/fonts\\.(googleapis|gstatic)\\.com/.test(e.request.url)){var cp=n.clone();caches.open(V).then(function(c){c.put(e.request,cp)})}return n}).catch(function(){return caches.match('index.html')})}))});
'''%(ver,json.dumps(files)))
z=R+'/rumo-ao-cume-app.zip'
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED) as zf:
    for root,_,fs in os.walk(O):
        for f in fs:p=os.path.join(root,f);zf.write(p,os.path.relpath(p,O))
print('ok',ver,os.path.getsize(z)//1024,'KB',len(files),'arquivos no cache')
