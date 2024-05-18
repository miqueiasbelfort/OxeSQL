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
}

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
}

// console.log(arraysIquals(["nome","email"], ["email", "nome"])); -> TRUE

module.exports = {arraysIquals, recombineArray};