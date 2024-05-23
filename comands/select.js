const fs = require("fs");
const path = require("path");
const colors = require("colors");
const {conbineArray, getAllKeys, tableWithoutIndex} = require("../algorithms");

colors.enable();

// function main
const select = (com, database) => {

    const checkHelp = com[1]?.toLowerCase() == "--ajuda" ? 1 : 2;
    const param = com[checkHelp].toLowerCase();
    const name = com[3];

    if(!database && param !== "--ajuda"){
        console.log("[NÃO ACEIRO]: Selecione um banco de dados primeiro.".yellow);
        return;
    }

    switch (param) {
        case "de":
            selectFrom(com, database, name);
            break;
        case "--ajuda":
            console.log("SELECIONAR (*) DE <tabela>".gray);
            break;
        default:
            console.log("[ALERTA]: Argumento não valido! Use o comando SELECIONAR --AJUDA.")
    }
};

const verifyHeadTable = (headCommand, headLine) => {
    const headLineCommand = getAllKeys(headCommand);
    for(let i = 0; i < headLineCommand.length; i++){
        const keysCommand = headLineCommand[i];
        if(!headLine.includes(keysCommand)){
            console.log(`[NÂO ACEITO]: O valor "${keysCommand}" não é uma chave pertencete a tabela`.yellow);
            return -1;
        }
    }
    return 1;
}; 

const filterFields = (data, fields) => {
    return data.map(item => {
      return fields.reduce((obj, key) => {
        if (key in item) {
          obj[key] = item[key];
        }
        return obj;
      }, {});
    });
};

const selectFrom = (com, db, tableName) => {

    const findHead = com[1].replace(/[()]/g, ''); 
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

    if(findHead === "*"){
        console.log("");
        console.table(tableWithoutIndex(table));
        return;
    };

    if(verifyHeadTable(findHead, head) == -1){
        return;
    }

    const formatedTable = filterFields(table, findHead.split(","));
    console.log("");
    console.log(tableWithoutIndex(formatedTable));
};

module.exports = select;