#!/usr/bin/env python3
"""Cria a cópia de teste: three.js local e um gancho __ev para os testes lerem o estado do jogo."""
import sys
s=open(sys.argv[1],encoding='utf8').read()
s=s.replace('https://cdn.jsdelivr.net/npm/three@0.147.0/','node_modules/three/')
s=s.replace('<script src="node_modules/three/build/three.min.js">','<script>window.__noLoad=true/* testes: monta direto, sem a tela de carregamento */</script><script src="node_modules/three/build/three.min.js">',1)
i=s.index('})();\n</script>')
s=s[:i]+'\nwindow.__ev=function(c){return eval(c)};window.__noOpen=true;/* testes: sem o clipe de abertura (teste próprio liga) */\n'+s[i:]
open(sys.argv[2],'w',encoding='utf8').write(s)
