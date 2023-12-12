const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOLS_VALUE = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log(
        "Invalid number, deposit amount must greater than 0. Let's try agin!"
      );
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt(
      "Enter the number of lines you want to bet on (1-3) : "
    );
    const numberOfLines = parseFloat(lines);

    if (
      isNaN(numberOfLines) ||
      numberOfLines <= 0 ||
      numberOfLines > 3 ||
      numberOfLines % 1 !== 0
    ) {
      console.log("Invalid lines, Let's try agin!");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bets, Let's try agin!");
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = []; // [A, A, B, B, B, B, C, C, C ...]

  // 遍历 SYMBOLS_COUNT 对象的属性，返回数组
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  /**
   * A B C
   * C C A
   * A D B
   */
  const reels = []; // reel 代表老虎机上会转动的轴
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbol = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbol.length);
      const selectedSymbol = reelSymbol[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbol.splice(randomIndex, 1); // 用splice()在 randomIndex 的位置删除1个元素，把被选中的 symbol 从数组中删除
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]); // 第j列的第i个元素 把reels数组的0列的第0个元素放进rows的第0个[]中，第0列的第1个元素放进rows第0个[]中，第0列的第2个元素放进rows第0个[]中，结束循环，进行对rows第1个[]的添加
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString = rowString + symbol;
      if (i != row.length - 1) {
        rowString = rowString + " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let isAllSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        // ?为什么要比 symbols[0]
        isAllSame = false;
        break;
      }
    }

    if (isAllSame) {
      winnings = winnings + bet * SYMBOLS_VALUE[[symbols[0]]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log(`You have a balance of ${balance}`);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);

    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log(`You won $${winnings}!`);

    if (balance <=0) {
      console.log("You run out of money!");
      break;
    }

    const playAgain = prompt("Do you wan to play again? (y/n)");

    if (playAgain != "y") break;
  }
};

game();
