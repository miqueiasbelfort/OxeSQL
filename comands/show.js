const fs = require("fs");
const path = require("path");
const colors = require("colors");

colors.enable();

// function main
const show = (com, database) => {

    // SHOW BANCOS;
    // SHOW TABELAS;

    const param = com[1].toLowerCase();
    const name = com[2];
    const args = com.slice(3);

    switch (param) {
        case "bancos":
            showAllDatabases();
            break;
        case "tabelas":
            //createTable(name, args, database);
            break;
        case "--ajuda":
            break;
        default:
            console.log("Argumento não valido! Use o comando SHOW --AJUDA.\n")
    }
};

const showAllDatabases = () => {
    const databaseRepositories = path.join(__dirname, "..", 'databases');
    fs.readdir(databaseRepositories, {withFileTypes: true}, (err, files) => {
        if (err) {
            console.error('Erro ao tentar acessar o diretório:'.red, err);
            return;
        }
        // Filtrando apenas os diretórios
        const diretorios = files.filter(file => file.isDirectory()).map(dir => dir.name);
        console.log('todos os bancos dados: ', diretorios);
    });
};

module.exports = show;
