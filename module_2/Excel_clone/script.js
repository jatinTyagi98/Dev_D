
let rowNumberSection = document.querySelector(".row-number-section");
let columnNumberSection = document.querySelector(".column-number-section");

let lastCellSelected;

let formulaBarSelectedCell = document.querySelector(".selected-cell-div");
let cellSectionDiv = document.querySelector(".cell-section");

let formulaBar = document.querySelector(".formula-input");

let dataObj = {};


formulaBar.addEventListener("keypress",function(e){
    if(e.key == "Enter"){
        
        let typedFormula = e.target.value;
        console.log(typedFormula);

        if(!lastCellSelected) return;

        let currCell = lastCellSelected.getAttribute("cell-address");
        // console.log(currCell);

        let currCellObj = dataObj[currCell];
        currCellObj.formula = typedFormula;

        let upstream = currCellObj.upstream;

        for(let i=0;i<upstream.length;i++){
            removeFromDownstream(upstream[i], currCell);
        }

        currCellObj.upstream = [];
        
       let formulaArr = typedFormula.split(" ");
        
       let cellsInFormula = [];

       for(let j=0;j<formulaArr.length;j++){
           if(formulaArr[j] != "+" &&
              formulaArr[j] != "-" &&
              formulaArr[j] != "*" &&
              formulaArr[j] != "/" &&
              isNaN(formulaArr[j])
           ){
               
               cellsInFormula.push(formulaArr[j]);

           }
       }    


       for(let i=0;i<cellsInFormula.length;i++){
           addToDownstream(cellsInFormula[i],currCell);
       }
       currCellObj.upstream = cellsInFormula;

       let valueObj = {};

       for(let k=0;k<cellsInFormula.length;k++){
           let cellValue = dataObj[cellsInFormula[k]].value;
           valueObj[cellsInFormula[k]] = cellValue;
       }

       for(let key in valueObj){
           typedFormula = typedFormula.replace(key,valueObj[key]);
       }


       let newValue = eval(typedFormula);

       lastCellSelected.innerText = newValue;

       currCellObj.value = newValue;

       let downstream = currCellObj.downstream;

       for(let i=0;i<downstream.length;i++){
           updateCell(downstream[i]);
       }

       dataObj[currCell] = currCellObj;


    }
})



cellSectionDiv.addEventListener("scroll",function(e){

    rowNumberSection.style.transform = `translateY(-${e.target.scrollTop}px)`;

    columnNumberSection.style.transform = `translateX(-${e.target.scrollLeft}px)`;
})



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

 //we have to make cols from A -> Z
 //so loop is from 0 to 26
for(let j=0;j<26;j++){
    //65 is ascii for A , usme j add hota rhega
    //for eg: 65 + 1 = 66
    let ascii = 65 + j;
    //js function is used for to convert ascii code to alphabet
    //for 66 , alphabet will be B
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


//WE have to make a matrix of [100 x 26] 
//[A1,B1 ... Z1]
//.
//.
//[A100,B100 ... Z100] -> in the form of cells
//this loop make the 100 rows
for(let i=1;i<=100;i++){
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    //this loop make 26(A to Z) cells
    for(let j=0;j<26;j++){

        let ascii = 65 + j;

        let requireAlphabet = String.fromCharCode(ascii);
        //we will store a cell address 
        //requireAlphabet = A , i = 1 
        //cellAddress -> A1
        let cellAddress = requireAlphabet + i;

        dataObj[cellAddress] = {
            value: undefined,
            formula : undefined,
            upstream : [],
            downstream: []
        }


        //this will be the div for cells
        let cellDiv = document.createElement("div");

        cellDiv.addEventListener("input", function(e){
            let currCellAddress = e.target.getAttribute("cell-address");
            let currCellObj = dataObj[currCellAddress];
            
            currCellObj.value = e.target.innerText;
            // console.log(currCellObj);

            currCellObj.formula = undefined;

            //1- loop on current cell's upstream
            //2- for each cell , go to its downstream and remove yourself
            //3- apni upstream ko empty array krdo
            //suppose current cell is C1 and was depending upon A1 nad B1
            let currCellUpstream = currCellObj.upstream; //[A1,B1]
            for(let k=0;k<currCellUpstream.length;k++){
                //removeFromDownstream(parentCell,childCell);  pCell = A1 , childCell = C1 and nect iteratn m B1 as pCell jayega
                removeFromDownstream(currCellUpstream[k],currCellAddress);
            }
            currCellObj.upstream = [];

            let currCellDownStream = currCellObj.downstream;
            for(let k=0;k<currCellDownStream.length;k++){
                updateCell(currCellDownStream[k]);
            }

             dataObj[currCellAddress] = currCellObj ;



        })


        cellDiv.setAttribute("contentEditable",true);   
        cellDiv.classList.add("cell");

        //setting an attribute as cellAddress
        cellDiv.setAttribute("cell-address", cellAddress);

        cellDiv.addEventListener("click",function(e){
            if(lastCellSelected){
                lastCellSelected.classList.remove("cell-selected");
                
            }
                e.target.classList.add("cell-selected");
                
                lastCellSelected = e.target; 

                let currCellAddress = e.target.getAttribute("cell-address");
                
                formulaBarSelectedCell.innerHTML = currCellAddress;

        })

        //appending all 26 cells in row
        rowDiv.append(cellDiv);


    }
    //appending them in the cell-section
    cellSectionDiv.append(rowDiv);
}

function removeFromDownstream(parentCell,childCell){
    let parentCellObj = dataObj[parentCell].downstream; //[C1,sath m or koi bhi cell address ho skta hai iske alawa]

    let filteredParentCellObj = [];

    for(let i=0;i<parentCellObj.length;i++){ 
        if(parentCellObj[i] != childCell){
            filteredParentCellObj.push(parentCellObj[i]);
        }
    }

    parentCellObj = filteredParentCellObj;
    dataObj[parentCell].downstream = parentCellObj;
}


function updateCell(cell){
    let cellObj = dataObj[cell];
    let cellUpStream = cellObj.upstream;
    let cellFormula = cellObj.formula;

    // {
    //     A1:20,
    //     B1:10
    // }
    let valueObj = {};

    for(let i=0;i<cellUpStream.length;i++){
        let valueOfCurrCell = dataObj[cellUpStream[i]].value;
        valueObj[cellUpStream[i]] = valueOfCurrCell;
    }
    //formula -> A1 + 2*B1 (initial)
    //formula -> 20 + 2*10 (final)

    for(let key in valueObj){
        cellFormula = cellFormula.replace(key,valueObj[key]);
    }

    let newValue = eval(cellFormula);

    let cellOnUI = document.querySelector(`[cell-address=${cell}]`);
    cellOnUI.innerText = newValue;

    dataObj[cell].value = newValue;

    let cellDownStream = cellObj.downstream;

    for(let j=0;j<cellDownStream;j++){
        updateCell(cellDownStream[j]);
    }

}

function addToDownstream(parent,child){
    dataObj[parent].downstream.push(child); 
}