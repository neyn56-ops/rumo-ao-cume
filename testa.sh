#!/bin/bash
# Teste completo: monta o jogo a partir das partes, confere a montagem e roda todos os testes.
cd "$(dirname "$0")"
python3 ferramentas/mapa.py >/dev/null; python3 ferramentas/montar.py partes/ jogo.html >/dev/null || exit 1
python3 ferramentas/copia_teste.py jogo.html testes/teste.html || exit 1
timeout 1500 node testes/roda.js 2>&1 | tee testes/ultimo.log; exit ${PIPESTATUS[0]}
