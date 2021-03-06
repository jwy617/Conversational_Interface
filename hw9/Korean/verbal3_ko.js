/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);
    setEyeColor("magenta");

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "ko";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js
      setEyeColor("black")

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
  var play_re = /\uC8FC\uBB38\s(.+)/i;  // creating a regular expression
  var play_parse_array = user_said.match(play_re) // parsing the input string with the regular expression
  
  console.log(play_parse_array) // let's print the array content to the console log so we understand 
                                // what's inside the array.

  if (user_said.toLowerCase().includes("\uC548\uB155")) {
      response = "\uC548\uB155 \uCE5C\uAD6C!";

  } else if (play_parse_array && state === "initial") {
    response = play_parse_array + "\uC8FC\uBB38\uC644\uB8CC";
  
  } else if (user_said.toLowerCase().includes("\uACE0\uB9C8\uC6CC")) {
    response = "\uD788\uD788\uD788! \uC5B8\uC81C\uB4E0";
    state = "initial"

  } else {
    response = "\uB2E4\uC2DC \uB9D0\uD574\uC918";
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

printVoices();

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  console.log("Voices: ")
  printVoices();

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'ko';
  u.volume = 1.0 // u.volume = 0.5 //between 0.1
  u.pitch = 0.7 // u.pitch = 2.0 //between 0 and 2
  u.rate = 1.0 // u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google 한국어"; })[0]; 
  // Pick the values of the parameters that you like the best with your conversational agent's character.
  // Damayanti, Sin-ji, Moira, Google US English, 

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
