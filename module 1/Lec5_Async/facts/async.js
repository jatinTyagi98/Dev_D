const fs = require("fs");

console.log("start");

fs.readFile("./f1.txt", getData);

function getData(err,data){
    console.log(data+"");
}

console.log("End");