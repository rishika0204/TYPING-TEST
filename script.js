(function(){
  
  let startTime = 0;
  let timer;
  let allotedTime = 60;
  let welcome=document.getElementById('welcome');
  let testArea=document.getElementById('test-area');
  let sampleText=document.getElementById('sample-text');
  let timeLeft=document.getElementById('time-left');
  let typingArea=document.getElementById('typing-area');
  let errorsMadeElement=document.getElementById('errors-made');
  let resultElement=document.getElementById('result');
  let wpmElement=document.getElementById('wpm');
  
  let textToType = '';
  let errorsMade=0;
  
  document.getElementById('start-test').addEventListener("click", loadTest);
  typingArea.addEventListener("keyup", keyPress);
  
  function loadTest(){
    welcome.classList.add("hidden");
    document.getElementById("test-area").style.visibility = "visible";
      sampleText.innerHTML="Loading..."
    
    // fetch the sentences, allorigins bypasses the cors check
    fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://asdfast.beobit.net/api/?type=word&length=200')}`)
      .then(response => response.json())
    .then(data => {
      errorsMade=0;
      wpmElement.innerText =0;
      textToType = sampleText.innerText = data.text;
      timer = setInterval(updateTimer, 1000);
      startTime= +new Date();
      typingArea.disabled = false;
    });
  
  }
  
  function updateTimer() {
    let spent= Math.round((new Date() - startTime )/1000)
    if(allotedTime - spent  > 0){
      timeLeft.textContent = allotedTime -spent + "s";
    } else { 
      endTest(); 
    }
  }
    
function keyPress(e) {
    let typed = typingArea.value;
    let spent= Math.round((new Date() - startTime )/1000)
    let wordCount = typed.trim().split(/\s+/).length;
    wpmElement.innerText = wordCount;
      if(typed == textToType) {
        endTest();
      }else {
        let subtext = textToType.substring(0, typed.length);      
        if(typed != subtext) {
          //if alpha numeric
         if (e.which <= 90 && e.which >= 48 || e.which >= 96 && e.which <= 105)
          {
            errorsMade++;
            errorsMadeElement.innerText = errorsMade; 
          }
        }
      }
 };
  
  function endTest(){
     clearInterval(timer);
    typingArea.disabled = true;
    let wpm = typingArea.value.trim().split(/\s+/).length;
    typingArea.value = '';
    resultElement.innerHTML = `Your speed is ${wpm} WPM, you made ${errorsMade} errors.`
    welcome.classList.remove("hidden");
    testArea.classList.add("hidden");
  }
})();
