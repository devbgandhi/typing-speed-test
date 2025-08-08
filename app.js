//querys for what user writes and sentence generater
const sentenceQuote = document.querySelector("#quote");
const userText = document.querySelector("#input-text");

//stats querys
const timeTaken = document.querySelector("#time-taken");
const wpm = document.querySelector("#wpm");
const userAccuracy = document.querySelector("#accuracy");

//buttons 
const sentenceBtn = document.querySelector('#sentenceBtn');
const resetBtn = document.querySelector("#resetBtn");

let firstKeydown = false;
let startTime = null;
let updateTimer = null;
let currentSentence = "";

//disable text area at start
function disableTextArea() {
    userText.disabled = true;
}
disableTextArea();



//Make a sentence array so that we can select a random array from it 
const sentenceArray = [
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript makes the web come alive with interactivity.",
  "Coding challenges help sharpen your problem solving skills.",
  "A watched pot never boils, but patience always wins.",
  "Typing quickly requires both practice and precision.",
  "Never stop learning because life never stops teaching.",
  "Small steps every day lead to big achievements over time.",
  "Debugging is like detective work in the world of code.",
  "The sun slowly dipped below the calm ocean horizon.",
  "Creativity is intelligence having fun with possibilities."
];

//function that generates a sentence from above array
function getSentence(sentenceArray){
    let randomSentence = sentenceArray[(Math.floor((Math.random()*sentenceArray.length)))];
    return randomSentence;
}

//function to reset everthing
function resetBoard(){
    timeTaken.innerHTML = "0";
    wpm.innerHTML = "0";
    userAccuracy.innerHTML = "0";
    userText.value = "";
    sentenceQuote.innerHTML = "click on get sentence to start ...";
    firstKeydown = false;
    startTime = null;
    currentSentence = "";
    clearInterval(updateTimer);
    disableTextArea();
    sentenceQuote.style.backgroundColor = ""; 
}

//function to loop through the string and add span
function spanChar(sentence){
    let newStr = "";

    for(let i = 0; i < sentence.length; i++){
        if(sentence[i] === " "){
            newStr = newStr + "<span class='check'>&nbsp;</span>";
        } else{
        newStr = newStr + `<span class="check">${sentence[i]}</span>`;
        }
    }
    return newStr;
}

//function to compare string
//function to get what user inputs
function compareStrings(sentence){
    const typedText = userText.value;
    const spanArray = sentenceQuote.querySelectorAll("span");
    let correctChars = 0;

    for(let i = 0; i < spanArray.length; i++){
        let typedChar = typedText[i];
        //if space
        let expectedChar = spanArray[i].textContent === '\u00A0' ? ' ' : spanArray[i].textContent;

        if(!typedChar){
            spanArray[i].classList.remove("correct", "incorrect");
        } else if(typedChar === expectedChar){
            spanArray[i].classList.add("correct");
            spanArray[i].classList.remove("incorrect");
            correctChars++;
        } else {
            spanArray[i].classList.add("incorrect");
            spanArray[i].classList.remove("correct");
        }
    }

    // Check if sentence length is reached
    let isComplete = typedText.length === sentence.length;

    // Return 
    return {
        correctChars,
        totalTyped: typedText.length,
        isComplete
    };
}

//update the timer in stats
function updateTime(){
    let timeSpent = (Date.now() - startTime)/1000;
    timeTaken.innerHTML = timeSpent.toFixed(1);
}

//function to stop timer 
function stopTimer(){
    clearInterval(updateTimer);
}

//add event listener for the first keydown //can do with true false maybe
userText.addEventListener("keydown", () => {
    if(!firstKeydown && !userText.disabled){
        startTime = Date.now();
        firstKeydown = true;
        updateTimer = setInterval(updateTime, 100);
    }
});

//event listener for user input in text area
userText.addEventListener("input", () => {
    const result = compareStrings(currentSentence);

    // Calculate accuracy
    let acc = result.totalTyped === 0 ? 0 : (result.correctChars / result.totalTyped);
    userAccuracy.innerHTML = (acc * 100).toFixed(2); 

    // Calculate WPM only if timer has started
    if (startTime) {
        let timeMinutes = (Date.now() - startTime) / 60000;
        let charsTyped = result.totalTyped;
        let wpmValue = Math.round((charsTyped / 5) / timeMinutes); // 5 chars = 1 word standard
        wpm.innerHTML = isFinite(wpmValue) ? wpmValue : 0;
    }

    // stop timer when sentence length is reached 
    if (result.isComplete) {
        stopTimer();
        userText.disabled = true;

        // Final time update
        let finalTime = (Date.now() - startTime) / 1000;
        timeTaken.innerHTML = finalTime.toFixed(1);

        // Calculate final accuracy
        let finalAcc = result.totalTyped === 0 ? 0 : (result.correctChars / result.totalTyped);
        userAccuracy.innerHTML = (finalAcc * 100).toFixed(2);

        sentenceQuote.style.backgroundColor = "#d4edda"; 
    }
});

//addEventListener on getSentence button
sentenceBtn.addEventListener("click", () => {
   resetBoard();
   currentSentence = getSentence(sentenceArray);
   sentenceQuote.innerHTML = spanChar(currentSentence);
   userText.disabled = false;
   userText.focus();
});

//reset board addEventListener
resetBtn.addEventListener("click", () => {
    resetBoard();
});