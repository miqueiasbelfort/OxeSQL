const fs = require("fs");
const path = require("path");

class Database {
    constructor(){
        this.database = null;
    }
    setDatabase(name){
        
        if(!name){
            console.log("\nBanco de dados não passado!\n");
            return;
        }
        
        const databasePath = path.join(__dirname, "..", 'databases', name);
        if (!fs.existsSync(databasePath)) {
            console.log(`\nO banco dados ${name} não existe!\n`.yellow);
            return;
        }

        this.database = name;
        console.log(`\nUsando banco: ${name}\n`.green);
    }
    getDatabase(){
        return this.database;
    }
}
module.exports = {Database};