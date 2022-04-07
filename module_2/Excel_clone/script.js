let rowNumberSection = document.querySelector(".row-number-section");
//for row section div starting from 1 to 100
for(let i=1;i<=100;i++){
    //every time a div will be created
    let div = document.createElement("div");
    //i will be the in the div for eg -> 1,2,3
    div.textContent = i;
    //added a class on every div for styling
    div.classList.add("row-number");
    //appended in the parent div
    rowNumberSection.append(div);
}

let columnNumberSection = document.querySelector(".column-number-section");
 //we have to make cols from A -> Z
 //so loop is from 0 to 26
for(let j=0;j<26;j++){
    //65 is ascii for A , usme j add hota rhega
    //for eg: 65 + 1 = 66
    let ascii = 65 + j;
    //js function is used for to convert ascii code to alphabet
    //for 66 , aplhabet will be B
    let requireAlphabet = String.fromCharCode(ascii);
    //creating div everytime till loop works
    let div = document.createElement("div");
    //div's content will be the alphabets
    div.textContent = requireAlphabet ;
    //adding classList for styling
    div.classList.add("column-tag");

    //appending in the parent div
    columnNumberSection.append(div);
}