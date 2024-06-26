const arraysIquals = (arr1, arr2) => {
    if(arr1.length !== arr2.length){
        return false;
    }
    arr1.sort();
    arr2.sort();
    for(let i = 0; i < arr1.length; i++){
        if(arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true;
};

const recombineArray = (array) => {
    let res = [];
    let buffer = "";
    array.forEach((item, index) => {
        if(item.includes("(")){
            buffer = item;
        } else if (item.includes(")")){
            buffer += " " + item;
            res.push(buffer);
            buffer = "";
        } else if (buffer){
            buffer += " " + item;
        } else {
            res.push(item);
        }
    });
    return res;
};

const conbineArray = (arr1, arr2) => {
    const res = [];
    for(let i = 0; i < arr1.length; i++){
        const separete = arr1[i].split(",");
        const objTable = {};
        for(let j = 0; j < separete.length; j++){
            const objHead = arr2[j];
            const objData = separete[j];
            objTable[objHead] = objData;
        }
        res.push(objTable);
    }
    return res;
};

const getAllKeys = (head, isSet = false) => {
    const arrayHead = head.split(",");
    const keys = [];
    for(let i = 0; i < arrayHead.length; i++){
        const headString = isSet ? arrayHead[i].split("=") : arrayHead[i].split(":");
        keys.push(headString[0]);
    }
    return keys;
    /* TODO: Preciso fazer com que todos os dados,
    fiquem relacionados com as chaves deles ex: [ { id: [<todos os seus valores>] } ] */
};

const binerySearch = (arr, search, key) => {
    let left = 0;
    let rigth = arr.length - 1;

    while(left <= rigth){
        const middle = Math.floor((left + rigth) / 2);
        const potencialMath = arr[middle];
        if(search == potencialMath[key]){
            return middle;
        } else if (search < potencialMath[key]){
            rigth = middle - 1;
        } else {
            left = middle + 1;
        }
    }
    return - 1;
};  

const { Console } = require('console');
const { Transform } = require('stream');

function tableWithoutIndex(input) { // Função para remover (index) da tabela
  const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
  const logger = new Console({ stdout: ts })
  logger.table(input)
  const table = (ts.read() || '').toString()
  let result = '';
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    result += `${r}\n`;
  }
  return result;
}

/*const arr = [
    { id: '1', nome: 'Anna', idade: '10' },
    { id: '2', nome: 'Marcos', idade: '15' },
    { id: '3', nome: 'Pedro', idade: '20' }
]
console.log(binerySearch(arr, "Anna", "nome"));*/

//conbineArray([ '1,Anna,10', '2,Marcos,15', '3,Pedro,20' ], ["id","nome","idade"]);
// console.log(arraysIquals(["nome","email"], ["email", "nome"])); -> TRUE

module.exports = {
    arraysIquals, 
    recombineArray, 
    conbineArray,
    getAllKeys,
    binerySearch,
    tableWithoutIndex
};