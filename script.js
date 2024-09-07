let form = document.querySelector('#form_1st');

let initial_game = document.querySelector('#initial_game');
let gamearea = document.querySelector('#gamearea');
let user_container = gamearea.querySelector('#user_container');
let roll = document.querySelector('#roll');
let wining_score_card = document.querySelector('#wining_score_card');
let number2 = document.querySelector('#number2');
let showTime = document.querySelector('#showTime');



//form config
form.addEventListener('submit', function(event) {
  event.preventDefault()

  let formData = new FormData(form_1st);
  let dataObject = {};
  formData.forEach((value, key) => {
     dataObject[key] = value;
  });
  
  userCards(dataObject)
  
  initial_game.classList.add('hidden');
  gamearea.classList.remove('hidden');
});


//game config
let players = [];
let currentPlayerIndex = 0;
let targetScore;
let sixTotal = 0;
let gameOver = false; 
let showStart = 0;
let rollTimeOut; 
let intervel; 


//user cards Start;
function userCards(data) {
  targetScore = data.wining_score;
  wining_score_card.innerText=`Wining Score: ${targetScore}`;
  for (var i = 0; i < data.players; i++) {
    let storData = {
        name: `Player ${i + 1}`,
        score: 0,
        sixCount: 0,
        currentScore: 0
      }
    players.push(storData)
  }
  displayUser();
  saveGamelocalStorage()
}

//create plyer function
function createPlyer(player,index,matchindex) {
  console.log(matchindex)
  user_container.innerHTML += `               <div id='player${index}' class="border border-gray-300 rounded-lg p-4 ${matchindex?'bg-purple-100':''}">
                <div class='flex justify-between  items-center'>
                  <h2 class="text-purple-700 font-semibold">${player.name}</h2>
                  <p id='sixCounter' class='bg-purple-300 px-5 py-3 rounded-full hidden'>0</p>
                </div>
                <p class="text-gray-700">Total score - ${player.score}</p>
                <p id='currentScore' class="text-gray-700">Current score - ${player.currentScore}</p>
      </div>`
}

//display user;
function displayUser() {
  players.forEach((player,index)=>{
    createPlyer(player,index,index===currentPlayerIndex)
  })
}

// Function to roll the dice
function rollDice() {
  roll.disabled = true;
  clearTimeout(rollTimeOut);
  clearInterval(intervel)
  showStart = 0;
  roll.classList.add('bg-purple-700','text-white')
  const currentPlayer = players[currentPlayerIndex];
 // const number = Number(number2.value);
  const number = Math.floor(Math.random() * 6) + 1;
  currentPlayer.currentScore = number;
  
  //update data
  const playerElement = document.querySelector(`#player${currentPlayerIndex}`);
  const sixCounter = playerElement.querySelector('#sixCounter');
  //console.log(sixCounter)
  
  let currentScoreupdate = playerElement.querySelector('#currentScore')
  currentScoreupdate.textContent = `Current score - ${currentPlayer.currentScore}`;
  //update data


  if (number === 6) {
    currentPlayer.sixCount++;
    
    if (currentPlayer.sixCount === 3) {
      currentPlayer.sixCount = 0;
      sixTotal=0;
      sixCounter.classList.add('hidden')
      updateScoreDisplay(playerElement,0,true)
    } else {
      sixTotal += number;
      sixCounter.classList.remove('hidden');
      sixCounter.innerText=currentPlayer.sixCount
      updateScoreDisplay(playerElement,0,false);
      saveGamelocalStorage()
    }
    
  } else {
    currentPlayer.sixCount = 0;
    sixCounter.classList.add('hidden')
    sixCounter.innerText=currentPlayer.sixCount;
    updateScoreDisplay(playerElement,number+sixTotal,true);
    sixTotal = 0;
  }
  gameWiner()
  saveGamelocalStorage()
} 

// Function to update the score display
function updateScoreDisplay(playerElement,number,shouldSwitchTurn=false) {
  const currentPlayer = players[currentPlayerIndex];
  saveGamelocalStorage()
     currentPlayer.score += number;
     
     setTimeout(()=>{
       playerElement.querySelector('p.text-gray-700').textContent = `Total score - ${currentPlayer.score}`;
       if (currentPlayer.currentScore !== 6) {
         playerElement.querySelector('#currentScore').textContent = `Current score - ${currentPlayer.currentScore = 0}`;
       }
       roll.disabled=false;
       roll.classList.remove('bg-purple-700','text-white');
       
       if (shouldSwitchTurn) {
         switchTurn()
       }
     },1000)
}

//rollTimeOut
function timeStart() {
  intervel = setInterval(()=>{
    if (!gameOver) {
      showStart++
      showTime.innerHTML = showStart
    }
  },1000)
  
  rollTimeOut=setTimeout(()=>{
    if (!gameOver) {
      clearInterval(intervel)
      showStart = 0
      showTime.innerHTML = showStart
      switchTurn()
    }
  },8000)
}

//change card
function switchTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  
  let previousPlayerIndex = (currentPlayerIndex-1+players.length) % players.length;
  
  let currentPlayerElement = document.querySelector(`#player${currentPlayerIndex}`)
   let previousPlayerElement = document.querySelector(`#player${previousPlayerIndex}`);
   
  if (previousPlayerElement) {
    previousPlayerElement.classList.remove('bg-purple-100');
    }
  
  if (currentPlayerElement) {
    currentPlayerElement.classList.add('bg-purple-100')
    }
  timeStart()
  saveGamelocalStorage()
  //console.log(currentPlayerIndex)
}

//gameWiner
function gameWiner() {
  players.forEach((e)=>{
    if (e.score >= targetScore) {
      roll.disabled = true;
      gameOver = true;
      e.currentScore=0;
      roll.classList.add('hidden')
      showStart = 0;
      showTime.innerHTML = showStart;
      clearInterval(intervel);
      clearTimeout(rollTimeOut);
      saveGamelocalStorage()
      sortPlayersByScore()
    }
  })
};

//sortPlayeeByScore
function sortPlayersByScore() {
  let x = JSON.parse(localStorage.getItem('gameSetLocalStorage')).players;
  if (x) {
      x.sort((a, b) => b.score - a.score);
      x = x.slice(0,2);
      user_container.innerHTML = ''
      x.forEach((player, index) => {
      createPlyer(player, index, index === 0)
  })
  }
}


//common restart and reset
function commonRestRestart() {
  players.map((el) => {
  el.score = 0;
  el.sixCount = 0;
  currentScore = 0;
})

sixTotal = 0;
currentPlayerIndex = 0;
user_container.innerHTML = ''
roll.classList.remove('hidden','bg-purple-500');
gameOver = false;
roll.disabled = false;
}

//restart
 function restart() {
 commonRestRestart()
 showStart = 0;
 showTime.innerHTML=showStart
 clearTimeout(rollTimeOut)
 clearInterval(intervel)
 displayUser()
 saveGamelocalStorage()
}

//reset
function reset() {
  commonRestRestart();
  form.reset()
  players = [];
  showStart = 0;
  initial_game.classList.remove('hidden')
  gamearea.classList.add('hidden');
  localStorage.clear()
}

//add local storage 
function saveGamelocalStorage() {
  let gameSetLocalStorage = {
    players:players,
    targetScore:targetScore,
    currentPlayerIndex:currentPlayerIndex,
    gameOver:gameOver,
    sixTotal:sixTotal
  }
  localStorage.setItem('gameSetLocalStorage', JSON.stringify(gameSetLocalStorage));
};

//localStorage get data
function localStorageGetData() {
  let savedata = JSON.parse(localStorage.getItem('gameSetLocalStorage'));
if (savedata) {
  players = savedata.players;
  currentPlayerIndex = savedata.currentPlayerIndex;
  targetScore = savedata.targetScore;
  wining_score_card.innerText=`Wining Score: ${savedata.targetScore}`
  initial_game.classList.add('hidden')
  gamearea.classList.remove('hidden')
  user_container.innerHTML=''
  displayUser();
  
  //game over save data
  if (savedata.gameOver) {
    roll.disabled = true;
    sortPlayersByScore()
    roll.classList.add('hidden');
    showStart = 0;
    showTime.innerHTML = showStart;
    clearInterval(intervel)
    clearTimeout(rollTimeOut)
  } else {
    const currentPlayerElement = document.querySelector(`#player${currentPlayerIndex}`);
      if (currentPlayerElement) {
        currentPlayerElement.classList.add('bg-purple-100');
      }
      timeStart()
    }
  }
}

// LocalStorage Get Data


window.addEventListener('load',localStorageGetData)