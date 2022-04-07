let ticketContainer = document.querySelector(".tickets-container");
let colors = ["red","blue","green","yellow","black"];


function loadTickets(){
    let allTickets = localStorage.getItem("allTickets");
    if(allTickets){
        allTickets = JSON.parse(allTickets);
        for(let i =0; i<allTickets.length;i++){
            let ticketInfoObject = allTickets[i];
            appendTicket(ticketInfoObject);
        }
    }
}
loadTickets();

function saveTicketsToDb(ticketInfoObject){
    let allTickets = localStorage.getItem("allTickets");
    if(allTickets){
        //if already all tickets are present
        allTickets = JSON.parse(allTickets);
        allTickets.push(ticketInfoObject);
        localStorage.setItem("allTickets",JSON.stringify(allTickets));

    } else{
        let allTickets = [ticketInfoObject];
        localStorage.setItem("allTickets",JSON.stringify(allTickets));
    }
}


function appendTicket(ticketInfoObject){
    //create ticket div
    //append all other divs init
    //give values to those divs
    //append it to ticket container
    let {ticketHeaderFilter ,ticketValue, ticketId } = ticketInfoObject; //took from object, created in above func


    let mainTicketDiv = document.createElement("div");
    mainTicketDiv.classList.add("ticket");
    
    //ticket header m color attach kardiya
    //ticket-value m jo value object m store ki thi vo 
    mainTicketDiv.innerHTML = `<div class="ticket-header ${ticketHeaderFilter}"></div> 
    <div class="ticket-content">
        <div class="ticket-info">
            <div class="ticket-id">#${ticketId}</div>
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