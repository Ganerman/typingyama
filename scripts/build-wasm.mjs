import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { URL } from 'node:url';
import wabtFactory from 'wabt';

const wabt = await wabtFactory();
const source = await readFile(new URL('../cpp/typing_engine.wat', import.meta.url), 'utf8');
const module = wabt.parseWat('typing_engine.wat', source);
module.resolveNames();
module.validate();

const { buffer } = module.toBinary({ canonicalize_lebs: true, write_debug_names: true });
await mkdir(new URL('../public', import.meta.url), { recursive: true });
await writeFile(new URL('../public/typing-engine.wasm', import.meta.url), Buffer.from(buffer));
module.destroy();

process.stdout.write('Built public/typing-engine.wasm\n');
