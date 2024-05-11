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
            //createTable(name, args, database);
            break;
        case "--ajuda":
            console.log("\nMOSTRAR BANCOS - Mostra informações dos seus bancos;\nMOSTRAR TABELA [banco] - Informações das tabelas do banco [banco];\n".gray);
            break;
        default:
            console.log("Argumento não valido! Use o comando SHOW --AJUDA.\n")
    }
};

const showAllDatabases = () => {
    const databaseRepositories = path.join(__dirname, "..", 'databases');

    fs.readdir(databaseRepositories, { withFileTypes: true }, (err, files) => {

        if (err) {
            console.error('Erro ao tentar acessar o diretório:'.red, err);
            return;
        }

        // Filtrando apenas os diretórios
        const diretorios = files.filter(file => file.isDirectory()).map(dir => dir.name);

        // Mapeando cada diretório para o seu tamanho e data de criação
        diretorios.forEach(diretorio => {
            
            const diretorioPath = path.join(databaseRepositories, diretorio);
            
            fs.stat(diretorioPath, (err, stats) => {
                if (err) {
                    console.error(`Erro ao acessar informações do ${diretorio}\n`.red, err);
                    return;
                }
                const dbInformation = {banco: diretorio, tamanho: `${stats.size} bytes`, criado_em: stats.birthtime};
                console.log("");
                console.log(dbInformation);
            });

        });

    });
};

module.exports = show;
