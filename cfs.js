const fs = require('fs-extra');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function readsource (){
    return new Promise ((resolve, reject) => {
        fs.readFile("default.txt", "utf8", (err, data)=>{
            if (err) {
            console.log(err);
            reject(error);
            }
            if (data) {
            console.log("default source: ", data);  
            resolve(data);   
        }})
    }) 
};

async function cfs () {
   let data = await readsource();
    querries(data)
}

function querries (data){rl.question('Retain default source path? y/n ', (aZero)=>{
    if (aZero==="y") {
        copyStuff(path.normalize(data));
    } else {
        rl.question('Please provide new source path > ', (aOne) => {
            copyStuff(path.normalize(aOne));
    })}
})};

let options = {
    filter: function (path) {
        return path.indexOf('.txt') === -1
    }
} 

function copyStuff(givenPath){
    rl.question('Enter project path > ', (aOne) => {
        rl.question('Enter project name > ', (aTwo) => {
            let directory = path.parse(path.normalize(aOne));
            let filename = path.normalize(aTwo);
            let fulldir = path.normalize(path.join(path.format(directory), filename));
            fs.copy(givenPath, fulldir, options, function (err) {
                if (err) {
                  console.error(err);
                } else {
                  console.log("success!");
                }
              });

            rl.close();
        }) 
    });   
}

cfs();