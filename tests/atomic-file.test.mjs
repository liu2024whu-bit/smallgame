import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir,rm} from 'node:fs/promises';
import {join,resolve,sep} from 'node:path';
import {tmpdir} from 'node:os';
import {atomicFile} from '../tools/atomic-file.mjs';

test('file replacement writes the full text and leaves no temporary file',async()=>{
 const parent=resolve(process.env.TEST_TMP??tmpdir()),directory=await mkdtemp(join(parent,'kernel-write-'));
 try{
  const file=join(directory,'progress.txt');await atomicFile(file,'first');
  const next='second\n\u706f\u5149\n'.repeat(1000);await atomicFile(file,next);
  assert.equal(await readFile(file,'utf8'),next);assert.deepEqual(await readdir(directory),['progress.txt']);
 }finally{assert.ok(resolve(directory).startsWith(parent+sep));await rm(directory,{recursive:true,force:true});}
});
