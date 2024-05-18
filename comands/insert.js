const fs = require("fs");
const path = require("path");
const colors = require("colors");
const {arraysIquals, recombineArray} = require("../algorithms");

colors.enable();

// function main
const insert = (com, database) => {

    const param = com[1].toLowerCase();
    const tableName = com[2];
    const keys = com[3];
    const declareValues = com[4];
    const values = recombineArray(com)[3];

    if(declareValues.toLowerCase() != "valores" ?? !declareValues){
        console.log(`[ALERTA]: INSERIR EM <nome_da_tabela> (todas_as_chaves) VALORES (valores_completos)`.yellow)
        return;
    };

    switch (param) {
        case "em":
            insertIntoTable(tableName, keys, values, database);
            break;
        case "--ajuda":
            console.log("\nCRIAR BANCO [nome] - Criar um novo banco de dados;\nCRIAR TABELA [nome] (<chave>:tipo-tipo) - Criar uma tabela no banco;".gray);
            break;
        default:
            console.log("[ALERTA]: Argumento não valido! Use o comando CRIAR --AJUDA.".yellow)
    };
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
            console.error('[ERRO]: erro ao ler o arquivo:'.red, err);
            return;
        }
        // Separando as linhas do arquivo
        const lines = data.split('\n');
        const firstLine = lines[0];

        const keysToInsert = formatedKeys(keys);
        const tableKeys = getAllKeysNotChave(formatedKeysTable(firstLine));
        
        if(!arraysIquals(keysToInsert, tableKeys)){
            console.log(`[ALERTA]: Não passe nos valores tipo "chave", ex: (${tableKeys}).`.yellow);
            return;
        }    
    });
};

// ESCREVER DADOS
// Vai pegar as posições e a contagem para saber onde adicionar as chaves
const getKeysPossitions = (line, lines, data) => {
    const listOfKyes = formatedKeysTable(line);
    const dataArray = data.split(',')

    const keysPossitions = [];
    for(let i = 0; i < listOfKyes.length; i++){ // Pegar a posição das chaves
        if(listOfKyes[i].isChave){
            keysPossitions.push(i);
            dataArray.splice(i, 0, "0"); // Adicionar 0 nas posições das chaves
        }
    }
    const dataCount = lines.length;

    return {dataCount, keysPossitions, dataArray};
};
const insertData = (values, tablePath, tableName) => {
    
    let data = values.replace(/[()]/g, '');
    let isChaveInValues = false;

    const tableContent = fs.readFileSync(tablePath, 'utf8');

    const lines = tableContent.split('\n');
    const firstLine = lines[0];

    const {dataCount, keysPossitions, dataArray} = getKeysPossitions(firstLine, lines, data);

    const allLines = tableContent.split("\n");
    const lastLine = allLines[allLines.length - 1];
    
    if(lastLine.trim() !== ""){ // Verificando se a ultima linha esta vazia
        fs.appendFileSync(tablePath, "\n"); // Adicionando uma linha não estiver vazia
    };

    // Trocar as posições dos valores passados pela contagem de linhas
    keysPossitions.forEach((possition) => {
        if(possition < dataArray.length){
            dataArray[possition] = dataCount;
        }
        if(Number(data[possition])){
            // console.log("data[possition]: ", Number(data[possition]))
            isChaveInValues = true;
            return;
        }
    });

    if(isChaveInValues){
        console.log(`[NÂO ACEITO]: Não passe os valores chaves, ex: (id,nome) = (nome)`.yellow);
        return;
    }
       
    data = dataArray.join(",");
    fs.appendFileSync(tablePath, data);
    console.log(`[SUCESSO]: Dados adicionados a tabela ${tableName}`.green);
};
const insertIntoTable = (tableName, keys, values, database) => {
    const tablePath = path.join(__dirname, "..", "databases", database, `${tableName}.csv`);
    // Verificando se o arquivo existe
    if(!fs.existsSync(tablePath)){
        console.log(`[NÂO ACEITO]: Não existe tabela com o nome "${tableName}" no banco de dados "${database}".`.yellow);
        return;
    }
    checkKeysTable(keys, tablePath);

    insertData(values, tablePath, tableName);
};

module.exports = insert;