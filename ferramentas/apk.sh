#!/bin/bash
# Monta o app Android (Fire TV / celular) a partir do pacote PWA: rumo-ao-cume.apk
# Ferramentas (npm, sem Android SDK): aaptjs3, @postar/apktool-node (apktool 2.9.3 com aapt2 e apksigner). Chave: chave-android.jks (NÃO publicar; sem ela o app não atualiza por cima).
set -e
R=$(cd "$(dirname "$0")/.." && pwd);T=$R/../apk/tools/node_modules/@postar/apktool-node/lib
[ -f "$T/apktool.jar" ] || { mkdir -p $R/../apk/tools && cd $R/../apk/tools && npm init -y >/dev/null && npm i --ignore-scripts @postar/apktool-node >/dev/null; }
python3 $R/ferramentas/pwa.py >/dev/null
W=$(mktemp -d);cp -r $R/ferramentas/apk-modelo/. $W/;mkdir -p $W/assets;cp -r $R/pwa/index.html $R/pwa/lib $R/pwa/icons $W/assets/
VC=$(cd $R && git rev-list --count HEAD);sed -i "s/versionCode: '.*'/versionCode: '$VC'/;s/versionName: '.*'/versionName: '1.$VC'/" $W/apktool.yml
java -jar $T/apktool.jar b $W -o $W/u.apk --use-aapt2 >/dev/null 2>&1
java -jar $T/apksigner.jar sign --ks $R/chave-android.jks --ks-pass env:APK_SENHA --key-pass env:APK_SENHA --min-sdk-version 22 --out $R/rumo-ao-cume.apk $W/u.apk 2>/dev/null
rm -rf $W;echo "ok versão 1.$VC $(du -k $R/rumo-ao-cume.apk|cut -f1) KB"
