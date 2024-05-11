const readline = require('node:readline');
const creater = require("./comands/create");
const show = require("./comands/show");

class Commander {
    constructor(input){
        this.command = input.split(" ");
    }

    // Close database
    closeCmd(rl){
        if(this.command[0].toLowerCase() == "sair"){
            rl.close();
            return true;
        }
        return false;
    }

    // Start check commander database
    startDb(rl, db){

        switch(this.command[0].toLowerCase()){
            case "criar":
                creater(this.command, db);
                break;
            case "inserir":
                console.log("INSERT SOMETHING");
                break;
            case "deletar":
                console.log("DELETE SOMETHING");
                break;
            case "selecionar":
                console.log("SELECT SOMETHING");
                break;
            case "limpar":
                readline.cursorTo(process.stdout, 0, 0);
                readline.clearScreenDown(process.stdout);
                break;
            case "mostrar":
                show(this.command, db);
                break;
            default:
                console.log("USE COMMAND --AJUDA");
        }
    }

}

module.exports = Commander;
