import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {reviewFiles} from './international-review.mjs';
test('translation approval requires human evidence and rejects later changes',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'oyado-translation-'));
 const script=path.resolve('scripts/international-review.mjs');
 try{
  for(const file of new Set([...reviewFiles('ko'),...reviewFiles('zh-cn')])){
   const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);
  }
  const run=(args,env={})=>spawnSync(process.execPath,[script,...args],{cwd:root,env:{...process.env,HUMAN_REVIEWER:'',APPROVAL_EVIDENCE:'',...env},encoding:'utf8'});
  for(const locale of ['ko','zh-cn']){
   assert.equal(run(['--prepare',locale]).status,0);
   assert.notEqual(run(['--approve',locale]).status,0);
   assert.equal(run(['--approve',locale],{HUMAN_REVIEWER:'fixture-human',APPROVAL_EVIDENCE:'Isolated test fixture only'}).status,0);
  }
  const approved=locale=>spawnSync(process.execPath,['--input-type=module','-e',`import {translationApproved} from ${JSON.stringify(new URL('./international-review.mjs',import.meta.url).href)};console.log(translationApproved(${JSON.stringify(locale)}));`],{cwd:root,encoding:'utf8'}).stdout.trim()==='true';
  assert.ok(approved('ko'));assert.ok(approved('zh-cn'));
  fs.appendFileSync(path.join(root,'src/content/stays-ko/kiraku.md'),'\nChanged fixture content.\n');
  assert.equal(approved('ko'),false);assert.equal(approved('zh-cn'),true);
  fs.appendFileSync(path.join(root,'src/styles/global.css'),'\n/* changed fixture */\n');
  assert.equal(approved('zh-cn'),false);
  fs.unlinkSync(path.join(root,'data/international-review.json'));
  assert.equal(approved('ko'),false);
 }finally{
  const target=path.resolve(root),parent=path.resolve(os.tmpdir());
  if(path.dirname(target)!==parent||!path.basename(target).startsWith('oyado-translation-'))throw Error('Unexpected fixture cleanup target');
  fs.rmSync(target,{recursive:true,force:true});
 }
});
