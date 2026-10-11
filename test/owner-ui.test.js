const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {test}=require('node:test');
const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
const apply=html.match(/function applyOwnerAccess\(allowed\)\{[^\n]+/)[0];
test('owner UI reveals the original panel only after confirmed authorization',()=>{
 const elements={'#adm':{hidden:true},'#panel':{hidden:true}};
 const ctx=vm.createContext({isAdmin:false,openOwnerPanel:true,$:id=>elements[id],URL,location:{href:'https://game.example/?owner=1'},history:{replaceState:()=>{}}});
 vm.runInContext(apply,ctx);
 vm.runInContext('applyOwnerAccess(false)',ctx);assert.equal(elements['#adm'].hidden,true);assert.equal(elements['#panel'].hidden,true);
 vm.runInContext('applyOwnerAccess(true)',ctx);assert.equal(elements['#adm'].hidden,false);assert.equal(elements['#panel'].hidden,false);assert.equal(ctx.isAdmin,true);
 vm.runInContext('applyOwnerAccess(false)',ctx);assert.equal(elements['#adm'].hidden,true);assert.equal(elements['#panel'].hidden,true);
});
