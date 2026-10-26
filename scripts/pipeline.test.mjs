import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {draw,approved} from './pipeline.mjs';
import {spawnSync} from 'node:child_process';
const pool=JSON.parse(fs.readFileSync('data/candidates.json'));
test('seed reproduces unique selections with five different regions',()=>{const a=draw(pool,5,42);assert.deepEqual(a,draw(pool,5,42));assert.equal(new Set(a.map(p=>p.id)).size,5);assert.equal(new Set(a.map(p=>p.region)).size,5);});
test('bad arguments fail',()=>{for(const n of [0,-1,pool.length+1,1.5,NaN])assert.throws(()=>draw(pool,n,42));});
test('drafts, demos and missing evidence cannot publish',()=>{assert.equal(approved({mode:'demo',review_status:'approved',facts:[]}),false);assert.equal(approved({mode:'live',review_status:'draft',facts:[]}),false);assert.equal(approved({mode:'live',review_status:'approved',facts:[]}),false);assert.equal(approved({mode:'live',review_status:'approved',facts:[{verification_status:'verified'}]}),false);});
test('production rejects demo-only dataset',()=>{const result=spawnSync(process.execPath,['scripts/pipeline.mjs','validate'],{env:{...process.env,PUBLICATION_MODE:'production',SITE_URL:'https://oyado.example.com'},encoding:'utf8'});assert.equal(result.status,1);assert.match(result.stderr,/No approved live guides/);});
