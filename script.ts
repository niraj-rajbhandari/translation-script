import * as Git from 'nodegit';
import * as SimpleGit from 'simple-git/promise';
import * as path from 'path';

const repo = path.resolve(__dirname);
const git  = SimpleGit(repo);

// Git.Repository.open(path.resolve(__dirname, '.git'))
//    .then((repo) => {
//      console.log("test");
//      console.log(repo);
//      return repo.getStatus();
//
//    })
//    .then((status)=>{
//      console.log("status");
//      console.log(status);
//    })
//    .catch((err)=>{console.log(err)});


diff('development')
  .then(test => console.log(test)).catch(e=>console.log(e));

async function status() {
  let statusSummary = null;

  try {
    statusSummary = await git.diff([ 'script.ts' ]);//.raw(['diff', 'script.ts']);
  } catch (e) {
    throw e;
  }

  return statusSummary;
}


async function diff(comparingBranch: string, baseBranch: string = 'master') {
  let diff = null;
  try {
    diff = await git.diff([ baseBranch, comparingBranch, 'script.ts' ]);
  } catch (e) {
    throw e;
  }

  return diff;
}