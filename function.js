//"use strict";
let numberOfBalls = 0;

const colorsAmount = 5;
let tab = [];
let tempTab = [];
const tabRange = 10;
const delayTime = 100;
let score = 0;
let futureColors = [];

const tabCreator = (tab, value) => {
  for(let i = 0; i < tabRange; i++) {
      tab[i] = new Array(10).fill(value);
  }
}
const randColor = () => Math.floor((Math.random() * colorsAmount) + 1);                        // Wartość z przedziału 1-5

        //      Powloka graficzna

const colorsUpdate = () => {
  let boxForFuture = document.querySelectorAll(".boxForFuture"),                // 3 boksy z nadchodzącymi kolorami
      i = 0;
  futureColors.unshift(randColor());                                          // Dodanie nowego koloru na poczatek kolejki

  for(i=0; i<boxForFuture.length; i++){                                     // Przegladanie wszystkich 3 boxów
    if(boxForFuture[i].hasChildNodes() == true)                           // Jezeli ma dziecko (czyli kulke)
      boxForFuture[i].removeChild(boxForFuture[i].childNodes[0]);         // To usuń dziecko

    element  =  document.createElement("div");                            // Nowy element typu div
    element.className = "ball"+futureColors[i];                           // Nowy element z klasą określającą jego kolor
    boxForFuture[i].appendChild(element);                               // Przypisanie do boxu nowego elementu
  }
}

const addBall = (i, j, color) => {                                            // Funkcja dodająca kulkę na warstwe graficzna
  let position = i+(j*tabRange),                                                  // Pozycja z zakresu 0-99
      box      =  document.querySelectorAll(".box"),
      element  =  document.createElement("div");                          // Tworzy nowy element
  element.className = "ball"+color;                                     // Dodaje klase określającą kolor do nowego elementu
  box[position].appendChild(element);
}

const deleteBall = (i, j) => {                                                // Funkcja usuwająca kulke z warstwy graficznej
  let position = i+(j*tabRange),                                                  // Pozycja z zakresu 0-99
      box      =  document.querySelectorAll(".box");
  if(box[position].hasChildNodes() == true)                           // Jeśli ma dziecko (upewnienie się)
    box[position].removeChild(box[position].childNodes[0]);
}

const moveBall = (cell, road) => {  // TODO Srobuj zrobic jedno setTimeout
  let i = 0,
      boxes =  document.querySelectorAll(".box"),
      box = boxes[cell.posI+(cell.posJ*tabRange)].firstChild;

  for (i = 0; i < road.length; i++) {                                           // Przechodzę całą tablice zawierającą drogę
    switch (road[i]) {                                                      // W zależności od i wybieram kierunek
      case 0:                                                               // Jeśli 1 to w dół
        setTimeout( () => {
          box.style.transform += "translateY(70px)";
        },delayTime*i);
      break;
      case 1:                                                               // Jeśli 2 to w lewo
        setTimeout( () => {
          box.style.transform += "translateX(-70px)";
        },delayTime*i);
      break;
      case 2:                                                               // Jeśli 3 to w górę
        setTimeout( () => {
          box.style.transform += "translateY(-70px)";
        },delayTime*i);
      break;
      case 3:
        setTimeout( () => {
          box.style.transform += "translateX(70px)";
        },delayTime*i);                                                // Jeśli 4 to w prawo
      break;
    }
  }
}
const scoreUpdate = () => {
  let scoreBox = document.querySelector(".score");
  scoreBox.innerHTML = "Wynik to: "+score;

}
        //      Koniec powłoki graficznej

const checkTabDifference = () => { // jezeli w tablicy jest jeden to usuwa
  for(let i = 0; i < tabRange; i++){
    for(let j = 0; j < tabRange; j++){
      if(tempTab[i][j] == 1){
        tab[i][j].clear();
        score++;
        numberOfBalls--;
        tempTab[i][j] = 0;
      }
    }
  }
  scoreUpdate();
}

const checkSheet = () => {
  let flat = 0;
  for(let i = 0; i < tabRange; i++){
    for(let j = 0; j < tabRange; j++){
      if(tab[i][j].exist == 1)
        tab[i][j].find();
    }
  }
  flat = [].concat(...tempTab);
  if(flat.includes(1))
    checkTabDifference();
}

const clearRoadValue = () => {
  for(let i = 0; i < tabRange; i++){
    for(let j = 0; j < tabRange; j++){
      tab[i][j].roadValue = 0;
    }
  }
}

class Cell {
  makeSurronding ()
  {
    this.surrounding =
    [
      this.cellT = (this.posJ-1 >= 0) ? tab[this.posI][this.posJ-1] : undefined,
      this.cellR = (this.posI+1 < tabRange) ? tab[this.posI+1][this.posJ] : undefined,
      this.cellB = (this.posJ+1 < tabRange) ? tab[this.posI][this.posJ+1] : undefined,
      this.cellL = (this.posI-1 >= 0) ? tab[this.posI-1][this.posJ] : undefined,
      this.cellRT = (this.posI+1 < tabRange && this.posJ-1 >= 0) ? tab[this.posI+1][this.posJ-1] : undefined,
      this.cellRB = (this.posI+1 < tabRange && this.posJ+1 < tabRange) ? tab[this.posI+1][this.posJ+1] : undefined,
      this.cellLB = (this.posI-1 >= 0 && this.posJ+1 < tabRange) ? tab[this.posI-1][this.posJ+1] : undefined,
      this.cellLT = (this.posI-1 >= 0 && this.posJ-1 >= 0) ? tab[this.posI-1][this.posJ-1] : undefined
    ]
  }

  constructor (exist, posI, posJ, color, roadValue = 0)
  {
    tab[posI][posJ] = this;
    this.exist = exist,
    this.posI = posI,
    this.posJ = posJ,
    this.color = color,
    this.roadValue = roadValue;
    if(exist == 1) {
      addBall(posI, posJ, color);
      this.checkSurrondingFor();
    }
  }

  clear()
  {
    this.exist = 0;
    this.color = 0;
    this.checkSurrondingFor();
    deleteBall(this.posI, this.posJ);
  }

  checkSurrondingFor()
  {
    this.makeSurronding();
    for(let k = 0; k < 8; k++){
      if(this.surrounding[k] !== undefined)
        this.surrounding[k].makeSurronding();
    }
  }

  findInDirection(i, direction)
  {
    if(this.surrounding[direction] != undefined && this.color == this.surrounding[direction].color)
    {
      i = this.surrounding[direction].findInDirection(++i, direction);
    }
    return i;
  }

  find ()
  {
    let n = 0;
    let staringCell = tab[this.posI][this.posJ];
    for(let j = 0; j < this.surrounding.length; j++)
    {
      if(this.surrounding[j] != undefined && this.color == this.surrounding[j].color)
      {
        n = this.surrounding[j].findInDirection(2, j);
        if(n >= 5)
        {
          while(n--)
          {
            tempTab[staringCell.posI][staringCell.posJ] = 1;
            staringCell = tab[staringCell.posI][staringCell.posJ].surrounding[j];
          }
        }
      }
      n = 0;
    }
  }
}

const randBall = (n = 1) =>{
  let i = 0,
      j = 0,
      tempColor = 0;
  while(n !== 0){
    if(numberOfBalls < 99)
    {

      while(1)
      {
        i = Math.floor(Math.random() * tabRange);
        j = Math.floor(Math.random() * tabRange);
        if(tab[i][j].exist == 0) break;
      }
      tempColor = futureColors.pop();
      new Cell(1, i, j, tempColor);
      numberOfBalls++;
      colorsUpdate();
    }else{
      gameOver();
      return 0;
    }
    n--;
  }
}


const roadFunction = (startI, startJ, endI, endJ) => {
  let queue = [],
      road = [],
      cellToCheck = 0,
      surroundings = 0,
      tempScore = score;

  tab[startI][startJ].roadValue = 1;
  tab[endI][endJ].roadValue = 100;
  queue = [tab[startI][startJ]];

  const cellCheck = () => {
    while(queue[0] !== undefined){
      cellToCheck = queue.shift();
      cellToCheck.makeSurronding(); // Aktualizacja roadValue
      surroundings = cellToCheck.surrounding;

      for(let i = 0; i < 4; i++)
      {
        if(surroundings[i] !== undefined){
          if(surroundings[i].roadValue == 100){
            console.log("gotowe!!!");
            tab[endI][endJ].roadValue = cellToCheck.roadValue + 1;
            return true;
          }
          else if(surroundings[i].exist == 0 && surroundings[i].roadValue == 0)
          {
            surroundings[i].roadValue = cellToCheck.roadValue + 1;
            queue.push(surroundings[i]);
          }
        }
      }
    }
  }

  const reverseRoad = () => {
    while(queue[0].roadValue !== 1){
      for (let i = 0; i < 4; i++){
        if(queue[0].surrounding[i] != undefined){
          if(queue[0].surrounding[i].roadValue == queue[0].roadValue - 1)
          {
            road.unshift(i);
            queue.unshift(queue[0].surrounding[i]);
            break;
          }
        }
      }
    }
  }

  if(cellCheck() === true){
    queue = [];
    queue.push(tab[endI][endJ]);
    reverseRoad();

    moveBall(tab[startI][startJ], road);
    setTimeout( () => {
      new Cell(1, endI, endJ, tab[startI][startJ].color);
      tab[startI][startJ].clear();
      clearRoadValue();
      if(tempScore === score)
         randBall(3);
      checkSheet();
    }, delayTime*(road.length+1));
  }else{
    clearRoadValue();
    return false; // brak dorgi
  }
}

const clickSelector = () => {                                                       // Funkcja odpowiadająca za event kliknięcia w siatkę
  let main =  document.querySelector(".main"),                                  // Główny obszar
      box  =  document.querySelectorAll(".box"),
      iNew,jNew,iActive,jActive = 0,
      nameNew, nameActive = 0,
      ballState = false,
      activeBall = 0,
      tempColor = 0;

      const boxSelect = (e) => {
          if(e.target.parentNode.className == "box" ){                          // Jeśli klikne kulke
            switch (ballState) {
              case true:                                           // Była kliknięta wcześniej
                  activeBall.className = "ball"+tempColor;          // To przypisuje jej klasę jaką miała przed kliknięciem
                  ballState = false;                                            // Kulka nieaktywna
                break;
              case false:                                                       // Nie była kliknięta wcześniej
                  activeBall = e.target;                                        // 'kliknęta' w DOM
                  activeBall.className += " --active";                          // 'kliknięta' dostaje klase aktywnej
                  nameActive = e.target.parentNode.getAttribute("name");        // Nazwa siatki w której znajduje się kliknięta
                  iActive = parseInt(nameActive.substring(0, 1));                         // Pozycja I
                  jActive = parseInt(nameActive.substring(2,3));                          // Pozycja J
                  tempColor = tab[iActive][jActive].color;
                  ballState = true;                                             // Kulka została kliknięta
                break;
            }

          }else if(e.target.className == "box" ){                               // Jeśli klikne box
            switch (ballState) {
              case true:                                                        // Była kliknięta wcześniej
                    nameNew = e.target.getAttribute("name");                    // Nazwa siatki w której bedzie znajdować się kliknięta
                    iNew = parseInt(nameNew.substring(0, 1));                             // Pozycja I
                    jNew = parseInt(nameNew.substring(2,3));                              // Pozycja J
                    if(iNew == iActive && jNew == jActive || e.target.hasChildNodes()) break;

                    if(roadFunction(iActive, jActive, iNew, jNew) !== false)
                        ballState = false;
                break;
              case false:                                                       // I nie był cześniej kliknięty
                  // To nic (sytuacja gdy nie mam zaznaczonej kulki i klikam w pusty box)
                break;
            }
          }
        }
  main.addEventListener("click", boxSelect);                                    // Rozpoczęcie wydarzenia po kliknięciu w obszar siatki
}

const gameOver = () =>{
    alert(`koniec gry\n WYNIK: ${score}`);
    for(let i = 0; i < tabRange; i++){
      for(let j = 0; j < tabRange; j++){
        tab[i][j].clear();
      }
    }
    tabCreator(tempTab, 0);
    score = 0;
    numberOfBalls = 0;
    scoreUpdate();
    randBall(9);
}

const startGame = () => {                                                           // Funkcja obsługująca start gry
  let start = document.querySelector(".start");
  tabCreator(tempTab, 0);
  tabCreator(tab, 0);
  clickSelector();
      const startTheGame = () => {
        for(let i = 0; i < tabRange; i++){
          for(let j = 0; j < tabRange; j++){
            new Cell(0, i, j, 0);
          }
        }
        futureColors = [randColor(),randColor(),randColor()];               // Przypisanie losowych wartości kolorów przy pierwszym uruchomieniu
        randBall(9);                                                         // Wywołanie 9  razy nowej kulki na siatke
        start.disabled = true;                                              // Uniemożliwia kliknięcie w przycisk rozpoczynający grę
      }
      start.addEventListener("click", startTheGame);
}
startGame();
