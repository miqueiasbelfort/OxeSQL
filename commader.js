const readline = require('node:readline');
const colors = require("colors");
colors.enable();

const creater = require("./comands/create");
const show = require("./comands/show");
const insert = require("./comands/insert");
const deleteCommand = require("./comands/delete");
const select = require('./comands/select');
const update = require('./comands/update');

class Commander {
    constructor(input){
        this.command = input.split(/\s+/);
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
                insert(this.command, db);
                break;
            case "deletar":
                deleteCommand(this.command, db);
                break;
            case "selecionar":
                select(this.command, db);
                break;
            case "atualizar":
                update(this.command, db);
                break;
            case "limpar":
                readline.cursorTo(process.stdout, 0, 0);
                readline.clearScreenDown(process.stdout);
                break;
            case "mostrar":
                show(this.command);
                break;
            default:
                console.log("[ALERTA]: USE COMMAND --AJUDA".yellow);
        }
    }

}

module.exports = Commander;
