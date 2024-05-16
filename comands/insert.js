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
        console.log(`INSERIR EM <nome_da_tabela> (todas_as_chaves) VALORES (valores_completos)`.yellow)
        return;
    };

    switch (param) {
        case "em":
            insertIntoTable(tableName, keys, values, database);
            break;
        case "--ajuda":
            console.log("\nCRIAR BANCO [nome] - Criar um novo banco de dados;\nCRIAR TABELA [nome] (<chave>:tipo-tipo) - Criar uma tabela no banco;\n".gray);
            break;
        default:
            console.log("Argumento não valido! Use o comando CRIAR --AJUDA.\n")
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

// ESCREVER DADOS
const insertData = (values, tablePath) => {
    
    let data = values.replace(/[()]/g, '');

    const tableContent = fs.readFileSync(tablePath, 'utf8');

    const lines = tableContent.split('\n');
    const firstLine = lines[0];

    const listOfKyes = formatedKeysTable(firstLine);

    let chave; // TODO: Modificar para que possa passar quantas chaves quiser
    for(let i = 0; i < listOfKyes.length; i++){
        if(listOfKyes[i].isChave){
            chave = listOfKyes[i].key;
        }
    }
    const dataCount = lines.length;

    const allLines = tableContent.split("\n");
    const lastLine = allLines[allLines.length - 1];
    
    if(lastLine.trim() !== ""){ // Verificando se a ultima linha esta vazia
        fs.appendFileSync(tablePath, "\n"); // Adicionando uma linha não estiver vazia
    }
    const firstKey = Number(values.split(",")[0].replace(/[()]/g, ''));
    console.log(firstKey);

    if(chave && firstKey !== Number){ // TODO: Verificar se não esta passando ID
        // TODO: Remover o número do começo quando for adicionar
        data = dataCount + "," + data; // TODO: Adicionar o número no lugar certo.
    }
        
    fs.appendFileSync(tablePath, data);
    console.log(`Adados adicionados a tabela`);
}

const insertIntoTable = (tableName, keys, values, database) => {
    const tablePath = path.join(__dirname, "..", "databases", database, `${tableName}.csv`);
    // Verificando se o arquivo existe
    if(!fs.existsSync(tablePath)){
        console.log(`Não existe tabela com o nome "${tableName}" no banco de dados "${database}".\n`.yellow);
        return;
    }
    checkKeysTable(keys, tablePath);
    insertData(values, tablePath);
};

module.exports = insert;