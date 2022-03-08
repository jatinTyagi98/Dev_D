const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");

function getMatchDetails(matchLink){


    request(matchLink, function(err,res,data){
        processData(data);
    })
    
} 




function processData(html){
    let myDocument = cheerio.load(html);

    let bothDivs = myDocument(".card.content-block.match-scorecard-table .Collapsible ");

    // console.log("bothDivs are",bothDivs);

    for(let i=0;i<bothDivs.length;i++){
        let oneIning = myDocument(bothDivs[i]);
        let teamName = oneIning.find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        console.log(teamName);
        let allTrs = oneIning.find(".table.batsman tbody tr");
        for(let j=0;j<allTrs.length-1;j++){
            let allTds = myDocument(allTrs[j]).find("td");
            if(allTds.length > 1){
                let batsmanName = myDocument(allTds[0]).text().trim();

                let runs = myDocument(allTds[2]).text().trim();

                let balls = myDocument(allTds[3]).text().trim();

                let fours = myDocument(allTds[5]).text().trim();

                let sixes = myDocument(allTds[6]).text().trim();

                let strikeRate = myDocument(allTds[7]).text().trim();

                // console.log(batsmanName + " " +runs+" "+balls+" "+fours+" "+sixes+" "+strikeRate );
                processDetails(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
            }
        }
     }
     console.log("######################################");


}

function checkTeamFolder(teamName){
    let teamFolderPath = `./IPL/${teamName}`;
    return fs.existsSync(teamFolderPath);
}

function checkBatsmanFile(teamName,batsmanName){
    let batsmanFilePath = `./IPL/${teamName}/${batsmanName}.json`;
    return fs.existsSync(batsmanFilePath);
}

function updateBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let batsmanFilePath = `./IPL/${teamName}/${batsmanName}.json`;
    let batsmanFile = JSON.parse(fs.readFileSync(batsmanFilePath));
    let innings = {
        Runs: runs,
        Balls: balls,
        Fours: fours,
        Sixes: sixes,
        StrikeRate: strikeRate
    }
    batsmanFile.push(innings);
    fs.writeFileSync(batsmanFilePath, JSON.stringify(batsmanFile));
}

function createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let batsmanFilePath = `./IPL/${teamName}/${batsmanName}.json`;
    let batsmanFile = [];
    let innings = {
        Runs: runs,
        Balls: balls,
        Fours: fours,
        Sixes: sixes,
        StrikeRate: strikeRate
    }
    batsmanFile.push(innings);
    fs.writeFileSync(batsmanFilePath, JSON.stringify(batsmanFile));
}

function createTeamFolder(teamName){
    let teamFolderPath = `./IPL/${teamName}`;
    fs.mkdirSync(teamFolderPath)
}



function processDetails(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let isTeamFolder = checkTeamFolder(teamName);
    if(isTeamFolder){
        let isBatsmanPresent = checkBatsmanFile(teamName,batsmanName);
        if(isBatsmanPresent){
            updateBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
        }else{
            createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
        }
    }
    else{
        createTeamFolder(teamName);
        createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
    }
}


module.exports = getMatchDetails;