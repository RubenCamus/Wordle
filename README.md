This project works as a Template for creating any Wordle game.
The core functionality of the project -> It gets a random index from one collection's DB , and stores it in a different collection where the data is retrieved.
Very long words may not style properly and could be bugs.

## Pokémon Wordle
A Pokémon-themed Wordle clone built completely from scratch using JavaScript, MongoDB and Express.

Every day, players get a new Pokémon name to guess in a limited number of attempts. The game automatically changes the daily word, making it a fun challenge to come back to every day.

## This projects has these *unique* features.

- Dynamic words, the length of the words changes daily, it's not hard coded to be X amount of letters, instead it changes dynamically on the pokémon it gets from the database.
- REST API word validation system, when the player inputs an attempt the server validates whether the word is in the database or not, if it is responds with the colors for each letter. 
- Color feedback to easily track which letters you have to use.
- Keyboard input support & Visual keyboard.

## Technologies Used
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  /> 
 <img width="12" />   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
 <img width="12" /> 
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="40" alt="express logo"  />
 <img width="12" />   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="40" alt="mongodb logo"  />

## How the game works

* Players have a limited number of attempts to guess the hidden Pokémon.
* After each guess the letters used in the words are highlighted in the following colors.
  * Green: Correct letter in the right position, superb.
  * Yellow: Letter is in the hidden word but in a different position.
  * Grey: Letter is not in the hidden word.
* The hidden Pokémon changes automatically every day.

You can play the deployed version of this game at my [personal website](https://rubencamus.com/)

## Installing the repository

If you want to modify or create your own game based on this you are welcome to do so!

Clone the repository
`git clone https://github.com/RubenCamus/Wordle.git`

You will also need the backend which you can finde [here](https://github.com/RubenCamus/WordleAPI)
