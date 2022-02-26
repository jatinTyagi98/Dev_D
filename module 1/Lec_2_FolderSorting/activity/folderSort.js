const fs = require("fs");

let extensionsMapping = require("./util.js");
// console.log(extensionsMapping);

let testFolderPath = "./Downloads";


//read all the files on a particular path

let allFiles = fs.readdirSync(testFolderPath);

for(let i=0;i<allFiles.length;i++){
    sortFile(allFiles[i]);
}

//get the extension of a file by spliting on the basis of dot(.) and then take the 1st index element

function getExtension(file){
   let extension = file.split("."); //["abc","doc"]
    return extension[1]; //for eg: return doc
}

//to check if a folder exist for a particular extnsn , if not then make one.

function checkExtensionFolder(extension){
    let extensionFolderName = testFolderPath; // ./Downloads
    for(let key in extensionsMapping){
        extensions = extensionsMapping[key]; //for document key => [ 'doc', 'pdf', 'txt' ]

        if(extensions.includes(extension)){ //check if extensions have 'doc' 
            extensionFolderName = extensionFolderName+"/"+key; // update it to /Downloads/document
            break;
        }
    }

    let isFolderExist =  fs.existsSync(extensionFolderName); //check if same name folder exists , to prevent duplicate folder creation
    if(!isFolderExist){ // if not
        fs.mkdirSync(extensionFolderName); // make one 
    }
    return extensionFolderName; 

}

function moveFile(file,extensionFolderName){
    //copy file from source to destination location
    let sourceFile = testFolderPath + "/" + file;
    let destFile =  extensionFolderName + "/" + file;

    fs.copyFileSync(sourceFile,destFile);

    //delete the files from destination
    fs.unlinkSync(sourceFile);
}

function sortFile(file){
    let extension = getExtension(file);

    let extensionFolderName = checkExtensionFolder(extension);
    // console.log(extensionFolderName);
    moveFile(file,extensionFolderName);
}