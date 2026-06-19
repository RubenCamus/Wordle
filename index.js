var charsCounter = 0;
const API_URL = "https://wordleapi-qola.onrender.com";
// Create a number of html inputs with attributes from the amount of characters received from the MongoDB dailyDb
async function createSquare() {
  var square = document.createElement("input");
  square.className = "char";
  square.setAttribute("maxlength", "1");
  square.setAttribute("type", "text");
  square.disabled = true;
  return square;
}
async function createRows() {
  var wordleDiv = document.getElementById("wordleDiv");
  var rows = [];
  for (let i = 0; i < 6; i++) {
    var row = document.createElement(`div`);
    row.className = "word disabled";
    row.id = `row-${i}`;
    wordleDiv.append(row);
    rows.push(row);
  }
  rows[0].className = "word";
  return rows;
}
async function getRows() {
  var rows = [];
  for (let i = 0; i < 6; i++) {
    const element = document.getElementById(`row-${i}`);
    rows.push(element);
  }
  return rows;
}

async function getCurRow() {
  var storage = await getStorage();
  var curRowNumber = storage.attempts.length;
  var rows = await getRows();
  var curRow = rows[curRowNumber];
  return curRow;
}

async function getSquares(row) {
  var rowSquares = Array.from(row.children);
  return rowSquares;
}
var curSquare = 0;
async function inputNew() {
  curSquare = 0;
  var storage = await getStorage();
  if (storage.finished == true) {
    alert("game already finished");
    return;
  }
  var curRow = await getCurRow();
  console.log("curRow is", curRow);
  const squares = await getSquares(curRow);
  squares.forEach((square) => {
    square.disabled = false;
  });
  curRow.className = "word";
  squares.forEach(function (wordle) {
    wordle.addEventListener("keydown", async function (event) {
      if (event.keyCode === 13) {
        // Function to submit current poki
        await sendInput(curRow);
      }
    });
  });
}

async function handleBackspace(focusSquare, arr) {
  if (curSquare == 0) {
    focusSquare.value = "";
    return;
  }
  if (focusSquare.value == "") {
    curSquare--;
    var sq = arr[curSquare];
    sq.value = "";
    return;
  }
  focusSquare.value = "";
  // curSquare--;
  return;
}

async function gameState(input) {
  var curRow = await getCurRow();
  var squaresArray = await getSquares(curRow);
  var focusSquare = squaresArray[curSquare];
  if (input == "Backspace") {
    await handleBackspace(focusSquare, squaresArray);
    return;
  }
  if (input == "Enter") {
    await sendInput(curRow);
    return;
  }
  if (/[^A-Za-z]/.test(input) || input.length > 1) {
    return;
  }
  if (curSquare >= squaresArray.length - 1) {
    focusSquare.value = input;
  }
  if (curSquare < squaresArray.length - 1) {
    focusSquare.value = input;
    curSquare++;
  }
}

window.addEventListener("keyup", async (event) => {
  const character = event.key;
  await gameState(character);
});

const keyboard = document.getElementById("keyboard");
keyboard.addEventListener("click", (event) => {
  if (!event.target.classList.contains("key")) return;
  const character = event.target.textContent;
  gameState(character);
});
// Get number of characters from daily pokiDB
async function getDailyChars() {
  var dailyChars = await fetch(`${API_URL}/start`);
  var dailyCharsJson = await dailyChars.json();
  return dailyCharsJson;
}

async function sendInput(cr) {
  var poki = await getPoki(cr);
  var colors = await fetchPokemon(poki);
  if (Array.isArray(colors)) {
    await changeColors(colors, cr);
    // await keyboardColors(colors, cr);
    await storeWord(poki);
    cr.className = "word completed";
    await checkWin(colors);
    await inputNew();
  } else {
    console.log("ERROR");
  }
}

async function loadPokiRows(poki, row) {
  var colors = await fetchPokemon(poki);
  await changeColors(colors, row);
}

async function getPoki(cr) {
  // get squares array from cr children
  var squares = await getSquares(cr);
  // get char forEach square
  var pokemon = "";
  squares.forEach((char) => {
    var charValue = char.value;
    pokemon += charValue.toLowerCase();
  });
  console.log("input pokemon is " + pokemon);
  return pokemon;
}

async function fetchPokemon(pokemon) {
  const url = `${API_URL}/pokemon/${pokemon}`;
  const response = await fetch(url);
  const colors = await response.json(); // Colors to display
  console.log(colors);
  return colors;
}

async function changeColors(colors, cr) {
  console.log("colors is: ", colors, "row is: ", cr);
  var squares = await getSquares(cr);
  for (let i = 0; i < colors.length; i++) {
    var curSquare = squares[i];
    curSquare.className = "char " + colors[i];
    curSquare.disabled = true;
    // Change Keyboard Colors
    var squareTextLower = curSquare.value;
    var squareText = squareTextLower.toUpperCase(); // Get the square letter
    var allKeyboardLetters = document.querySelectorAll(".key");
    for (let x = 0; x < allKeyboardLetters.length; x++) {
      if (squareText == allKeyboardLetters[x].innerText) {
        var keyButton = allKeyboardLetters[x];
        if (
          !keyButton.className.includes("grey") ||
          !keyButton.className.includes("green")
        ) {
          if (keyButton.className.includes("orange")) {
            keyButton.classList.remove("orange");
          }
          keyButton.classList.add(`${colors[i]}`);
          break;
        }
      }
    }
  }
}
async function checkWin(colors) {
  var storage = await getStorage();
  var counter = 0;
  // var lastPoki = await getPoki();
  // var colors = await fetchPokemon(lastPoki);
  for (let i = 0; i < colors.length; i++) {
    if (colors[i] == "green") {
      counter++;
    }
  }
  if (counter == colors.length) {
    storage.finished = true;
    localStorage.setItem("game", JSON.stringify(storage));
    await finishGame();
  }
}

async function finishGame() {
  // Check if player finished (localStorage)
  const storage = await getStorage();
  if (storage.attempts.length >= 6) {
    storage.finished = true;
    localStorage.setItem("game", JSON.stringify(storage));
  }
  window.location.href = `/end.html`; // Load end screen
}

async function getStorage() {
  var storage = JSON.parse(localStorage.getItem("game"));
  return storage;
}
async function storeWord(word) {
  var storage = await getStorage();
  storage.attempts.push(word);
  localStorage.setItem("game", JSON.stringify(storage));
}

async function loadGame() {
  var cr = await getCurRow();
  var todaySquares = await getSquares(cr);
  for (let i = 0; i < todaySquares.length; i++) {
    var rowSquares = await getSquares(rows[i]);
    var attemptedWord = saved.attempts[i];
    for (let x = 0; x < rowSquares.length; x++) {
      rowSquares[x].value = attemptedWord[x];
    }
  }
}
async function jugar() {
  var explanationMenu = document.querySelector(".explanation-wrapper");
  explanationMenu.style.display = "flex";
  var btnJugar = document.querySelector(".btn-jugar");
  btnJugar.addEventListener("click", function () {
    explanationMenu.style.display = "none";
  });
}

async function keyboardColors(colors, cr) {
  // Get all keyboard keys into an array
  var keysArray = document.querySelectorAll(".key");
  // Get rowLetters into Array
  var squares = await getSquares(cr);
  console.log("squares array is: ", squares);
  // Compare
  for (let i = 0; i < colors.length; i++) {
    var char = squares[i].innerText;
    var charColor = colors[i];
    for (let x = 0; x < keysArray.length; x++) {
      if (char == keysArray[x].innerText) {
        var str = char.className;
        if (str.includes("green")) {
          break;
        }
        keysArray[x].classList.add(`.${charColor}`);
      }
    }
  }
}
function toggleEndScreen() {
  var popup = document.getElementById("popup");
  popup.classList.toggle("visible");
}
// Call API to start a game
async function app() {
  // Load game
  await jugar();
  const today = new Date().toISOString().slice(0, 10);
  const saved = JSON.parse(localStorage.getItem("game"));
  // Get Daily Chars
  var todaysChars = await getDailyChars();
  console.log("todayChars ", todaysChars);
  // Create Rows with variable squares depending on word's amount of characters
  var rows = await createRows();
  // Create Squares
  for (var i = 0; i < rows.length; i++) {
    for (var x = 0; x < todaysChars; x++) {
      var square = await createSquare();
      rows[i].append(square);
    }
  }
  // Hide loading screen
  var loadingScreen = document.querySelector(".loadingScreen");
  loadingScreen.style.display = "none";
  // Check if there is a saved game from today. If there is load it, otherwise create new game.
  if (saved?.date === today) {
    let menuExplicacion = document.querySelector(".explanation-wrapper");
    menuExplicacion.style.display = none;
    // load attempts
    if (saved.attempts.length != 0) {
      for (let i = 0; i < saved.attempts.length; i++) {
        // For each attempted word check it's colors with server
        var rowSquares = await getSquares(rows[i]);
        let attemptedWord = saved.attempts[i];
        console.log("attemptedWord is ", attemptedWord);
        await loadPokiRows(attemptedWord, rows[i]);
        for (let x = 0; x < rowSquares.length; x++) {
          rowSquares[x].value = attemptedWord[x];
        }
      }
      loadingScreen.style.display = "none";
    }
  } else {
    // start new game
    localStorage.setItem(
      "game",
      JSON.stringify({
        date: today,
        attempts: [],
        finished: false,
      }),
    );
  }
  console.log("going to Input");
  await inputNew();
}

app();
