const fs = require("fs");
const path = require("path");
const colors = require("colors");
const {arraysIquals} = require("../algorithms");

colors.enable();

// function main
const insert = (com, database) => {

    const param = com[1].toLowerCase();
    const tableName = com[2];
    const keys = com[3];
    const declareValues = com[4];
    const values = com[5];

    if(declareValues.toLowerCase() != "valores" ?? !declareValues){
        console.log(`Você quiz dizer: INSERIR EM ${tableName} ${keys} VALORES ${values}`.yellow)
        return;
    }

    switch (param) {
        case "em":
            insertIntoTable(tableName, keys, values, database);
            break;
        case "tabela":
            //createTable(name, args, database);
            break;
        case "--ajuda":
            console.log("\nCRIAR BANCO [nome] - Criar um novo banco de dados;\nCRIAR TABELA [nome] (<chave>:tipo-tipo) - Criar uma tabela no banco;\n".gray);
            break;
        default:
            console.log("Argumento não valido! Use o comando CRIAR --AJUDA.\n")
    }
};

// FORMATAÇÂO DAS CHAVES
const formatedKeysTable = (keys) => {
    const keysValues = keys.split(",");
    const res = [];
    for(let i = 0; i < keysValues.length; i++){
        
        const key = keysValues[i].split(":")[0]; //[id]
        const typesString = keysValues[i].split(":")[1]; // ["inteiro-chave"]
        const typesArray = typesString.split("-"); // ["inteiro", "chave"]

        const obj = {key, isChave: typesArray.includes("chave")};
        res.push(obj);
    }
    return res;
};
const formatedKeys = (keys) => {
    const keysWithoutParenteces = keys.replace(/[()]/g, '');
    return keysWithoutParenteces.split(",");
};
const getAllKeysNotChave = (keys) => {
    const res = [];
    for(let i = 0; i < keys.length; i++){
        if(!keys[i].isChave){
            res.push(keys[i].key);
        }
    }
    return res;
};
const checkKeysTable = (keys, tablePath) => {
    
    fs.readFile(tablePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:'.red, err);
            return;
        }
        // Separando as linhas do arquivo
        const lines = data.split('\n');
        const firstLine = lines[0];

        const keysToInsert = formatedKeys(keys);
        const tableKeys = getAllKeysNotChave(formatedKeysTable(firstLine));
        
        if(!arraysIquals(keysToInsert, tableKeys)){
            console.log(`As chaves (${keysToInsert}) são diferente de (${tableKeys}) da tabela.\n`.yellow);
            return;
        }
    });

};

const insertIntoTable = (tableName, keys, values, database) => {
    const tablePath = path.join(__dirname, "..", "databases", database, `${tableName}.csv`);
    
    // Verificando se o arquivo existe
    if(!fs.existsSync(tablePath)){
        console.log(`Não existe tabela com o nome "${tableName}" no banco de dados "${database}".\n`.yellow);
        return;
    }
    
    checkKeysTable(keys, tableName, tablePath);
};

module.exports = insert;