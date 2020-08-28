const { config, classes }= require("./config");

var xlsx = require('node-xlsx').default;
var fs = require('fs');

console.log("Currency Rates in " + config.CURRENCY_DATE);
console.log("USD " + config.USD);
console.log("EUROS " + config.EURO);
console.log("POUNDS " + config.POUND);

let dataFromXLSX = [];

// Reading the files credoresAptosVotacaoAGC/[0-2].xlsx removing the lines that contains unnecessary information
for (let i = 0; i < 3; i++) {
  let workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/credoresAptosVotacaoAGC/`+ i +`.xlsx`));

  workSheetsFromBuffer = workSheetsFromBuffer[0].data.filter((x) => {
    if (typeof x[1] === "string") {
      if (x[1].includes("Classe"))
        return false;
    }
    return true;
  })

  dataFromXLSX = dataFromXLSX.concat(workSheetsFromBuffer);
}

console.log("Number of lines: " + dataFromXLSX.length);

let dataFiltered = dataFromXLSX.map( x=> {
  let nome, classe, reais, euros, libras, usd;

  classe = x[1];
  nome = x[2];
  cpf = x[3].slice(0, -1)


let total = 0;

  if(x.includes("R$")){
    let index = x.indexOf("R$");
    
    for(let i=1; i < 4; i++){
      if(x[index+i] !== undefined){
        reais = x[index+i];
        break;
      }
    }
  }

  if(x.includes("USD")){
    let index = x.indexOf("USD");
    
    for(let i=1; i < 5; i++){
      if(x[index+i] !== undefined){
        usd = x[index+i];
        break;
      }
    }
  
  }

  if(x.includes("€")){
    let index = x.indexOf("€");
    
    for(let i=1; i < 4; i++){
      if(x[index+i] !== undefined){
        euros = x[index+i];
        break;
      }
    }
  }

  if(x.includes("£")){
    let index = x.indexOf("£");
    
    for(let i=1; i < 3; i++){
      if(x[index+i] !== undefined){
        libras = x[index+i];
        break;
      }
    }
  }

  total += reais === undefined ? 0 : reais;
  total += usd === undefined ? 0 : (usd * config["USD"]);
  total += euros === undefined ? 0 : (euros * config["EURO"]);
  total += libras === undefined ? 0 : (libras * config["POUND"]);

  return [classe, cpf, nome, reais, usd, euros, libras, total];
});

let data = [["classe", "cpf", "nome", "reais", "usd", "euros", "libras", "total"]].concat(dataFiltered);

var logger2 = fs.createWriteStream('datas/relacao-credores-votantes.csv', {flags: 'w' });

data.forEach(element => {
    let str = '';
    for(let i=0;i < element.length; i++){
      let el = element[i] === undefined ? '0' : element[i];
        str+= (el);
        str += (i==element.length-1? '\n' : '\t')
    }
    logger2.write(str);
});

logger2.end();