const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");

let leaderboard = [];
let countOfRequestSent = 0;

function getMatchDetails(matchLink){

    console.log("Sending request", countOfRequestSent);
    countOfRequestSent++;

    request(matchLink, function(err,res,data){
        countOfRequestSent--;
        processData(data);
        console.log("calling back",countOfRequestSent);
        if(countOfRequestSent == 0){
            console.table(leaderboard);
        }
        
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
        // console.log(teamName);
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
                // console.log(teamName);

                // console.log(batsmanName + " " +runs+" "+balls+" "+fours+" "+sixes+" "+strikeRate );
                // processDetails(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
                processLeaderboard(teamName,batsmanName,runs,balls,fours,sixes);
            }
        }
     }
    //  console.log("######################################");


}


function processLeaderboard(teamName,batsmanName,runs,balls,fours,sixes){
    runs = Number(runs);
    balls = Number(balls);
    fours = Number(fours);
    sixes = Number(sixes);


    for(let i=0;i<leaderboard.length;i++){
        let batsmanObject = leaderboard[i];
        if(batsmanObject.Team == teamName && batsmanObject.Batsman == batsmanName){
            batsmanObject.Runs += runs;
            batsmanObject.Balls += balls;
            batsmanObject.Fours += fours;
            batsmanObject.Sixes += sixes;
            return;
        }
    }


    let batsmanObject = {
        Team : teamName,
        Batsman : batsmanName,
        Runs : runs,
        Balls : balls,
        Fours : fours,
        Sixes : sixes
    }

    leaderboard.push(batsmanObject);
}






module.exports = getMatchDetails;