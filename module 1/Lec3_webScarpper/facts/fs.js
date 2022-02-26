const fs = require("fs");

const cheerio = require("cheerio");

let htmlkadata = fs.readFileSync("./index.html","utf8");
// console.log(htmlkadata);

//html file is loaded in cheerio
let myDocument = cheerio.load(htmlkadata);

// document.querySelector('h1');

// console.log(myDocument);
h1kadata = myDocument("h1").text();
console.log(h1kadata);