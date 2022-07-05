// the purpose of this project is to extract information of worldcup 2019 from cricinfo and present
// that in the form of excel and pdf scorecards

// node cricinfo_1.js --excel=Worldcup.csv --dataFolder=data --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results 

let minimist = require("minimist");
let axios = require("axios");
let jsdom = require("jsdom");
let excel4node = require("excel4node");
let pdf = require("pdf-lib");

let args = minimist(process.argv);

// donwload using axios
// read using jsdom
// make excel using excel4node
// make pdf using pdf-lib

let responsepromise = axios.get(args.source);

responsepromise.then(function(response){
    let html = response.data;

    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;

    let matches = [];
    let matchScoreDivs = document.querySelectorAll("div.ds-border-b div.ds-px-4");             //block
    for(let i = 0; i < matchScoreDivs.length; i++){
        let match = {
        };

        let namePs = matchScoreDivs[i].querySelectorAll("p.ds-text-tight-m");                   //name
        match.t1 = namePs[0].textContent;
        match.t2 = namePs[1].textContent;

        let scoreSpans = matchScoreDivs[i].querySelectorAll("div.ds-text-compact-s strong");    //score
        if(scoreSpans.length == 2){
            match.t1s = scoreSpans[0].textContent;
            match.t2s = scoreSpans[1].textContent;
        } else if(scoreSpans.length == 1){
            match.t1s = scoreSpans[0].textContent;
            match.t2s = "";
        } else {
            match.t1s = "";
            match.t2s = "";
        }

        let spanResult = matchScoreDivs[i].querySelector("p.ds-text-tight-s");                   //result
        match.result = spanResult.textContent;

        // console.log(match);
        matches.push(match);
    }

    console.log(matches);
}).catch(function(err){
    console.log(err);
})
