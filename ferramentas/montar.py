#!/usr/bin/env python3
"""Junta as partes (em ordem de nome) de volta num HTML só.
Uso: python3 ferramentas/montar.py partes/ saida.html"""
import sys,os,re
src,dst=sys.argv[1],sys.argv[2]
fs=sorted(f for f in os.listdir(src) if re.match(r'^\d\d_',f))
txt='\n'.join(open(os.path.join(src,f),encoding='utf8').read() for f in fs)
open(dst,'w',encoding='utf8').write(txt)
print(len(fs),'partes ->',dst,len(txt.encode()),'bytes')
