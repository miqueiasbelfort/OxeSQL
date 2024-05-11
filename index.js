const figlet = require("figlet");
const readline = require('node:readline');
const Commander = require("./commader");
const {Database} = require("./comands/use");

console.log(
    figlet.textSync("OxeSQL", {
      font: "Banner3-D",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
);
console.log("v0.0.1 - by Miqueias Belfort");

// readline configuration
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output, prompt: 'oxeSQL: '});
rl.prompt();

function main(){

    const database = new Database();

    rl.on("line", (input) => {
        
        const res = new Commander(input);
        
        if(res.closeCmd(rl)){
            return;
        }
        
        if(input.split(" ")[0].toLowerCase() == "usar"){
            database.setDatabase(input.split(" ")[1]);
            return;
        }
        
        if(database.getDatabase() !== null){
            rl.setPrompt(`${database.getDatabase()}: `);
        }
        rl.prompt();

        res.startDb(rl, database.getDatabase());
    });
}
main();