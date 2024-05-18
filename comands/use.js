const fs = require("fs");
const path = require("path");

class Database {
    constructor(){
        this.database = null;
    }
    setDatabase(name){
        
        if(!name){
            console.log("[NÂO ACEITO]: Banco de dados não passado!".yellow);
            return;
        }
        
        const databasePath = path.join(__dirname, "..", 'databases', name);
        if (!fs.existsSync(databasePath)) {
            console.log(`[NÂO ACEITO]: O banco dados ${name} não existe!`.yellow);
            return;
        }

        this.database = name;
        console.log(`[SUCESSO]: Usando banco: ${name}`.green);
    }
    getDatabase(){
        return this.database;
    }
}
module.exports = {Database};