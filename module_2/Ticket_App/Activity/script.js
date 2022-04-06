// const { append } = require("domutils");

let allFilters = document.querySelectorAll(".filter");
let ticketContainer = document.querySelector(".tickets-container");

//adding open and close modal 
//fetching open and close modal divs
let openModal = document.querySelector(".open-modal");
let closeModal = document.querySelector(".close-modal");

//to ckeck if modal is already open or not
let isModalOpen = false;

//check if -> key pressed or not in modal
let isKeyPressed = false;

//for priority color changing
let colors = ["red","blue","green","yellow","black"];

//for Local Storage , first we have to check if any Obj named AllTickets exists or not
//if yes -> do nothing
//else -> make new object and store it in local storage
if(localStorage.getItem("AllTickets") == undefined){
    let allTickets = {};//new obj is created

    allTickets = JSON.stringify(allTickets); //converted to string to store in localStorage

    localStorage.setItem("AllTIckets", allTickets);//set in local storage; 
}

for(let i=0;i<allFilters.length;i++){
    allFilters[i].addEventListener("click", selectFilter);
}

function selectFilter(e){
    let selectedFilter = e.target.classList[1];
    // console.log(selectedFilter);
    if(ticketContainer.classList.length > 1){
        ticketContainer.classList.remove(ticketContainer.classList[1]);
    }
    ticketContainer.classList.add(selectedFilter);

}



//adding click events on both modals

openModal.addEventListener("click", opensModal);
closeModal.addEventListener("click", closesModal);

//functions to implement cb of event listners

function opensModal(e){
    //check if ticketMOdal is already open --> return
    console.log("clicked");
    if(isModalOpen){
        return;
    }
    //otherwise
    let ticketModal = document.createElement("div");
    ticketModal.classList.add("ticket-modal");

    //till here we've created <div class="ticket-modal"></div>
    
    
    //to append all other elements to it we can use innerHtml and pass it
    //backticks , it will go as a string to html


    ticketModal.innerHTML = `<div class="ticket-text" contenteditable="true" spellcheck="false">Enter Your Text !</div>
    <div class="ticket-filters">
        <div class="filters red selected-filter"></div>
        <div class="filters blue"></div>
        <div class="filters green"></div>
        <div class="filters yellow"></div>
        <div class="filters black"></div>
    </div>`;
    
    //appending it to the body
    document.querySelector("body").append(ticketModal);

    isModalOpen = true;
    isKeyPressed = false;

    //to remove default text
    let ticketTextDiv = ticketModal.querySelector(".ticket-text"); //ticketModal me div find krna hai isliye uske andar querySelector chalaya hai;
    ticketTextDiv.addEventListener("keypress", handleKeyPress);

    //to select filter in a modal 
    //select all the filters as an array
    //loop over them
    //add eventListener to each div
    let modalFilters = ticketModal.querySelectorAll(".filters");
    for(let i=0; i<modalFilters.length;i++){
        modalFilters[i].addEventListener("click", function(e){
            //check if selected filter already have "selected-filter" class
            //if true, do nothing
            if(e.target.classList.contains("selected-filter")){
                return;
            }

            //otherwise

            //vo element dhundu jiske pass "selected-filter" ki class hai 
            //or uski classList m se remove kardo "selected-filter" ko
            document.querySelector(".selected-filter").classList.remove("selected-filter");
            //or selected filter ki classList me add krdo "selected-filter" ko
            e.target.classList.add("selected-filter");
        });
    }
}

function closesModal(e){
    //check if modal is opened
    if(isModalOpen){
        // as it is open , so there must be a class as "ticket-modal" ,
        // we are just removing that class and everything attached to it wil be removed
        
        document.querySelector(".ticket-modal").remove();
        //again setting the modal as false , so that open function can work
        isModalOpen = false;
        isKeyPressed = false;
    }

}

//yha handle key press 2 functionality p kaam karega:
// 1. sabse phle jab modal first time open hoga to uska default text remove karne k liye
// 2. kuch content likhne k baad actual ticket banane k liye
function handleKeyPress(e){
    
    //agar "Enter" press hua && kuch text type hua hai && textContent empty nhi hai
    //to ye if condition chalegi
    if(e.key == "Enter" && isKeyPressed && e.target.textContent ){
        // "selected-filter"  class k sath jo element tha uski classList me se colour/filter pta kar liya
        //kyuki chi same filter ticket k header p lagega
        let selectFilter = document.querySelector(".selected-filter").classList[1];// suppose we get "red"
        
        //ab hame ticket banani hai or usko color and content chaiye 
        //to humne ek obj bnaya or usme dono chize store kardu
        let ticketInfoObject = {
            ticketHeaderFilter : selectFilter, // red -> color
            ticketValue : e.target.textContent // jo bhi content hoga us modal m
        };

        //appendTicket func ko call lgadi jisme ye obj pass kardiya ab ye ticket bnake de dega
        appendTicket(ticketInfoObject);

        //ek bar ye function ko call lagi , to hume modal close kar dena hai
        //closeModal humne nikala hua hai, click() func lga diya jisse vo band ho jayega
        closeModal.click();
    }

    //jab koi kuch content likhega , to check karga ki abhi tak koi key press nhi hui thi
    //to if m jake isKeyPressed ko true kardega -> ab key press ho gyi hai
    if(!isKeyPressed){
        isKeyPressed=true;
        e.target.textContent = ""; //default text ko hta dega
    }
    
}

function appendTicket(ticketInfoObject){
    //create ticket div
    //append all other divs init
    //give values to those divs
    //append it to ticket container
    let {ticketHeaderFilter , ticketValue} = ticketInfoObject; //took from object, created in above func
    let mainTicketDiv = document.createElement("div");
    mainTicketDiv.classList.add("ticket");
    let id = uid();
    //ticket header m color attach kardiya
    //ticket-value m jo value object m store ki thi vo 
    mainTicketDiv.innerHTML = `<div class="ticket-header ${ticketHeaderFilter}"></div> 
    <div class="ticket-content">
        <div class="ticket-info">
            <div class="ticket-id">#${id}</div>
            <div class="ticket-delete">
                <i class="fa-solid fa-trash-can"></i>
            </div>
        </div>
        <div class="ticket-value">${ticketValue}</div>
    </div>`;

    //ab hume ticket-header p click karke ek priority order m uska color change karna hai 
    // red > blue > green > yellow > black . or ye cyclic form m chalta rhega

    //ticket-header wala div fetch kiya
    let ticketHeader = mainTicketDiv.querySelector(".ticket-header");
    
    //uspe click listener lagaya
    //colors ka ek div humare pass already hai, top p
    // let colors = ["red","blue","green","yellow","black"];
    ticketHeader.addEventListener("click",function(e){
        //jab event trigger hua to uski classList se humne uss div ka current color nikal liya
       let currColor =  e.target.classList[1];
       
       //ek variable leliya
        let index = -1;
        //color k array p traverse kar liya
        for(let i=0;i<colors.length;i++){
            //check -> current color equal hai color array k kisi colour k
            if(colors[i] == currColor){
                //uss color ki index store kar li varible m
                index = i;
            }
        }
        //increment kar diya index ko kyuki uske ek aage wala color chaiye
        index++;
        //jab index 5 ho jayegi to vo click hone k baad vapis 0 i.e first color p chli jani chaiye
        index=index%5;
        //ticket-header ki current class ko remove kar denge
        ticketHeader.classList.remove(currColor);
        //or new color ko set kar denge jo usse ek agge hai color array m
        ticketHeader.classList.add(colors[index]);
    })

    //finally ticket-container m actual ticket ko attach kar denge
    // or ye last m attach isliye ki hai bcoz tab tak ticket p vo color change wala event attach ho jayega
    ticketContainer.append(mainTicketDiv);

    


}