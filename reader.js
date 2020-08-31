const { config, classes }= require("./config");
const { analysis } = require('./DataAnalysis');

var xlsx = require('node-xlsx').default;
var fs = require('fs');

console.log("Currency Rates in " + config.CURRENCY_DATE);
console.log("USD " + config.USD);
console.log("EUROS " + config.EURO);
console.log("POUNDS " + config.POUND);

let dataFromXLSX = [];

// Reading the files credoresAptosVotacaoAGC/[0-2].xlsx removing the lines that contains unnecessary information
for (let i = 0; i < 3; i++) {
  console.log("Reading " + `${__dirname}/credoresAptosVotacaoAGC/`+ i +`.xlsx` + " file.");
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

let dataFiltered = dataFromXLSX.map((x) => {
  let nome, classe, BRL, EUR, POUNDS, USD;
  let total = 0;

  classe = x[1];
  nome = x[2];
  cpf = x[3].slice(0, -1);

  if (x.includes("R$")) {
    let index = x.indexOf("R$");

    for (let i = 1; i < 4; i++) {
      if (x[index + i] !== undefined) {
        BRL = x[index + i];
        break;
      }
    }
  }

  if (x.includes("USD")) {
    let index = x.indexOf("USD");

    for (let i = 1; i < 5; i++) {
      if (x[index + i] !== undefined) {
        USD = x[index + i];
        break;
      }
    }
  }

  if (x.includes("€")) {
    let index = x.indexOf("€");

    for (let i = 1; i < 4; i++) {
      if (x[index + i] !== undefined) {
        EUR = x[index + i];
        break;
      }
    }
  }

  if (x.includes("£")) {
    let index = x.indexOf("£");

    for (let i = 1; i < 3; i++) {
      if (x[index + i] !== undefined) {
        POUNDS = x[index + i];
        break;
      }
    }
  }

  total += BRL === undefined ? 0 : BRL;
  total += USD === undefined ? 0 : USD * config["USD"];
  total += EUR === undefined ? 0 : EUR * config["EURO"];
  total += POUNDS === undefined ? 0 : POUNDS * config["POUND"];

  return [classe, cpf, nome, BRL, USD, EUR, POUNDS, total];
});



// CSV Header
let CSVHeader =  [["classe", "cpf", "nome", "reais", "usd", "euros", "libras", "total"]]
// Adding header to dataFiltered
let CSVData = CSVHeader.concat(dataFiltered);


console.log("Creating CSV file: " + config.filePath);

//Creating the csv file
var file = fs.createWriteStream(config.filePath, {flags: 'w' });

CSVData.forEach(element => {
  let str = '';
  for(let i=0;i < element.length; i++){
    str += element[i] === undefined ? '0' : element[i];;
    str += (i==element.length-1 ? '\n' : '\t')
  }
  file.write(str);
});

file.end();

console.log("CSV file has been created");
console.log("CSV separator = TAB")
console.log("CSV header = " + CSVHeader)

//Data Analysis
let results = analysis(dataFiltered);

  //Creating the csv file
  
  classes.forEach((k) => {
    file = fs.createWriteStream("datas/"+k+".csv" , { flags: "w" });

    CSVHeader.concat(results[k]["votingWeight"]).forEach((element) => {
      let str = "";
      for (let i = 0; i < element.length; i++) {
        str += element[i] === undefined ? "0" : element[i];
        str += i == element.length - 1 ? "\n" : "\t";
      }
      file.write(str);
    });

    file.end();
  });



// Creating the csv file
file = fs.createWriteStream(config.fileResults, {flags: 'w' });
file.write(JSON.stringify(results));
file.end();