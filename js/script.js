console.log('JS OK!');

/*
Consegna
L'utente clicca su un bottone che genererà una griglia di gioco quadrata.
Ogni cella ha un numero progressivo, da 1 a 100. 
Ci saranno quindi 10 caselle per ognuna delle 10 righe.
Quando l'utente clicca su ogni cella, la cella cliccata si colora di azzurro
 ed emette un messaggio in console con il numero della cella cliccata.


Aggiungere una select accanto al bottone di generazione, che fornisca una scelta tra tre diversi livelli di difficoltà: 
- difficoltà 1 ⇒ 100 caselle, con un numero compreso tra 1 e 100, divise in 10 caselle per 10 righe;
- difficoltà 2 ⇒ 81 caselle, con un numero compreso tra 1 e 81, divise in 9 caselle per 9 righe; 
- difficoltà 3 ⇒ 49 caselle, con un numero compreso tra 1 e 49, divise in 7 caselle per 7 righe;

Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
 Attenzione: nella stessa cella può essere posizionata al massimo una bomba,
 perciò nell’array delle bombe non potranno esserci due numeri uguali.

In seguito l'utente clicca su una cella:
 se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina.
 Altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.

La partita termina quando il giocatore clicca su una bomba
 o quando raggiunge il numero massimo possibile di numeri consentiti (ovvero quando ha rivelato tutte le celle che non sono bombe).

Al termine della partita il software deve comunicare il punteggio,
 cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba.

### **Superbonus 1**
Quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle.ù
// FATTO VIA CSS classe message e show

### Superbonus 2
Quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste.

*/


const BOMBS = 16;

const levels = {
    easy: 100,
    medium: 81,
    hard: 49
}


// available difficulties: easy, medium, hard
let difficulty = 'easy';

const gameStartButton = document.getElementById('game-start-btn');
// L'utente clicca su un bottone che genererà una griglia di gioco quadrata.
gameStartButton.addEventListener('click', startGame)


// select accanto al bottone di generazione per cambiare livello difficoltà
const levelSelectElement = document.getElementById('level-select');

levelSelectElement.addEventListener('change', function(){
    const value = levelSelectElement.value;
    console.log('hai cambiato livello in', value);
    difficulty = value;
})


function startGame(){
    console.log('start game!');
    // Il computer deve generare 16 numeri casuali univoci (BOMBS)
    const bombPositions = getUnivoqueNumbersArray(BOMBS, 1, levels[difficulty]);
    console.log(bombPositions.sort());
    // Ogni cella ha un numero progressivo, da 1 a levels[difficulty]. 
    const gridElement = document.getElementById('grid');
    // Ci saranno quindi difficulty caselle per ognuna delle N righe.
    generateGrid(gridElement, levels[difficulty], bombPositions);


}

function generateGrid(containerElement, numCells, bombs){

    containerElement.innerHTML = '';

    let points = 0;

    for(let index = 1; index <= numCells; index++){
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.classList.add(difficulty);
         // Quando l'utente clicca su ogni cella, la cella cliccata si colora di azzurro
         // ed emette un messaggio in console con il numero della cella cliccata.
        cell.addEventListener('click', ()=>{
           
            console.log('cella cliccata:', index);
           
            // se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina.
            // Altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
            if (bombs.includes(index)){
                console.log('BOOOOM!', index, bombs);
                cell.classList.add('bomb');
                // La partita termina quando il giocatore clicca su una bomba
                showMessage('GAME OVER!', points);
                showBombs(bombs);
            }else{
                console.log('libero');
                cell.classList.add('free');
                const adiacentBombs = getAdiacentBombsNumber(index, bombs);
                cell.innerHTML = adiacentBombs;
                points++;
                 // La partita termina quando raggiunge il numero massimo possibile di numeri consentiti
                 // (ovvero quando ha rivelato tutte le celle che non sono bombe).
                 if (points === levels[difficulty] - bombs.length){
                    showMessage('HAI VINTO! BRAVISSIMO!', points);
                    showBombs(bombs);                    
                 }
            }
        });
        containerElement.append(cell);

    }
}

function showMessage(message, score){
    const messageElement = document.querySelector('.grid-container .message');
    messageElement.innerHTML = `<div>${message}</div>
                                <div>YOU DID ${score} POINTS!</div>
                                `;
    messageElement.classList.add('show');
}


// ### Superbonus 2
// Quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste.
function showBombs(indexesToShow){
    const cells = document.querySelectorAll('#grid .cell');
    for(let i = 0; i <indexesToShow.length; i++){
        const indexValue = indexesToShow[i];
        // indexValue è un range da 1 a N, mentre indexPosition è un range da 0 a N-1
        const indexPosition = indexValue - 1;
        cells[indexPosition].classList.add('bomb');
    }
}



// SUPER SUPER BONUS BY PIETRO
// nella cella inserisco il numero di bombe adiacenti a quella cliccata
function getAdiacentBombsNumber(index, bombs){

    // celle per linea
    const cellsPerLine = Math.sqrt( levels[difficulty] );

    // celle sul lato sx della griglia
    const leftCells = [];
    for (let sxIndex = 1; sxIndex <= levels[difficulty]; sxIndex += cellsPerLine ){
        leftCells.push(sxIndex);
    }

    // celle sul lato dx della griglia
    const rightCells = [];
    for (let dxIndex = cellsPerLine; dxIndex <= levels[difficulty]; dxIndex += cellsPerLine ){
        rightCells.push(dxIndex);
    }

    // trovo le posizioni adiacenti
    const leftCell = index - 1;
    const rightCell = index + 1;
    const topCell = index - cellsPerLine;
    const bottomCell = index + cellsPerLine;

    // verifico se contengono una bomba
    const isPresentBombLeft = !leftCells.includes(index) && bombs.includes(leftCell);   
    const isPresentBombRight = !rightCells.includes(index) && bombs.includes(rightCell);
    const isPresentBombTop =  topCell > 0 && bombs.includes(topCell);   
    const isPresentBombBottom = bottomCell <= levels[difficulty] && bombs.includes(bottomCell);
    
    console.log({isPresentBombLeft, isPresentBombRight, isPresentBombTop, isPresentBombBottom});

    // somma di booleani: JS interpreta true come 1 e false come 0
    return isPresentBombLeft + isPresentBombRight + isPresentBombTop + isPresentBombBottom


}