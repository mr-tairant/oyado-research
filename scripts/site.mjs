import {spawnSync,spawn} from 'node:child_process';
import path from 'node:path';
const args=process.argv.slice(2),action=args[0];
const option=(flag,fallback)=>{const i=args.indexOf(flag);return i<0?fallback:args[i+1];};
const mode=option('--mode','demo'),port=option('--port','4322');
if(!['dev','build','preview'].includes(action)||!['demo','review','production'].includes(mode))throw Error('Invalid action or publication mode');
if(!/^\d+$/.test(port)||Number(port)<1024||Number(port)>65535)throw Error('Invalid port');
if(mode==='production'&&!process.env.SITE_URL)throw Error('Set the actual production SITE_URL before building');
const env={...process.env,PUBLICATION_MODE:mode,ASTRO_TELEMETRY_DISABLED:'1'};
const cwd=path.resolve(import.meta.dirname,'..');
if(action==='build'){
 const check=spawnSync(process.execPath,['scripts/pipeline.mjs','validate'],{cwd,env,stdio:'inherit'});
 if(check.status!==0)process.exit(check.status||1);
}
const child=spawn(process.execPath,['node_modules/astro/astro.js',action,...(action==='build'?[]:['--host','127.0.0.1','--port',port])],{cwd,env,stdio:'inherit'});
child.on('error',e=>{console.error(e.message);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code||0;});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
