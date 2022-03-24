const request = require("request");
const cheerio = require("cheerio");
const getMatchDetails = require("./match");

function getAllMatches(allMatchesLink){

    request(allMatchesLink, function(err,res,data){
        processData(data);
    })
}

function processData(html){
   let myDocument = cheerio.load(html);
    let allATags = myDocument('a[class="match-info-link-FIXTURES"]');
    // console.log(allATags.length);
    for(let i=0;i<allATags.length;i+=4){
        let matchLinks = "https://www.espncricinfo.com" + myDocument(allATags[i]).attr("href");
        getMatchDetails(matchLinks)
    }

}

module.exports = getAllMatches;