const fs = require("fs");
const path = require("path");
const colors = require("colors");
colors.enable();

// function main
const deleteCommand = (com, database) => {

    const param = com[1].toLowerCase();
    const choise = com[2];
    const force = com[3];

    if(param == "tabela"){
        if(!database){
            console.log("[NÃO ACEIRO]: Selecione um banco de dados primeiro.".yellow);
            return;
        }
    }

    switch (param) {
        case "banco":
            // EXCLUIR UM BANDO DE DADOS
            // Verificar se tem tabelas dentro do banco
            // SE tiver tabelas peça permisão para excluir tudo
            // SENÂO apenas exclua o banco
            deleteDatabase(choise, force);
            break;
        case "tabela":
            // EXCLUIR UMA TABELA
            // Verificar se tem dados salvos
            // SE tiver dados, peça permissão
            // SENÂO apenas delete a tabela
            deleteTable(choise, database, force);
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

module.exports = deleteCommand;