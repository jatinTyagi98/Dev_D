//fs => file system 

const fs = require("fs");

//console.log(fs);

// utf-8 => Format for plain text

// one method to make data readable by using encoding

// let f1 = fs.readFileSync("./f1.txt","utf-8"); 

// second method to make data readable using empty string to stringfy the text

let f1 = fs.readFileSync("./f1.txt");

console.log(f1 + " ");




// to write or create a file 

fs.writeFileSync("index.html","hello world !!!");





