// NICHOLAS MORGAN SLOTMACHINE

// 1. Despot some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. play again

const prompt = require("prompt-sync")(); //prompt sync is a package installed to get user input

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { //amount of symbols could be found in a row or col
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = { // value for each symbol
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => { // create function that gets deposit amount from user input
  while (true) { // essentually an infinte loop
    const depositAmount = prompt("Enter a deposit amount: "); // Ask user for deposit amount  
    const numberDepositAmount = parseFloat(depositAmount); // converts string above into a float because we need to do math or number which cant be done as a string

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) { // isNaN means not a number 
      console.log("Invalid deposit amount, try again.");
    } else {
      return numberDepositAmount; // breaks infinite loop
    }
  }
};

const getNumberOfLines = () => { // same as function above just # of lines instead of deposit amount
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines); //converts string to float

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) { // 3 lines max
      console.log("Invalid number of lines, try again.");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: "); //ask for bet
    const numberBet = parseFloat(bet); //convert to float

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) { // check if bet is a number and less than balance/lines
      console.log("Invalid bet, try again.");
    } else {
      return numberBet;
    }
  }
};

const spin = () => { // generate each reel, an array of possible symbols
  const symbols = []; // const becomes the size is not changing even though what is inside of it is changing 
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) { // console.log(symbol, count) would output A2B4C6D8
    for (let i = 0; i < count; i++) {
      symbols.push(symbol); // push symbol into the array push is how you add an elemant to an array
    }
  }

  const reels = []; 
  for (let i = 0; i < COLS; i++) { // iterate through each one of our arrays
    reels.push([]); // creating a nested array 
    const reelSymbols = [...symbols]; //generate available symbols
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length); //math.floor rounds down to nearest whole number
      // math.random gives a value between 0 and 1 which is why you multiply by length 
      const selectedSymbol = reelSymbols[randomIndex]; //randomly select elemant from array
      reels[i].push(selectedSymbol); //push randomly selected elemant into array
      reelSymbols.splice(randomIndex, 1); // remove what we pushed from the available symbols so that it is not selected again
    }
  }

  return reels;
};

const transpose = (reels) => { // we want it so that the first elemant in each array is the first row and then the second in each array the second row and so on this is called transposing
  const rows = []; //create a new array

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);  // push an array for each row
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]); // i is first row here and first colummn in reels array j would iterate through the rows so were taking the first elemant in each array
    }
  }

  return rows; 
};

const printRows = (rows) => {
  for (const row of rows) { //loop throuhg rows of rows so the first array not array within array 
    let rowString = ""; //empty string 
    for (const [i, symbol] of row.entries()) { //goin through each elemant in the array
      rowString += symbol; // add the symbol to the array 
      if (i != row.length - 1) {
        rowString += " | "; // dont want a | at the end only 2 not 3 
      }
    }
    console.log(rowString); // output row by row still in loop 
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) { // only need to # of rows equal to how many lines was bet on
    const symbols = rows[row]; 
    let allSame = true; // boolean

    for (const symbol of symbols) { //loops through array
      if (symbol != symbols[0]) {
        allSame = false; // wont add to winnings if symbols dont match
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n)? ");

    if (playAgain != "y") break;
  }
};

game();