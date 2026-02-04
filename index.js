var charsCounter = 0;

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
    rows[0].className = 'word';

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
    var json = (await fetch("http://localhost:3000/data/curRow"));
    var curRowNumber = await json.json();
    var rows = await getRows();
    var curRow = rows[curRowNumber];
    return curRow;
}

async function getSquares(row) {
    var rowSquares = Array.from(row.children);
    return rowSquares;
}

async function inputNew() {
    var curRow = await getCurRow();
    console.log('curRow is', curRow);
    const squares = await getSquares(curRow);
    squares.forEach(square => {
       square.disabled = false; 
    });
    curRow.className = "word";
    squares.forEach(function(wordle) {
        wordle.addEventListener("keyup", async function(event) {
            if (event.keyCode === 13) {
                // Function to submit current poki
                await sendInput(curRow);
            }
            else if (wordle.value.length == 1) {
                wordle.nextElementSibling.focus();
            } else if (event.keyCode === 8 ) {
                wordle.previousElementSibling.focus();
            }     
        })
    });
}

// Get number of characters from daily pokiDB
async function getDailyChars() {
    var dailyChars = await fetch('http://localhost:3000/start');
    var dailyCharsJson = await dailyChars.json();
    return dailyCharsJson;
}

async function sendInput(cr) {
    var poki = await getPoki(cr);
    var colors = await fetchPokemon(poki);
    console.log('colors constructor is ', Array.isArray(colors));
    if (Array.isArray(colors)) {
    await changeColors(colors, cr);
    cr.className = "word completed";
    await inputNew();
    } else { 
        console.log('ERROR');
    }
}

async function startLogic() {
    var rows = await getRows();
}

async function getPoki(cr) {
    // var curRow = await getCurRow();
    console.log(cr);
    // get squares array from cr children
    var squares = await getSquares(cr);
    // get char forEach square
    var pokemon = "";
    squares.forEach(char => {
        pokemon += char.value
    });
    console.log("input pokemon is " + pokemon);
    return pokemon;
}

async function fetchPokemon(pokemon) {
    const url = `http://localhost:3000/pokemon/${pokemon}`;
    const response = await fetch(url);
    const colors = await response.json(); // Colors to display
    console.log(colors);
    return colors;
}

async function changeColors(colors, cr) {
    //var curRow = await getCurRow();
    var squares = await getSquares(cr);
    for(let i = 0; i < colors.length; i++) {
        var curSquare = squares[i];
        curSquare.className = "char " + colors[i];
        curSquare.disabled = true;
    }
}

async function sendLocalStorage() { 
    var lastPlayed = localStorage.getItem("lastPlayed");
    
}

// // Setup local storage for storing game data of player
// //localStorage.storagesetItem


// // On player win set the date of last win today. 
localStorage.setItem("lastPlayed", Date().toString)
// On player input correct store the word 

// Store the letters the player has used with their corresponding color




// Call API to start a game
async function app() {
    // Get Daily Chars
    var todaysChars = await getDailyChars();
    // Create Rows with variable squares depending on word's amount of characters
    var rows = await createRows();
    // Create Squares
    for (var i = 0; i < rows.length; i++){
        for (var x = 0; x < todaysChars; x++) {
            var square = await createSquare();
            rows[i].append(square);
        }
    }
    await inputNew();
}
app();