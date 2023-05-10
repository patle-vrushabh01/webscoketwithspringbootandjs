
var stompClient = null;
//this will call from document ready
function connect(){
    //create the socket
    let socket = new SockJS("/server1");
    //pass it to stomp client
    stompClient =Stomp.over(socket);
    //establish  the connection with the server
    stompClient.connect({},function(frame){
        console.log("connected : "+frame)
        //hide the first div
        $("#name-form").addClass("d-none");
        //show the second div
        $("#chat-room").removeClass("d-none");

        //subscribe to get the message
        stompClient.subscribe("/topic/return-to",function(response){
            //call the show message function
            showMessage(JSON.parse(response.body))
        })
    })
}

function showMessage(message){
// add the message to html table
    $("#message-container-table").prepend(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`)
}

function sendMessage(){
    let jsonObj = {
        name:localStorage.getItem("name"),
        content:$('#message-value').val()
    }
   stompClient.send("/app/message",{},JSON.stringify(jsonObj))

}

//when the html page is load this event will trigger
$(document).ready(e=>{
    //when the enter button will click which having id as  #login
    $("#login").click(()=>{
        //get the value from the input field which having the id as name-value
      let name =  $("#name-value").val();
      //add the retrieved value to the local storage
      localStorage.setItem("name",name);
    //calling the connect function
      connect();
    })

    $("#send-btn").click(()=>{
    sendMessage();
    })

    $("#logout").click(()=>{

        localStorage.removeItem("name")
        if(stompClient!==null)
        {
            stompClient.disconnect()

             $("#name-from").removeClass('d-none')
             $("#chat-room").addClass('d-none')
             console.log(stompClient)
        }

    })
})