const fs = require("fs");
const path = require("path");
const colors = require("colors");
const { conbineArray, binerySearch } = require("../algorithms");
colors.enable();

// function main
const deleteCommand = (com, database) => {

    const param = com[1].toLowerCase();
    const choise = com[2];
    const force = com[3];
    const search = com.slice(4).join("").replace(/[()]/g, '');

    if(param == "tabela" ?? param == "de"){
        if(!database){
            console.log("[NÃO ACEIRO]: Selecione um banco de dados primeiro.".yellow);
            return;
        }
    }

    switch (param) {
        case "banco":
            deleteDatabase(choise, force);
            break;
        case "tabela":
            deleteTable(choise, database, force);
            break;
        case "de": // DELETAR DE <nome> ONDE (id = 1)
            // VAI DELETAR DADOS DA TABELA
            // E colocar em branco no lugar
            deleteDataFromTable(choise, search, database);
            break;
        case "--ajuda":
            console.log("\nCRIAR BANCO [nome] - Criar um novo banco de dados;\nCRIAR TABELA [nome] (<chave>:tipo-tipo) - Criar uma tabela no banco;".gray);
            break;
        default:
            console.log("[ALERTA]: Argumento não valido! Use o comando DELETAR --AJUDA.".yellow)
    };
};

const deleteDatabase = (name, force) => {
    const dbPath = path.join(__dirname, "..", "databases", name);
    fs.readdir(dbPath, {withFileTypes: true}, (err, entries) => {
        if(err){
            console.log("[ERRO]: Houve um erro ao tentar apagar banco.".red, err);
            return;
        }
        
        let pending = entries.length;
        if(pending == 0 && force == "-F"){
            fs.rmdir(dbPath);
            console.log("[SUCESSO]: Banco deletado.");
            return;
        }

        if(force !== "-F"){
            console.log("[INF COMANDO]: Para excluir use DELETAR TABELA <nome> -F".cyan);
            return;
        }

        entries.forEach(entry => {
            const filePath = path.join(dbPath, entry.name);
            fs.unlink(filePath, err => {
                if(err){
                    console.log("[ERRO]: Não foi possivel excluir as tabelas.".red, err);
                    return;
                }
                if(!--pending){
                    fs.rmdir(dbPath, err => {
                        if(err){
                            console.log("[ERRO]: Erro ao tentar apagar o banco.".red, err);
                            return;
                        }
                    });
                }
            });
        });

        console.log(`[SUCESSO]: O banco de dados ${name} foi deletado.`.green);
    });
    
};

const deleteTable = (tableName, db, isForce) => {
    
    const tablePath = path.join(__dirname, "..", "databases", db, `${tableName}.csv`);
    
    if(!fs.existsSync(tablePath)){
        console.log(`[NÂO ACEITO]: Não existe tabela com o nome "${tableName}" no banco de dados "${db}".`.yellow);
        return;
    };

    const tableContent = fs.readFileSync(tablePath, 'utf8');

    const lines = tableContent.split('\n');
    const secondLine = lines[1];

    if(isForce ?? !secondLine){
        fs.unlink(tablePath, (err) => {
            if(err){
                console.log("[ERRO]: Houve um erro ao tentar apagar a tabela.".red, err);
                return;
            }
            console.log(`[SUCESSO]: A tabela ${tableName} foi deletada.`.green);
        });
        return;
    };

    console.log("[INF COMANDO]: Para excluir use DELETAR TABELA <nome> -F".cyan);
};

const getAllKeys = (head) => {
    const arrayHead = head.split(",");
    const keys = [];
    for(let i = 0; i < arrayHead.length; i++){
        const headString = arrayHead[i].split(":");
        keys.push(headString[0]);
    }
    return keys;
    /* TODO: Preciso fazer com que todos os dados,
    fiquem relacionados com as chaves deles ex: [ { id: [<todos os seus valores>] } ] */
};
const replaceValueInTable = (tablePath, searchValue, callback) => {
    fs.readFile(tablePath, 'utf8', (err, data) => {
        
        if(err) callback(err);

        const modifiedData = data.replace(new RegExp(searchValue, 'g'), "  ");

        fs.writeFile(tablePath, modifiedData, 'utf8', err => {
            if (err) callback(err);
            callback(null, "[SUCESSO]: Dados apagados da tabela.".green);
        })
    });
};
const deleteDataFromTable = (tableName, search, db) => {
    const tablePath = path.join(__dirname, "..", "databases", db, `${tableName}.csv`);
    
    if(!fs.existsSync(tablePath)){
        console.log(`[NÂO ACEITO]: Não existe tabela com o nome "${tableName}" no banco de dados "${db}".`.yellow);
        return;
    };

    const tableContent = fs.readFileSync(tablePath, 'utf8');

    const lines = tableContent.split('\n');
    const firstLine = lines[0];
    const allData = lines.slice(1); // Todas os dados - o cabeçalho

    const head = getAllKeys(firstLine); // Todas as chaves do cabeçalho
    const table = conbineArray(allData, head);

    const searchValue = search.split("=")[1];
    const searchKey = search.split("=")[0];
    
    const lineOfData = binerySearch(table, searchValue, searchKey);

    if(lineOfData == -1){
        console.log(`[NÂO ACEITO]: Não foi encontado ${searchKey} com o valor de ${searchValue} na tabela.`.yellow);
        return;
    }

    const data = lines[lineOfData + 1];
    
    replaceValueInTable(tablePath, data, (err, msg) => {
        if(err){
            console.log("[ERRO]: Erro ao deletar dados da tabela.".red, err);
        } else {
            console.log(msg);
        }
    });
};

module.exports = deleteCommand;