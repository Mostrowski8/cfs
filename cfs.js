const fs = require('fs-extra');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '--start to copy or --help for info > \n'
});

rl.prompt();

function readsource() {
    return new Promise((resolve, reject) => {
        fs.readFile("default.txt", "utf8", (err, data) => {
            if (err) {
                console.log(err);
                reject(error);
            }
            if (data) {
                console.log("default source: ", data);
                resolve(data);
            }
        })
    })
};

function newdefault(src) {
        fs.writeFile("default.txt", src, "utf8", (err) => {
            if (err) console.log(err);
        }); 
};

function querries(data) {
    rl.question('Retain default source path? y/n ', (aZero) => {
        if (aZero === "y") {
            copyStuff(path.normalize(data));
        } else {
            rl.question('Please provide new source path > ', (aOne) => {
                rl.question('Set this as new default? y/n> ', (aThree) => {
                    if (aThree === "y") {
                        copyStuff(path.normalize(aOne));
                        newdefault(aOne)
                    } else {
                        copyStuff(path.normalize(aOne));
                    }

                })
            })
        }
    })
};

function getOptions () {
    return new Promise((resolve, reject)=>{
        fs.readFile("options.json", "utf8", (err, data)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(data);
                let json = JSON.parse(data);
                let filters = json.filters;
                let retuned = {filter: function (path) {
                    let check = filters.map((filter)=>path.indexOf(filter) === -1);
                    if (check.indexOf(false) === -1) return true 
                }}
                resolve(retuned)
            }
        })
    })  
};

function copyStuff(givenPath) {
    rl.question('Enter new project path > ', (aOne) => {
        rl.question('Enter new project name > ', async (aTwo) => {
            let directory = path.parse(path.normalize(aOne));
            let filename = path.normalize(aTwo);
            let fulldir = path.normalize(path.join(path.format(directory), filename));
            let options = await getOptions();
            fs.copy(givenPath, fulldir, options, function (err) {
                if (err) {
                    console.error(err);
                    rl.prompt();
                    cfs()
                } else {
                    console.log("success!\n\n");
                    rl.prompt();
                    cfs()
                }
            });
            
        })
    });
};

function cfs() {
    rl.on('line', async (line)=>{
        switch (line.trim()) {
            case '--start':
                let data = await readsource();
                querries(data);
            break;
            case '--help':
                console.log ("\n\n\****\n\n\--start to begin copying\n\n\set filters in options.json file\n\n\default path is stored in default.txt\n\n****\n\n");
            break;
            default:
                console.log ('Unrecognized input')
            break;
        }
        rl.prompt();
    }).on('close', ()=> {
        console.log('Good bye!');
        process.exit(0);
    })
};

cfs();