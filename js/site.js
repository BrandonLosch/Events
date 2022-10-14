// Initial dataset for MMOEvents. 
//It is an array of objects.
const events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "WizardCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "PAXEast",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "PAXWest",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "PAXWest",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "DragonCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "DragonCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "DragonCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

//builds a list of specific cities. entry point for the app
function buildDropDown(){
    let eventDD = document.getElementById("eventDropDown");
    eventDD.innerHTML="";

    //grab the template from template tag
    let template=document.getElementById("cityDD-template")

    let currentEvents= getEventData();

    //filer our array by distinct cities
    let citiesOnly=currentEvents.map((event)=>event.city);

    //distinct set 
    // [...net set] is making a new array (citiesOnly) is specifying what goes into that set
    let distinctEvents=[...new Set(citiesOnly)];

    // JS made <ul class="dropdown-menu"></ul>
    let ddul=document.createElement("ul");
    ddul.classList.add("dropdown-menu");

    //add the all item
    let ddlItemNodeAll=document.importNode(template.content,true);
    let cityName='All';

    //this returns <a class="dropdown-item" onclick="getEvents()" data-string="All" >All</a>
    let ddItemAll= ddlItemNodeAll.querySelector("a");
    ddItemAll.textContent=cityName;
    ddItemAll.setAttribute("data-string", cityName);

    //add the item to the ul
    ddul.appendChild(ddlItemNodeAll);

    for (let index = 0; index < distinctEvents.length; index++) {

        //this gets the <li><a></a></li> from the template
        let ddlItemNode=document.importNode(template.content,true);
        let cityName=distinctEvents[index];

        //this returns <a class="dropdown-item" onclick="getEvents()" data-string="new York" >New York</a>
        let ddItem= ddlItemNode.querySelector("a");
        ddItem.textContent=cityName;
        ddItem.setAttribute("data-string", cityName);

        //add the item to the ul
        ddul.appendChild(ddlItemNode);
    }

    eventDD.appendChild(ddul);

    //display the stats for all events
    displayStats(currentEvents);
    
    //load the data in the grid
    displayEventData();
}


function getEvents(element){
    let city=element.getAttribute("data-string");

    let currentEvents = getEventData();

    let statsHeader=document.getElementById("statsHeader");
    statsHeader.innerHTML=`Stats For ${city} Events`;

    //display stats for aLl or selected city
    let filteredEvents=currentEvents;

    if (city !='All'){

        //filter the array by cityname
        filteredEvents=currentEvents.filter(function (item){
            if (item.city == city){
                return item;
            }
        });
    }

    //call a function with a list of events
    displayStats(filteredEvents);
}

function displayStats(events){
    let total=0;
    let average=0;
    let most=0;
    let least= -1;

    total = totalAttendance(events);
    document.getElementById("total").innerHTML=total.toLocaleString();

    average = averageAttendance(events,total);
    document.getElementById("average").innerHTML=average.toLocaleString(
        "en-US",{ minimumFractionDigits:0, maximumFractionDigits:0}
    );

    most = mostAttendance(events);
    document.getElementById("most").innerHTML=most.toLocaleString();

    least= leastAttendance(events);
    document.getElementById("least").innerHTML=least.toLocaleString();
    
}

function totalAttendance(events){
    let totalAttendance=0;
    for (let index = 0; index <events.length; index++) {
        totalAttendance += events[index].attendance;
    }

    return totalAttendance;
}

function averageAttendance(events,totalAttendance){
    let averageAttendance=0;
    averageAttendance = totalAttendance/events.length;
    
    return averageAttendance;
}

function mostAttendance(events){
    let mostAttendance=0;
    mostAttendance=Math.max(...events.map(item=>item.attendance));

    return mostAttendance;
}

function leastAttendance(events){
    let leastAttendance=0;
    leastAttendance=Math.min(...events.map(item=>item.attendance));

    return leastAttendance;
}

//retreive data from local storage.
function getEventData(){
  let currentEvents = JSON.parse(localStorage.getItem("eventData"));

  if(currentEvents==null){
    currentEvents=events;
    localStorage.setItem("eventData", JSON.stringify(currentEvents));
  }

  return currentEvents;
}

//displays the event data on bottom of the page in a grid
function displayEventData(){

  //get the template
  const template=document.getElementById("eventData-template");

  //get the location of that template & where it will be written
  const eventBody=document.getElementById("eventBody");

  eventBody.innerHTML="";

  //access local storage for data
  let currentEvents=getEventData();

  for (let index = 0; index < currentEvents.length; index++) {
    const eventRow=document.importNode(template.content, true);

    const eventCols=eventRow.querySelectorAll("td");
    eventCols[0].textContent=currentEvents[index].event;
    eventCols[1].textContent=currentEvents[index].city;
    eventCols[2].textContent=currentEvents[index].state;
    eventCols[3].textContent=currentEvents[index].attendance;

    //need to format the date for the page 
    let eventDate=new Date(currentEvents[index].date).toLocaleDateString();
    eventCols[4].textContent=eventDate;

    eventBody.appendChild(eventRow);
    
  }

}


//saves a new event to the local storage from modal
function saveEventData(){
  let currentEvents= getEventData();

  /* {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  }, */
  let newEventObj={};

  newEventObj["event"]=document.getElementById("newEventName").value;
  newEventObj["city"]=document.getElementById("newEventCity").value;

  //grabbing a selection from document in JS
  let stateSel=document.getElementById("newEventState");
  newEventObj["state"]=stateSel.options[stateSel.selectedIndex].text;

  newEventObj["attendance"]=parseInt(document.getElementById("newEventAttendance").value,10);

  //grabbing a date from the document and then changing it and re formatting
  let eventDate=document.getElementById("newEventDate").value;
  let eventDate2=`${eventDate}00:00`;
  newEventObj["date"]=new Date(eventDate2).toLocaleDateString();

  currentEvents.push(newEventObj);

  localStorage.setItem("eventData", JSON.stringify(currentEvents));

  buildDropDown();
}




//The original for loop for mostAttendance----------------------
//function mostAttendance(events) {
   // let most=0;
    
   // for (let index = 0; index < events.length; index++) {
        
    //    currentAttendance = events[index].attendance;

   //     if (most<currentAttendance || most > 0){
   //         most = currentAttendance;
   //     }  
   // }
//    return most;
//}
//--------------------------------------------------------------
    

//The original for loop for leastAttendance----------------------
//function leastAttendance(events){
   // let least= -1

   // for (let index = 0; index < events.length; index++) {
        
    //    currentAttendance = events[index].attendance;

     //   if (least>currentAttendance || least < 0){
           // least = currentAttendance;
     //   }  
  //  }

 //   return least;
// }
//--------------------------------------------------------------