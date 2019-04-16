
function addMessage(message,number){
  document.getElementById("message").value = message //adds two stings and output formating to the html
}


/*

function addMessage(message,number){
  document.getElementById("message").innerHTML += "<p>" + number + ": " + "|" + message + "|" + "</p>" //adds two stings and output formating to the html
}
*/


function clearMessage(){
  document.getElementById("message").innerHTML = "" // clears the output portion of the html index
}
/*
function clearMessage(){
  document.getElementById("output").innerHTML = "<p></p>" // clears the output portion of the html index
}*/

function Rot13Enc(message){ //encodes plaintext string to Rot13
  var alfa = "abcdefghijklmnopqrstuvwxyz ";
  var rot13 = "nopqrstuvwxyz abcdefghijklm";
  var encmsg = "";
  var index;
  console.log(message);
  var messagelen = message.length;
  for(var i = 0; i < messagelen; i++){
    index = alfa.indexOf(message.charAt(i));
    encmsg = encmsg + rot13.charAt(index);
  }
  return encmsg;
}



function Rot13Dec(message){ //decrypts a Rot13 input to string
  var alfa = "abcdefghijklmnopqrstuvwxyz ";
  var rot13 = "nopqrstuvwxyz abcdefghijklm";
  var encmsg = "";
  var index;
  console.log(message);
  var messagelen = message.length;
  for(var i = 0; i < messagelen; i++){
    index = rot13.indexOf(message.charAt(i));
    encmsg = encmsg + alfa.charAt(index);
  }
  return encmsg;
}



function SelectorEnc(){ // checks the selector for its state and sends the string to the relevant function. this function is called by the encryption button.
  var selectorval = document.getElementById("select_area").value;
  var orgmessage = document.getElementById("message").value;
  //clearMessage();
  if(selectorval == "rot13"){
  encmsg = Rot13Enc(orgmessage);
  var input = "input"
  var output = "output";
  addMessage(orgmessage,input);
  addMessage(encmsg,output);
  }else{
  PharaoInit(orgmessage);
  }
}



function SelectorDec(){ // checks the selector for its state and sends the string to the relevant function. this function is called by the decryption button.
  var selectorval = document.getElementById("select_area").value;
  var orgmessage = document.getElementById("message").value;
  //clearMessage();
  if(selectorval == "rot13"){
  var decmsg = Rot13Dec(orgmessage);
  var input = "input"
  var output = "output";
  addMessage(orgmessage,input);
  addMessage(decmsg,output);
  }else{
  PharaoDecrypt(orgmessage);
  }
}



function PharaoDecrypt(orgmessage){   // does one itteration of the pharao shuffle
  var input = "input"
  var output = "output";
  decrypedmsg = PharaoCreate(orgmessage);
  addMessage(orgmessage,input);
  addMessage(decrypedmsg,output)
  }



  function PharaoInit(orgmessage){ // calls the pharaocreate function and handles the output and itteration of the pharao algorithm
  var arrayout = [];
  orgmessage = orgmessage.replace(/[ ]/gi, '_');
  pringstring = PharaoCreate(orgmessage);
  var counter = 1;
  var input = "input"
  console.log(counter);
  console.log(orgmessage);
  var flag = true;

  while (flag == true){
    counter ++;
    var prevMessage = pringstring;
    pringstring = PharaoCreate(pringstring);
    //addMessage(pringstring, counter);
    console.log(pringstring);
    console.log(counter +1);
    if(pringstring == orgmessage || pringstring == orgmessage + "_"){
      flag = false;
    }else if (counter >= 1000) { // emergency stop solution
      flag = false;
    }
    var output = "output";
    }
  addMessage(prevMessage,output);
}



function PharaoCreate(message){ //splits string into arrays then calls pharaozip
  var messagelen = message.length;
  if (messagelen % 2 != 0) {
    message = message + "_";
  }
  var orgarr = [];
  messagelen = message.length;
  for(var i = 0; i < messagelen; i++){
    orgarr[i] = message.charAt(i);
  }
pringstring = PharaoZip(orgarr,messagelen);
return pringstring;
}



function PharaoZip(arr,len){ //does a perfect shuffle of the array and makes it into a string
  var halflen = len / 2;
  var zippedarray = [];
  for(var i = 0; i < halflen; i++){
    zippedarray.push(arr[i]);
    zippedarray.push(arr[i+halflen]);
  }
var pringstring = zippedarray.join('¤');
pringstring = pringstring.replace(/[¤]/gi, '');
return pringstring;
}
