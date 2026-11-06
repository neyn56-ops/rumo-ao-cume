"""Monta a versão para portais de jogos (CrazyGames etc.): portal/ e rumo-ao-cume-portal.zip
   Diferenças do site: window.PORTAL=1 (fases travadas, carrega mais rápido, jogador novo cai direto no Mundo 1),
   bibliotecas dentro do pacote (caminhos relativos), sem app/serviço offline/selo de versão."""
import os,shutil,re,zipfile
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(R,'portal')
shutil.rmtree(O,ignore_errors=True);os.makedirs(O)
s=open(R+'/jogo.html',encoding='utf8').read()
NM=R+'/testes/node_modules/three/'
libs=re.findall(r'https://cdn\.jsdelivr\.net/npm/three@0\.147\.0/([^"]+)',s)
# tudo num arquivo só (o portal não aceita .zip nem guarda as pastas): as bibliotecas vão dentro do index.html
for p in libs:
    js=open(NM+p,encoding='utf8').read().replace('</script','<\\/script')
    s=s.replace('<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/'+p+'"></script>','<script>'+js+'</script>')
assert 'cdn.jsdelivr' not in s, 'sobrou biblioteca de fora'
i=s.index('<head>')+6 if '<head>' in s else s.index('<style>')
s=s[:i]+'<script>window.PORTAL=1</script>'+s[i:]
open(O+'/index.html','w',encoding='utf8').write(s)
z=os.path.join(R,'rumo-ao-cume-portal.zip')
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED) as f:
    for b,_,fs in os.walk(O):
        for n in fs:p=os.path.join(b,n);f.write(p,os.path.relpath(p,O))
print('ok',len(libs),'libs',os.path.getsize(z)//1024,'KB')
