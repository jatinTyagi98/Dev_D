let matchLink = "https://www.espncricinfo.com/series/icc-women-s-cricket-world-cup-warm-up-matches-2021-22-1302821/bangladesh-women-vs-pakistan-women-warm-up-1302829/full-scorecard";

const request = require("request");
const fs = require("fs");
const cheerio  = require("cheerio");

request(matchLink, cb);

function cb(error, response, data){
    // console.log(data);
    // fs.writeFileSync("./match.html", data);

    getHighestWicketTaker(data);
}

function getHighestWicketTaker(data){

    let myDocument = cheerio.load(data);
    let bothBowlingtables = myDocument(".table.bowler");
    // console.log(bothBowlingtables);
    let highestWicketTakerName;
    let highestWicketsTaken;
    let economyOfHWT;

    for(let i=0;i<bothBowlingtables.length;i++){
        let bowlingTable = myDocument(bothBowlingtables);
        // console.log("bowling table",bowlingTable);
        let allTableRows = bowlingTable.find("tbody tr");
        
        for(let j=0;j<allTableRows.length;j++){
            allTds = myDocument(allTableRows[j]).find("td");

            if(j==0 && i==0){
                highestWicketTakerName = myDocument(allTds[0]).find("a").text();
                highestWicketsTaken = myDocument(allTds[4]).text();
                economyOfHWT = myDocument(allTds[5]).text();

            }else{
                let currentWickets = myDocument(allTds[4]).text();
                let currentEconomy = myDocument(allTds[5]).text();

                if(currentWickets > highestWicketsTaken || (currentWickets == highestWicketsTaken && currentEconomy < economyOfHWT)){
                    highestWicketTakerName = myDocument(allTds[0]).find("a").text();
                    highestWicketsTaken = currentWickets;
                    economyOfHWT = currentEconomy;
                }

            }
        }
        
    }
    console.log("Highest Wicket Taker = ", highestWicketTakerName);
    console.log("Highest wickets Taken =", highestWicketsTaken)
    console.log("Economy = ", economyOfHWT);



}