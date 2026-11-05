/* Roda só alguns testes:  node testes/so.js 61 62   (números dos blocos "/* N:" de roda.js)
   Use durante correções; antes de publicar rode ./testa.sh (todos). */
const fs=require('fs'),path=require('path');
const want=process.argv.slice(2).map(String);if(!want.length){console.log('uso: node testes/so.js 61 62');process.exit(2)}
const L=fs.readFileSync(path.join(__dirname,'roda.js'),'utf8').split('\n');
const ini=L.findIndex(l=>/^ const \{pg,E,erros\}=await pagina\(b,'high'\);/.test(l));
const fim=L.findIndex(l=>/^ marca\('sem erros de JavaScript/.test(l));
const head=L.slice(0,12),out=[...head];
const blk1=L.slice(12,ini);if(want.some(w=>w==='1'||w==='2'))out.push(...blk1);
out.push(L[ini]);let keep=false;
for(let i=ini+1;i<fim;i++){const m=L[i].match(/^ \/\* ([0-9][^:]*):/);if(m){const ns=m[1].match(/\d+/g)||[];keep=ns.some(n=>want.includes(n))}if(keep)out.push(L[i])}
out.push(...L.slice(fim));
const tmp=path.join(__dirname,'so_tmp.js');fs.writeFileSync(tmp,out.join('\n'));require(tmp);
