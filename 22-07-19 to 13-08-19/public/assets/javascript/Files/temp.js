var socket=io();
const form1=document.getElementById("myform");
var msg=document.getElementById("m");
var chat_list=document.getElementById("messages");

socket.on('connect',function(){
  console.log('connected');
appendMessage('connected');
socket.emit('new-user');

socket.on('chat-message',data=>{
  appendMessage(`${data.name}: ${data.message}`);
})

socket.on('broadcast',function(data){
  console.log('connected');
  appendMessage(`${data.description}`)
})

socket.on('user-disconnected',name=>{
  appendMessage(`${name} disconnected`)
})

form1.addEventListener('submit',e=>{
  e.preventDefault();
  message=msg.value;
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message',message)
  console.log(1);
  msg.value='';
})

function appendMessage(message) {
   const messageElement = document.createElement('li');
   messageElement.innerText=message;
   chat_list.append(messageElement)
}
});
