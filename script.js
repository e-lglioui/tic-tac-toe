//fonction pour le plateau de jeu 

document.addEventListener('DOMContentLoaded', ()=>{
    const linenbr=20;
    const gameBoardElement = document.getElementById('game-board');
    for(let row=0;row<linenbr;row++){
        for(let col=0;col<linenbr;col++){
            const cell = document.createElement('button');
            cell.classList.add('cell');
            const cellId = `${row}-${col}`;
            cell.id=cellId;
            gameBoardElement.appendChild(cell);

        }
    }

    function iniScore() {
      console.log( !localStorage.getItem('scores'))
        if (!localStorage.getItem('scores')) {
            const iniscores = { X: 0 , O: 0 };
            localStorage.setItem('scores', JSON.stringify(iniscores)); 
        }
        afficherscore();
    }
    
    iniScore();


    function updateScore(winner) {
        console.log('Winner:', winner); 
        const scores = JSON.parse(localStorage.getItem('scores'));
        console.log(scores); 
        console.log(scores[winner]); 
    
        if (scores[winner] !== undefined) {
            scores[winner]++;
            localStorage.setItem('scores', JSON.stringify(scores));
            afficherscore();
        }
    }
    
    
    function afficherscore() {
        const scores = JSON.parse(localStorage.getItem('scores'));
        if (scores) {
            // console.log('Scores:', scores);
            console.log(scores.X);
            document.getElementById('score-x').textContent = scores.X;
            document.getElementById('score-o').textContent = scores.O;
        } else {
            console.log('Aucun score trouvé dans le localStorage.');
        }
    }
    
    
//  j1=document.getElementsByClassName('j1').style.backgroundColor  = "blue";
   
    
 // //  j1.style.backgroundColor = 'lightcoral';
// const cells = document.querySelectorAll('.cell');
// let tour = 0;
// let j1=[];
// let j2=[];
// let matrix1=[];
// let matrix2=[];


//  function handleClick(event) {
//     if(event.target.textContent ==''){
//     if(tour%2== 0){
//         event.target.textContent="X";
//         let id= event.target.id;
//         // console.log(id);
//         j1.push(id);
//         j1.forEach(pose => {
//             const parts = pose.split('-');

//             const row = parseInt(parts[0], 10);
//             const col = parseInt(parts[1], 10);
//             matrix1.push([row, col]);
//           });

//         console.log(matrix1);

//         // let t=j1.length;
//         // if(t>5){

//         //     for(let i; i<t ; i++){


//         //     }
//         // }

//     }else{
//         event.target.textContent="O"; 
//         let id2= event.target.id;
//         j2.push(id2);
//         // console.log(j2);
     
//     }
//     tour++;
//     j2.forEach(pose => {
//         const parts = pose.split('-');
//         const row = parseInt(parts[0], 10);
//         const col = parseInt(parts[1], 10);
//         matrix2.push([row , col]);
//       });
//       matrix2.sort((a, b) => {
//         if (a[0] === b[0]) {
//           return a[1] - b[1]; 
//         }
//         return a[0] - b[0]; 
//       });
//       console.log(matrix2);
//     }

    
 
// }

const cells = document.querySelectorAll('.cell');
    let tour = 0; 
    const positions = { X: [], O: [] };
    let rest= 10 ;
    function Click(event) {
        const target = event.target;
        // let rest= 10 ;
        if (target.textContent === '') {
            const currentJoueur = tour % 2 === 0 ? 'X' : 'O';
            target.textContent = currentJoueur;
    
            const [row, col] = target.id.split('-').map(Number);
            positions[currentJoueur].push([row, col]);
    
            // console.log(`Positions de ${currentJoueur}:`, positions[currentJoueur]);
    
            if (checkwinner(row, col, currentJoueur)) {
                updateScore(currentJoueur);
                Swal.fire({
                    title: 'Félicitations!',
                    text: `${currentJoueur} a gagné!`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                     
                    if (!finGame()) {
                        resetGame();
                    }
                });
            }
    
            tour++;
            rest=rest-1;
            if(rest<0){
                rest =10;
            }
            
        }
        // console.log(rest)
        // rest=rest-1;
        maxgame(tour,rest);
    }
    

cells.forEach(button => {
    button.addEventListener('click', Click);
});



function checkwinner(row,col,player){
    const win=5;
    function deriction(debutRow,debutCol,pasRow,pasCol){
        let count=0;
        let currentRow=debutRow;
        let currentCol=debutCol;
        while (valid(currentRow, currentCol) && document.getElementById(`${currentRow}-${currentCol}`).textContent === player) {
            count++;
            currentRow += pasRow;
            currentCol += pasCol;
        }
    
        return count;
    }
const countHorizontal = deriction(row, col, 0, 1) + deriction(row, col, 0, -1) - 1;
const countVertical = deriction(row, col, 1, 0) + deriction(row, col, -1, 0) - 1;
const countDiagonalUp = deriction(row, col, 1, 1) + deriction(row, col, -1, -1) - 1;
const countDiagonalDown = deriction(row, col, 1, -1) + deriction(row, col, -1, 1) - 1;

return countHorizontal >= win ||
       countVertical >= win ||
       countDiagonalUp >= win ||
       countDiagonalDown >= win;
}



function valid(row, col) {
    return row >= 0 && row < linenbr && col >= 0 && col < linenbr;
}

function finGame() {
    const scores = JSON.parse(localStorage.getItem('scores'));

    if (scores.x >= 3 || scores.o >= 3) {
        Swal.fire({
            title: 'Félicitations!',
            text: `Le joueur ${scores.x >= 3 ? 'X' : 'O'} a gagné 3 fois!`,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            resetGame();
        });
        return true;
    }
    const totalCells = linenbr * linenbr;
    const filledCells = document.querySelectorAll('.cell').length - document.querySelectorAll('.cell:empty').length;
    if (filledCells >= totalCells) {
        Swal.fire({
            title: 'Match nul!',
            text: "Aucun gagnant cette fois-ci.",
            icon: 'info',
            confirmButtonText: 'OK'
        }).then(() => {
            resetGame();
        });
        return true;
    }
    return false;
}


function resetGame() {
    
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
    tour = 0;
    positions.X = [];
    positions.O = [];
}
function maxgame(tour,rest){
    console.log(rest);
    document.getElementById('tours').textContent = rest;
if(tour>10){
    tour = 0;
    // rest=10;
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');

    positions.X = [];
    positions.O = [];
    
}

}

}
);
 



