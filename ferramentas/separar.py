#!/usr/bin/env python3
"""Separa o jogo (um HTML só) nas partes marcadas com /*@@parte:nome*/ ou <!--@@parte:nome-->.
Uso: python3 ferramentas/separar.py jogo.html partes/"""
import sys,os,re
src,dst=sys.argv[1],sys.argv[2]
os.makedirs(dst,exist_ok=True)
for f in os.listdir(dst):
    if re.match(r'^\d\d_',f):os.remove(os.path.join(dst,f))
pat=re.compile(r'^(?:/\*@@parte:(\S+?)\*/|<!--@@parte:(\S+?)-->)$')
name='00_inicio.html';buf=[];parts=[]
for l in open(src,encoding='utf8').read().split('\n'):
    m=pat.match(l)
    if m:
        parts.append((name,buf));name=m.group(1) or m.group(2);buf=[]
    buf.append(l)
parts.append((name,buf))
names=[p[0] for p in parts];assert len(names)==len(set(names)),'parte repetida'
for n,b in parts:
    open(os.path.join(dst,n),'w',encoding='utf8').write('\n'.join(b))
print(len(parts),'partes em',dst)
