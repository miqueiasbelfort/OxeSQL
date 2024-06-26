const fs = require("fs");
const path = require("path");
const colors = require("colors");

colors.enable();

// function main
const create = (com, database) => {

    const param = com[1].toLowerCase();
    const name = com[2];
    const args = com.slice(3);

    switch (param) {
        case "banco":
            createDatabase(name);
            break;
        case "tabela":
            createTable(name, args, database);
            break;
        case "--ajuda":
            console.log("\nCRIAR BANCO <nome> - Criar um novo banco de dados;\nCRIAR TABELA <nome> (<chave>:tipo-tipo) - Criar uma tabela no banco;\n".gray);
            break;
        default:
            console.log("[ALERTA]: Argumento não valido! Use o comando CRIAR --AJUDA.")
    }
};

const createDatabase = (name) => {
    const repositoriPath = path.join(__dirname, "..", 'databases', name);

    // Verificando se o banco de dados já existe
    if (!fs.existsSync(repositoriPath)) {
        fs.mkdirSync(repositoriPath, { recursive: true });
        console.log(`[SUCESSO]: Novo banco de dados criado: ${name}`.green);
    } else {
        console.log(`[NÃO ACEITO]: O banco dados ${name} já existe`.yellow);
    }
    
};

const checkTypeArgs = (args) => {
    const argsArray = args.split(",");

    const allKeys = ["inteiro", "chave", "texto", "logico", "flutuante", "nao_vazio"];
    let commanderKeys = [];
    
    for(let i = 0; i < argsArray.length; i++){
        const keys = argsArray[i].split(":")[1];
        const key = keys.split("-");
        commanderKeys.push(...key);
    }
    // Verifica se a chave passada no argumento é diferente das que podem ser passadas
    for(let i = 0; i < commanderKeys.length; i++){
        const comandKey = commanderKeys[i];
        if(!allKeys.includes(comandKey)){
            console.log(`[NÂO ACEITO]: Chave ${comandKey} invalida!`.yellow);
            return true;
        }
    }
    return false;
};

const createTable = (name, args, database) => {

    // Verificar se selecionou um banco de dados
    if (!database) {
        console.log("[NÂO ACEITO]: Selecione um banco de dados primeiro.".yellow);
        return;
    }

    // Retirando os parenteces () e trocando os ; por ,
    const formatedArgs = args.join("").replace(/[()]/g, '').replace(/;/g, ',');

    // Caminho do arquivo e do banco de dados
    const tablePath = path.join(__dirname, "..", "databases", database, `${name}.csv`);
    const databasePath = path.join(__dirname, "..", "databases", database);

    // Verificando de esse banco de dados existe
    if (!fs.existsSync(databasePath)) {
        console.log(`[NÃO ACEITO]: O banco dados ${name} não existe!`.yellow);
        return;
    }

    // Verificando se o arquivo existe
    if(fs.existsSync(tablePath)){
        console.log(`[NÂO ACEITO]: Já existe uma tabela com o nome ${name}.`.yellow);
        return;
    }

    // Verificando se a tipagem dos argumentos chaves, estão validos
    if(checkTypeArgs(formatedArgs) == true){
        return;
    }

    // Criando a tabele (arquivo.csv)
    fs.writeFile(tablePath, formatedArgs, (err) => {
        if (err) {
            console.error('[ERRO]: Erro ao criar tabela:'.red, err);
            return;
        }
        console.log(`[SUCESSO]: Tabela criado com sucesso! no banco de dados ${database}.`.green);
    });

};

module.exports = create;