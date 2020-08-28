const {classes} = require("./config")

module.exports.analysis = (data) => {

    console.log("Analysing data...")
    
    let result = {};

    for(let i=0; i < classes.length; i++){
        result[classes[i]] = {};

        let classArray = data.filter(x => x[0] === classes[i]);
        let count = classArray.length;
        let totalCredits = classArray.map(x => x[7]).reduce((a,b) => a+b);

        result[classes[i]]["count"] = count;        
        result[classes[i]]["totalCreditos"] = totalCredits;
        
        let pesoVotacaoClasse = classArray.map (x => {
            let nome = x[2];
            let cpf = x[1];
            let peso = (x[7]/totalCredits)*100;

            return [nome, cpf, peso];
        });

        result[classes[i]]["votingWeight"] = pesoVotacaoClasse.sort((a,b) => b[2] - a[2]);
        
    }
    
    return result;
    // console.log(classesCount);
}