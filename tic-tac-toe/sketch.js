// Tic Tac Toe AI with Minimax Algorithm
var firebaseConfig = {
    apiKey: "AIzaSyDGRhHYAFRqP0tjHYtV1u1WmOct5lVuyaU",
    authDomain: "trial-1cd60.firebaseapp.com",
    databaseURL: "https://trial-1cd60.firebaseio.com",
    projectId: "trial-1cd60",
    storageBucket: "trial-1cd60.appspot.com",
    messagingSenderId: "169024788730",
    appId: "1:169024788730:web:738318b34e6f0043a99143",
    measurementId: "G-9NTKE56GSZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();
var ref = database.ref('score')

var end = Date.now() + (5 * 1000);

// go Buckeyes!
var colors = ["#FFDF00", '#bb0000', '#ffffff'];

function frame() {

    confetti({
        particleCount: 100,
       angle: 60,
        spread: 70,
        origin: {
            x: 2
        },
        colors: colors
    });
    if (Date.now() < end) {
        requestAnimationFrame(frame);
    }
};

function frames2() {

    confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
    });
    if (Date.now() < end) {
        requestAnimationFrame(frames2);
    }
};


ref.on('value', gotData, erData)

function gotData(data) {
    var scores = data.val();
    var keys = Object.keys(scores);
    const namess = []
    const scoress = []
    for (var i = 0; i < keys.length; i = i + 1) {
        namess.push(scores[keys[i]].name);
        scoress.push(scores[keys[i]].score);
    }
    let ii = scoress.indexOf(Math.max(...scoress));

    document.getElementById('high-score').innerHTML = ' Highest score:: ' + scoress[ii] + ' by ' + namess[ii];
}


function erData(err) {
    console.log(err);
}


function create2DArray(rows, cols, filler = 0) {
    return new Array(rows).fill().map(() => new Array(cols).fill(filler));
}

let difficulties = [20, 15, 10, 5, 1, 0]

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

var w; // = width / 3;
var h; // = height / 3;
var result;
let ai = 'X';
let human = 'O';
let currentPlayer = human;
let n = 3;
let resultP;
let DifficultySlider;
let difficulty = 5;
let DifficultyInfo;
let resetButton;
let score = 0;
let pp = document.createElement('p');

let ppp = document.getElementById('score');
let submit_button = document.getElementById('submit');
let sttr = document.createElement('h3')
submit_button.addEventListener('click', () => {
    if (document.getElementById('input').value != '') {
        fnc();
        document.getElementById('input').value = '';
    } else {
        alert('Please write your name');
    }

});

document.getElementById('hint-button').addEventListener('click', () => {
    if (document.getElementById('input_check').checked) {
        bestMove2(true);
    } else {
        bestMove2(false);
    }
});

function fnc() {
    var data = {
        name: document.getElementById('input').value,
        score: score
    }
    ref.push(data)
    score = 0;
    ppp.innerHTML = "Your score is submitted"
}


function setup() {
    var cnv = createCanvas(500, 400);
    cnv.parent("canvas-container");
    cnv.id("canvas");
    var canv = document.getElementById("canvas");

    canv.style.width = "30vw";
    canv.style.height = "30vw";

    // canv.width = "30vw";
    // canv.height = "30vw";
    resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', reset);
    resultP = document.getElementById('winner');
    DifficultySlider = select("#difficulty");
    DifficultySlider.input(() => {

        if (difficulty != DifficultySlider.value()) {
            difficulty = DifficultySlider.value() - 1;
		reset();
        }
    });

    board = create2DArray(n, n, "");
    w = width / n;
    h = height / n;
    if (document.getElementById('input_check').checked) {
        bestMove();
        currentPlayer = human;
    }
}


function reset() {
    ppp.innerHTML = "Score:" + score;
    draw()
    resultP.innerHTML = ''
    board = create2DArray(n, n, "");
    w = width / n;
    h = height / n;
    if (document.getElementById('input_check').checked) {
        setTimeout(function() { bestMove(); }, 1000);


    }
    currentPlayer = human;
    if (result == human) {
        score = score + 10 * (difficulty + 1);
        ppp.innerHTML = "Score:" + score;
    }

}

function equals3(a, b, c) {
    return a == b && b == c && a != '';
}

function checkWin(board) {
    let first = board[0][0];
    let diagonal = first != ""
    let n = board.length;
    for (let i = 0; i < n; i++) {
        if (board[i][i] != first) {
            diagonal = false
            break
        }
    }
    if (diagonal) {
        if (first == human) { stroke(255, 0, 0); } else { stroke(0, 0, 255); }
        line(0, 0, w, h);
        line(w, h, 2 * w, 2 * h);
        line(2 * w, 2 * h, 3 * w, 3 * h);
        return first;
    }
    first = board[0][n - 1];
    let back_diag = first != "";
    for (let i = 1; i <= n; i++) {
        if (board[i - 1][n - i] != first) {
            back_diag = false
            break
        }
    }
    if (back_diag) {
        if (first == human) { stroke(255, 0, 0); } else { stroke(0, 0, 255); }
        line(0, 3 * h, w, 2 * h);
        line(w, 2 * h, 2 * w, h);
        line(2 * w, h, 3 * w, 0);
        return first;
    }
    for (let i = 0; i < n; i++) {
        first = board[i][0]
        let sideways = first != ""
        for (let j = 0; j < n; j++) {
            if (board[i][j] != first) {
                sideways = false
                break
            }
        }
        if (sideways) {
            if (first == human) { stroke(255, 0, 0); } else { stroke(0, 0, 255); }
            line(i * w + w / 2, 0, i * w + w / 2, 3 * h);
            return first
        }

    }

    for (let i = 0; i < n; i++) {
        first = board[0][i]
        let sideways = first != ""
        for (let j = 0; j < n; j++) {
            if (board[j][i] != first) {
                sideways = false
                break
            }
        }
        if (sideways) {
            if (first == human) { stroke(255, 0, 0); } else { stroke(0, 0, 255); }
            line(0, i * h + h / 2, 3 * w, i * h + h / 2);
            return first;
        }
    }

    let openSpots = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] == '') {
                openSpots++;
            }
        }
    }

    if (openSpots == 0) {
        return 'tie';
    }
    return null;
}

function checkWinner() {
    return checkWin(board)
}


window.addEventListener('click', e => {
    if (!checkWinner()) {
        if (currentPlayer == human) {
            // Human make turn
            let i = floor(mouseX / w);
            let j = floor(mouseY / h);
            // If valid turn
            if (i >= 0 && i < n) {
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let result = checkWinner();
                    if (result !== null) {
                        return scores[result];
                    }
                    currentPlayer = ai;
                    setTimeout(function() { bestMove(); }, 1000);
                }
            }
        }
    }
});

function draw() {
    background(0);
    strokeWeight(4);
    stroke(255);
    fill(0);
    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, width, h);
    line(0, h * 2, width, h * 2);

    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = board[i][j];
            textSize(32);
            let r = w / 4;
            if (spot == human) {
                stroke(255, 0, 0);
                ellipse(x, y, r * 2);
            } else if (spot == ai) {
                stroke(0, 0, 255);
                line(x - r, y - r, x + r, y + r);
                line(x + r, y - r, x - r, y + r);
            }
        }
    }

    result = checkWinner();
    if (result != null) {
        resultP.style.fontSize = '32px';
        if (result == 'tie') {
            resultP.innerHTML = 'Tie!';

        } else {
            if (result == human) {
                frame();
            } else {
                frames2();
            }
            resultP.innerHTML = `${result} wins!`;
        }
    }
}
