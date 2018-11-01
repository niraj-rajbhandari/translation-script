import * as Git from 'nodegit';
import * as path from 'path';


Git.Repository.open(path.resolve(__dirname, '.git'))
   .then((repo) => {
     console.log("test");
     console.log(repo);
     return repo.getStatus();

   })
   .then((status)=>{
     console.log("status");
     console.log(status);
   })
   .catch((err)=>{console.log(err)});

