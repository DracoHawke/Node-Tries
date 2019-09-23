var objDiv = document.getElementById("all_messages");
var pic=document.getElementById("current_chat");

/*//for autmatic scroll down
window.setInterval(function() {
  var elem = document.getElementById('all_messages');
  elem.scrollTop = elem.scrollHeight;
}, 3000);
//end*/


if(pic != null){
  var pic_path=pic.src;
}
if(objDiv != null){
objDiv.scrollTop = objDiv.scrollHeight;
}

var socket = io('http://localhost:49159');

var name=document.getElementById("uid").innerHTML;
if(document.getElementById("tome")!=null){
var to=document.getElementById("tome").innerHTML;
if(to!=''){
  socket.emit('online',to);
}
}
// check online
socket.on('yes',function(){
  document.getElementById("is_online").innerHTML='Active Now';
});

//appendMeMessage('connected');
socket.emit('new-user',name);

//console.log('agya');

socket.on('chat-message',function(data){
  //console.log(data);
if(data.from==to){
  appendMessage('${data.message}');
  var unread=1;
}
else{
  //console.log(data);
  var ele=document.getElementById(data.from);
  if(ele!=null){
    var unr=ele.innerHTML;
    var from=data.from;
    var n=from;
    //n = from.toString();
    //console.log(n);
    if(unr==''){
      document.getElementById(n).innerHTML=1;
    }
    else{
      var u=parseInt(unr);
      document.getElementById(n).innerHTML=u+1;
    }
  }
  else{
    var unr=document.getElementById("mark").innerHTML;
    if(unr=='')
    {
      document.getElementById("mark").innerHTML=1;
    }
    else{
      var u=parseInt(unr);
      document.getElementById("mark").innerHTML=u+1;
    }
    var adno=document.getElementById("dropit");
    const notificationElement = document.createElement('div');
    notificationElement.innerHTML='<a href="/dashboard/chat?to='+data.from+'">'+data.name+' sent you a message</a>';
    adno.append(notificationElement);
    var href="/dashboard/chat?to="+data.from;
    var noti_data={href:href,from:data.from,me:name}
    socket.emit('notification-added',noti_data);
  }
  notifyMe(data.name,'${data.message}');
  var unread=0;
}
socket.emit('unread',unread);
})

function notifyMe(user,message) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
  var options = {
        body: message,
        dir : "ltr"
    };
  var notification = new Notification(user + " sent you a message",options);
  }
  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // Whatever the user answers, we make sure we store the information
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
      // If the user is okay, let's create a notification
      if (permission === "granted") {
        var options = {
                body: message,
                dir : "ltr",
                icon: "./images/logo.png"
        };
        var notification = new Notification(user + " Posted a comment",options);
      }
    });
  }
  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother them any more.
}


socket.on('user-connected',function(users){
  //console.log(users);
})

socket.on('user-disconnected',function(name){
//  appendMessage(`${name} disconnected`)
//console.log(name);
})

function sender_submit(obj){
  event.preventDefault();
  var msg=document.getElementById("m");
  message=msg.value;
  appendMeMessage('${message}')
  var data={to:to,message:message};
  socket.emit('send-chat-message',data);
  msg.value='';
  return false;
}


function appendMessage(message) {
   const messageElement = document.createElement('div');
   messageElement.classList.add("incoming_msg");
   var d=new Date();
   messageElement.innerHTML='<div class="incoming_msg_img"> <img src="'+pic_path+'" alt="sunil"> </div><div class="received_msg"><div class="received_withd_msg"><p>'+message+'</p><span class="time_date">'+d.getHours()+':'+d.getMinutes()+' | '+d.getDate()+'-'+(d.getMonth()+1)+'</span></div></div>';
   var chat_list=document.getElementById("all_messages");
   chat_list.append(messageElement);
}


function appendMeMessage(message){
  const messageElement = document.createElement('div');
  messageElement.classList.add("outgoing_msg");
   var d=new Date();
  messageElement.innerHTML='<div class="sent_msg"><p>'+message+'</p><span class="time_date">'+d.getHours()+':'+d.getMinutes()+' | '+d.getDate()+'-'+(d.getMonth()+1)+'</span> </div>';
  var chat_list=document.getElementById("all_messages");
  chat_list.append(messageElement);
}
