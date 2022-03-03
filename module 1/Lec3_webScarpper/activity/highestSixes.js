let matchLink = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";

let request = require("request");

let fs = require("fs");

let cheerio = require("cheerio");

request(matchLink,cb);


function cb(error,response,data){
    getHighestSixes(data);
}

function getHighestSixes(data){
    let myDocument = cheerio.load(data);
    
    let highestSixes;
    let batsmanName;
    let strikeRate;

    let bothBatingTables = myDocument(".table.batsman");
    for(let i=0;i<bothBatingTables.length;i++){
        let battingTable = myDocument(bothBatingTables);

        let allTableRows = battingTable.find("tbody tr");

        // console.log(allTableRows);

        for(let j=0;j<allTableRows.length;j++){
            allTds = myDocument(allTableRows[j]).find("td");

            if(i==0 && j==0){
                batsmanName = myDocument(allTds[0]).find("a").text();   
                highestSixes = myDocument(allTds[6]).text();
                strikeRate = myDocument(allTds[7]).text();

            }
            else{
               let currentHighestSixes = myDocument(allTds[6]).text();
               let currentStrikeRate = myDocument(allTds[7]).text();

                if(currentHighestSixes > highestSixes || (currentHighestSixes == highestSixes && currentStrikeRate > strikeRate)){
                    batsmanName = myDocument(allTds[0]).find("a").text();
                    highestSixes = currentHighestSixes;
                    strikeRate  =  currentStrikeRate;

                }
            }
        }
    }
    console.log(batsmanName);
    console.log(highestSixes);
    console.log(strikeRate);
}