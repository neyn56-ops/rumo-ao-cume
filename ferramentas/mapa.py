#!/usr/bin/env python3
"""Gera MAPA.md: cada função do jogo -> arquivo:linha e a descrição do comentário logo acima.
Uso: python3 ferramentas/mapa.py   (o testa.sh já chama). Para achar algo: grep -i palavra MAPA.md"""
import os,re,sys
base=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
P=os.path.join(base,'partes');out=['# Mapa do código (gerado por ferramentas/mapa.py — não editar à mão)','',
 'Busca: `grep -i palavra MAPA.md`; depois ler só as linhas: `sed -n INICIO,FIMp partes/ARQ`.','']
fn=re.compile(r'function\s+([A-Za-z_$][\w$]*)\s*\(')
for f in sorted(os.listdir(P)):
    L=open(os.path.join(P,f),encoding='utf8').read().split('\n')
    first=next((l.strip() for l in L[:6] if l.strip().startswith(('/*','//','<!--'))),'')
    out.append(f'## {f}  ({len(L)} linhas) {first[:140]}')
    for i,l in enumerate(L):
        for m in fn.finditer(l):
            if m.start()>0 and l[:m.start()].strip() and not l[:m.start()].rstrip().endswith((';','}','{')):continue
            d=''
            if m.start()<4:
                pv=L[i-1].strip() if i else ''
                if pv.startswith(('/*','//')):d=re.sub(r'^/\*+|\*+/$|^//','',pv).strip()[:110]
            out.append(f'- {m.group(1)} :{i+1}'+(f' — {d}' if d else ''))
    out.append('')
open(os.path.join(base,'MAPA.md'),'w',encoding='utf8').write('\n'.join(out))
print('MAPA.md:',sum(1 for x in out if x.startswith('- ')),'funções')
