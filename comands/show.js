const fs = require("fs");
const path = require("path");
const colors = require("colors");

colors.enable();

// function main
const show = (com) => {

    const param = com[1].toLowerCase();
    const database = com[2];

    switch (param) {
        case "bancos":
            showAllDatabases();
            break;
        case "tabelas":
            showAllTablesInDatabase(database);
            break;
        case "--ajuda":
            console.log("MOSTRAR BANCOS - Mostra informações dos seus bancos;\nMOSTRAR TABELA [banco] - Informações das tabelas do banco [banco];".gray);
            break;
        default:
            console.log("Argumento não valido! Use o comando SHOW --AJUDA.")
    }
};

const showAllDatabases = () => {
    const databaseRepositories = path.join(__dirname, "..", 'databases');

    fs.readdir(databaseRepositories, { withFileTypes: true }, (err, files) => {

        if (err) {
            console.error('[ERRO]: Erro ao tentar acessar o diretório:'.red, err);
            return;
        }

        // Filtrando apenas os diretórios
        const diretorios = files.filter(file => file.isDirectory()).map(dir => dir.name);

        // Mapeando cada diretório para o seu tamanho e data de criação
        diretorios.forEach(diretorio => {
            
            const diretorioPath = path.join(databaseRepositories, diretorio);
            
            fs.stat(diretorioPath, (err, stats) => {
                if (err) {
                    console.error(`[ERRO]: Erro ao acessar informações do ${diretorio}`.red, err);
                    return;
                }
                const dbInformation = {banco: diretorio, tamanho: `${stats.size} bytes`, criado_em: stats.birthtime};
                console.log("");
                console.log(dbInformation);
            });

        });

    });
};

const formatedLine = (line) => {
    const argsArray = line.split(",");
    let tableKeys = {};
    for(let i = 0; i < argsArray.length; i++){

        const keys = argsArray[i].split(":")[0];

        const typesString = argsArray[i].split(":")[1];
        const typesArray = typesString.split("-");

        tableKeys[keys] = {tipo: typesArray.join(" ")};
    }
    return tableKeys;
};

const showAllTablesInDatabase = (db) => {
    const databaseRepositorie = path.join(__dirname, "..", 'databases', db);
     
    fs.readdir(databaseRepositorie, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('[ERRO]: Erro ao tentar acessar o diretório:'.red, err);
            return;
        }
        // Filtrando apenas os arquivos
        const tableFiles = files.filter(file => file.isFile()).map(dir => dir.name)

        for(let i = 0; i < tableFiles.length; i++){
            const tablePath = path.join(__dirname, "..", 'databases', db, tableFiles[i]);
            fs.readFile(tablePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('[ERRO]: Erro ao ler o arquivo:'.red, err);
                    return;
                }

                // Separando as linhas do arquivo
                const lines = data.split('\n');
                const firstLine = lines[0];
             
                const tableKeys = formatedLine(firstLine);
                const obj = {tabela: tableFiles[i].split(".")[0], chaves: tableKeys}
                console.log("");
                console.log(obj);
            });
        }
     });
};

module.exports = show;
