/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

var u = new SpeechSynthesisUtterance();
  u.text = "";
  u.lang = 'en-US';
  u.volume = 1.0 // u.volume = 0.5 //between 0.1
  u.pitch = 0.9 // u.pitch = 2.0 //between 0 and 2
  u.rate = 0.8 // u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google US English"; })[0]; 
  speechSynthesis.speak(u);

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);
    setEyeColor("royalblue");

    speak("yes yes")

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js
      setEyeColor("black");

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
  var response;
   // bunch_of_synonyms_re = /(?:show|tell|know|do)\s(.+)/i;
  var play_re = /(?:order|ordering|place an order|placing an order|have|having|buy|buying|want)\s(.+)/i;  // creating a regular expression
  var play_parse_array = user_said.match(play_re) // parsing the input string with the regular expression
  

  console.log("play_parse_array = ") 
  console.log(play_parse_array)
  console.log("state:" + state)
  // let's print the array content to the console log so we understand 
                                // what's inside the array.
  
  if (user_said.toLowerCase().includes("hello")
    || user_said.toLowerCase().includes("hi")) {
      response = "hi, are you ready to order";

  } else if (user_said.toLowerCase().includes("yes") && state === "initial"
    || user_said.toLowerCase().includes("ready") && state === "initial") {
    response = "what do you want to order";
    state = "ordering"

  } else if (play_parse_array && state === "ordering") {
    response = "okay, ordering" + play_parse_array[1];
    state = "initial"
  
  } else if (user_said.toLowerCase().includes("thank you")
    || user_said.toLowerCase().includes("thanks")) {
    response = "it's my pleasrue to help you";
    state = "initial"

  } else if (user_said.toLowerCase().includes("bye")) {
    response = "okie dokie, bye bye";
    state = "initial"

  } else {
    response = "sorry, can you repeat it again?";
  }
  return response;
}

 


/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

//printVoices();


/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  console.log("Voices: ")
  //printVoices();

  u.text = text;
  u.lang = 'en-US';
  u.volume = 1.0 // u.volume = 0.5 //between 0.1
  u.pitch = 0.9 // u.pitch = 2.0 //between 0 and 2
  u.rate = 0.8 // u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google US English"; })[0]; 
  // Pick the values of the parameters that you like the best with your conversational agent's character.
  // Moira, Ting-Ting, Google US English, Google UK English Male

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
