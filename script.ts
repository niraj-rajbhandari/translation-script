import * as SimpleGit from 'simple-git/promise';
import { resolve } from 'path';
import { merge } from 'lodash';
import { diff } from 'json-diff';



const repo = resolve(__dirname);
const git  = SimpleGit(repo);



getChangedContent().then((test)=>console.log(JSON.stringify(test)));

async function status() {
  try {
    return await git.diff([ 'script.ts' ]);//.raw(['diff', 'script.ts']);
  } catch (e) {
    throw e;
  }
}


async function diff(comparingBranch: string, baseBranch: string = 'development') {
  let diff = null;
  try {
    diff = await git.diff([ '-U1000', '--no-prefix', 'test.json' ]);
  } catch (e) {
    throw e;
  }
  return diff;
}

async function getChangedContent() {
  const diffContent = await diff('development');


  let master = {};
  let isOpeningBrace: boolean = false;
  let isKeySet: boolean = false;
  const keys: string[] = [];

  diffContent.split('\n')
             .filter(line => !line.startsWith('diff --git') && !line.startsWith('---') &&
               !line.startsWith('+++') && !line.startsWith('index ') &&
               !line.startsWith('@@')
             ).forEach(line=>{
                 const splitLine = line.split('\"\:');
                 if(!isOpeningBrace){
                   isOpeningBrace = line.endsWith('{');
                 }

                 if(splitLine.length > 1){
                     if(isOpeningBrace) {
                       const key = getKey(splitLine[0]);
                       keys.push(key);
                       isKeySet = true;
                       isOpeningBrace = false;
                     }

                     if(line.startsWith('+')){
                       if(!isKeySet) {
                         const key = getKey(splitLine[0]);
                         keys.push(key);
                         isKeySet = true;
                       }

                       let newChanges = {}, temp = {};
                       const originalKeyLength = keys.length;
                       for(let i = originalKeyLength - 1; i >= 0; i--){
                         const key =keys[i];
                         if(i === originalKeyLength-1){
                           newChanges[key] = getValue(splitLine[1]);
                           keys.pop(); // remove the tracked key if its value is added.
                         } else {
                           temp[key] = newChanges;
                           newChanges = temp;
                           temp = {};
                         }
                       }
                       master = merge(master, newChanges);
                     }
                 }

                 if(line.replace(',','').trim().endsWith('}')){
                  keys.pop();
                 }
                 isKeySet = false;
             });
  return master;
}

function getValue(line: string) {
  return line.trim()
             .replace(createEndsWithRegex(','),'')
             .replace(/^\"/,'')
             .replace(createEndsWithRegex('\"'),'')
}

function getKey(line: string){
  return line.replace(/^\+/,'')
             .trim()
             .replace(/^\"/,'');
}

function createEndsWithRegex(endsWithCharacter: string) {
  return new RegExp(`${ endsWithCharacter }([^${ endsWithCharacter }]*)$`);
}

const test = {
-  'HEADER'   : { 'STATEMENT': { 'OVERDU': 'Overdue balance {{ amount }}' } },
+   'HEADER'
+  'TERMINAL' : { 'PAYMENT_SUCCESS_EMAI_CONFIRMATION': 'Confirmation emails have been sent to you and your client (<strong class=\'payment-email\'>{{ email }}</strong>).' },
  'MAIN'     : { 'LOADER_TEXT_TEXT': 'Loading invoice...' },
  'STATEMENT': {
    'BULK_PAYMEN_UNSUPPORTED': 'Bulk payment is currently not supported for this statement. Please view each invoice separately.',
    'DOCUMENT_SUMMARY'       : {
      'GO_TO': {
        'INVOICE_TEST': 'Go to invoice',
        'CREDIT_MEMO_MEMO': 'Go to credit memo'
      }
      },
  },
HEADER = null,
};