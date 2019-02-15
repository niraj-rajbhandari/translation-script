import * as minimist from 'minimist';
import * as _ from 'lodash';
import { merge } from './merge';
import { difference } from './difference';
import * as fs from 'fs';

enum Commands {
 MERGE = 'merge',
 DIFF  = 'diff',
}

console.log(process.argv);

const options = minimist(process.argv.slice(2), {
  string: ['source', 'base', 'partial', 'command'],
  '--': true,
  alias: {
    h   : 'help',
    src : 'source',
    b   : 'base',
    p   : 'partial',
    c   : 'command',
    stopEarly: true,
  }
});

console.log(options);
//
// if (!validateArguments(options) || options.help === true) {
//   //TODO display help
// } else {
//   const baseJSON      = JSON.parse(fs.readFileSync(options.base).toString());
//   const changedJSON = JSON.parse(fs.readFileSync(options.source).toString());
//
//   console.log(options);
//
//   if(!options.command) {
//     options.command = Commands.MERGE;
//   }
//
//   switch (options.command) {
//     case Commands.DIFF:
//       //TODO calculate diff between two JSON
//       const diff = difference(baseJSON, changedJSON);
//       console.log(diff);
//       break;
//     default:
//       let merged = '';
//
//       if (options.partial) {
//         merged = merge(baseJSON, changedJSON, options.partial);
//       } else {
//         merged = merge(baseJSON, changedJSON);
//       }
//       console.log(merged);
//       break;
//   }
// }
//
// function validateArguments(args: any): boolean{
//   const requiredArgs = ['source', 'base'];
//   const providedArgs = _.keys(args);
//
//   return _.difference(requiredArgs, providedArgs).length === 0;
//
// }