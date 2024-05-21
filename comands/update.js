const fs = require("fs");
const path = require("path");
const colors = require("colors");
const {conbineArray, getAllKeys, binerySearch} = require("../algorithms");

colors.enable();

// function main
const update = (com, database) => { // ATUALIZAR <tabela> POR (id:10,nome:Carlos) ONDE (id=1)

    const tableName = com[1];
    const param = com[2];
    const data = com[3];
    const search = com[5];

    if(!database){
        console.log("[NÃO ACEIRO]: Selecione um banco de dados primeiro.".yellow);
        return;
    }

    switch (param) {
        case "por":
            updateTable(tableName,data,search,database);
            break;
        case "--ajuda":
            console.log("\nCRIAR BANCO [nome] - Criar um novo banco de dados;\nCRIAR TABELA [nome] (<chave>:tipo-tipo) - Criar uma tabela no banco;\n".gray);
            break;
        default:
            console.log("[ALERTA]: Argumento não valido! Use o comando SELECIONAR --AJUDA.")
    }
};

const verifyHeadTable = (headCommand, headLine) => {
    const headLineCommand = getAllKeys(headCommand, true);
    for(let i = 0; i < headLineCommand.length; i++){
        const keysCommand = headLineCommand[i];
        if(!headLine.includes(keysCommand)){
            console.log(`[NÂO ACEITO]: O valor "${keysCommand}" não é uma chave pertencete a tabela`.yellow);
            return -1;
        }
    }
    return 1;
}; 
const replaceValueInTable = (tablePath, searchValue, updatedDate, callback) => {
    fs.readFile(tablePath, 'utf8', (err, data) => {
        
        if(err) callback(err);

        const modifiedData = data.replace(new RegExp(searchValue, 'g'), updatedDate);

        fs.writeFile(tablePath, modifiedData, 'utf8', err => {
            if (err) callback(err);
            callback(null, "[SUCESSO]: Dados atualizados".green);
        })
    });
};

const updateTable = (tableName, data, search, db) => {

    const dataValues = data.replace(/[()]/g, '');
    const searchItem = search.replace(/[()]/g, '').split("=");
    const tablePath = path.join(__dirname, "..", "databases", db, `${tableName}.csv`);

    if(!fs.existsSync(tablePath)){
        console.log(`[NÂO ACEITO]: Não existe tabela com o nome "${tableName}" no banco de dados "${db}".`.yellow);
        return;
    };

    const tableContent = fs.readFileSync(tablePath, 'utf8');

    const lines = tableContent.split('\n');
    const headLine = lines[0];
    const allData = lines.slice(1);

    const head = getAllKeys(headLine); // Todas as chaves do cabeçalho
    const table = conbineArray(allData, head);

    if(verifyHeadTable(dataValues, headLine) == -1){
        return;
    }

    const searchValue = searchItem[1];
    const searchKey = searchItem[0];
    const indexOfValue = binerySearch(table, searchValue, searchKey);
    
    const updates = dataValues.split(',').reduce((acc, pair) => {
        const [key, value] = pair.split('=').map(s => s.trim());
        acc[key] = value;
        return acc;
    }, {});

    const objectToUpdate = table[indexOfValue];
    for (const [key, value] of Object.entries(updates)) {
        objectToUpdate[key] = isNaN(value) ? value : Number(value);
    };

    const updatedItemInCSV = Object.values(objectToUpdate).join(",");
    const lineInFile = lines[indexOfValue + 1];
    
    replaceValueInTable(tablePath, lineInFile, updatedItemInCSV, (err, msg) => {
        if(err){
            console.log("[ERRO]: Erro ao tentar atualizar tabela.".red, err);
        } else {
            console.log(msg);
        }
    });
};

module.exports = update;