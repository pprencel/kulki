//"use strict";
let numberOfBalls = 0;

const colorsAmount = 5;
let tab = [];
let tempTab = [];
let roadTab = [];
const maxRange = 9;
let score = 0;
let futureColors = [];
function gameOver()
{
    console.log(`koniec gry\n WYNIK: ${score}`);
    for(let i = 0; i < 10; i++){
      for(let j = 0; j < 10; j++){
        if(tab[i][j] != undefined)
          deleteBall(i,j);
      }
    }
    tabCreator(tab, undefined);
    tabCreator(tempTab, 0);
    score = 0;
    numberOfBalls = 0;
}

function tabCreator(_tab, value)
{
  for(var i=0; i<10; i++) {
      _tab[i] = new Array(10).fill(value);
  }
}
tabCreator(tab, undefined);
tabCreator(tempTab, 0);
tabCreator(roadTab, 0);

        //      Powloka graficzna
function randColor(){                                                           // Losuje kolor
  return Math.floor((Math.random() * colorsAmount) + 1);                        // Wartość z przedziału 1-5
}

function colorsUpdate(){
  var boxForFuture = document.querySelectorAll(".boxForFuture"),                // 3 boksy z nadchodzącymi kolorami
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

function addBall(i, j, color){                                            // Funkcja dodająca kulkę na warstwe graficzna
  var position = i+(j*10),                                                  // Pozycja z zakresu 0-99
      box      =  document.querySelectorAll(".box"),
      element  =  document.createElement("div");                          // Tworzy nowy element
    element.className = "ball"+color;                                     // Dodaje klase określającą kolor do nowego elementu
    //console.log(position+"to add");
    box[position].appendChild(element);
}

function deleteBall(i, j){                                                // Funkcja usuwająca kulke z warstwy graficznej
  var position = i+(j*10),                                                  // Pozycja z zakresu 0-99
      box      =  document.querySelectorAll(".box");
      //console.log(position+"to delete  a i:j"+i+":"+j);
      box[position].removeChild(box[position].childNodes[0]);           // Usuń dziecko
      tab[i][j] = undefined;
}

        //      Koniec powłoki graficznej
function updateSurronding()
{
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
      if(tab[i][j] != undefined)
        tab[i][j].makeSurronding();
    }
  }
}

function checkTabDifference()
{
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
      if(tempTab[i][j] == 1){
        deleteBall(i, j);
        score++;
        numberOfBalls--;
        tempTab[i][j] = 0;
      }
    }
  }
  updateSurronding();
}


function checkSheet()
{
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
      if(tab[i][j] != undefined && tempTab[i][j] == 0)
        tab[i][j].find();
    }
  }
  checkTabDifference();
}



class Cell {
  makeSurronding ()
  {
    this.surrounding =
    [
      this.cellT = (this.posJ-1 >= 0) ? tab[this.posI][this.posJ-1] : undefined,
      this.cellRT = (this.posI+1 <= maxRange && this.posJ-1 >= 0) ? tab[this.posI+1][this.posJ-1] : undefined,
      this.cellR = (this.posI+1 <= maxRange) ? tab[this.posI+1][this.posJ] : undefined,
      this.cellRB = (this.posI+1 <= maxRange && this.posJ+1 <= maxRange) ? tab[this.posI+1][this.posJ+1] : undefined,
      this.cellB = (this.posJ+1 <= maxRange) ? tab[this.posI][this.posJ+1] : undefined,
      this.cellLB = (this.posI-1 >= 0 && this.posJ+1 <= maxRange) ? tab[this.posI-1][this.posJ+1] : undefined,
      this.cellL = (this.posI-1 >= 0) ? tab[this.posI-1][this.posJ] : undefined,
      this.cellLT = (this.posI-1 >= 0 && this.posJ-1 >= 0) ? tab[this.posI-1][this.posJ-1] : undefined
    ]
  }

  constructor (exist, posI, posJ, color)
  {
    tab[posI][posJ] = this;
    this.exist = exist,
    this.posI = posI,
    this.posJ = posJ,
    this.color = color,

    addBall(this.posI, this.posJ, this.color);
    updateSurronding();
  }




  findInDirection(i, direction)
  {
    if(this.surrounding[direction] != undefined && this.color == this.surrounding[direction].color)
    {
      i = this.surrounding[direction].findInDirection(++i, direction);
    }
    return i;
  }

  find (i = 1, direction = undefined)
  {
    let n = 0;
    let staringCell = tab[this.posI][this.posJ];
    for(let j = 0; j < this.surrounding.length; j++)
    {

      if(this.surrounding[j] != undefined && this.color == this.surrounding[j].color)
      {
      //  if(staringCell.posI == 3 && staringCell.posJ == 0) console.log("Xd");

        n = this.surrounding[j].findInDirection(2, j);
        if(n >= 5)
        {
          while(n--)
          {
            tempTab[staringCell.posI][staringCell.posJ] = 1;
            staringCell = tab[staringCell.posI][staringCell.posJ].surrounding[j];
          }
        }
        // /staringCell = tab[this.posI][this.posJ];
      }
      n = 0;
    }
  }

}

/*
new Cell(1, 3, 0, 5);
new Cell(1, 3, 1, 5);
new Cell(1, 4, 1, 5);
new Cell(1, 2, 1, 5);
new Cell(1, 1, 1, 5);
new Cell(1, 1, 2, 5);
new Cell(1, 1, 3, 5);
new Cell(1, 0, 1, 5);

new Cell(1, 5, 6, 2);
new Cell(1, 5, 5, 2);
new Cell(1, 5, 4, 1);
new Cell(1, 9, 9, 4);
new Cell(1, 8, 9, 3);
new Cell(1, 7, 9, 3);
new Cell(1, 9, 8, 3);
new Cell(1, 9, 7, 3);
new Cell(1, 6, 7, 1);
*/
function randBall(){
  let i;
  let j;
  if(numberOfBalls < 99)
  {

    while(1)
    {
      i = Math.floor(Math.random() * 10);
      j = Math.floor(Math.random() * 10);
      if(tab[i][j] == undefined) break;
    }
    new Cell(1, i, j, futureColors.pop());
    numberOfBalls++;
    colorsUpdate();
  }else{
    gameOver();
    return 0;
  }
}


function clickSelector(){                                                       // Funkcja odpowiadająca za event kliknięcia w siatkę
  let main =  document.querySelector(".main"),                                  // Główny obszar
      box  =  document.querySelectorAll(".box"),
      iNew,jNew,iActive,jActive = 0,
      nameNew, nameActive = 0;
      ballState = false;
      activeBall = 0;
      tempColor = 0;
      i = 3;

      boxSelect =
        function boxSelect(e){
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
              default:
            }

          }else if(e.target.className == "box" ){                               // Jeśli klikne box
            switch (ballState) {
              case true:                                                        // Była kliknięta wcześniej
                    nameNew = e.target.getAttribute("name");                    // Nazwa siatki w której bedzie znajdować się kliknięta
                    iNew = parseInt(nameNew.substring(0, 1));                             // Pozycja I
                    jNew = parseInt(nameNew.substring(2,3));                              // Pozycja J
                    if(iNew == iActive && jNew == jActive) break;
                    //ballMove(iNew, jNew, iActive, jActive, activeBall);         // Funkcja przemieszczająca
                    //activeBall.className = "ball"+tempColor;        // 'kliknięta' dostaje klase jaką miała przed kliknięciem
                    deleteBall(iActive, jActive);     // TODO: tu zrob jakas metode dla obiektu CELL zeby czyscila
                    //tab[iActive][jActive] = undefined;
                    new Cell(1, iNew, jNew, tempColor);


                    ballState = false;                                          // Kulka nieaktywna
                    i = 3;
                    while(i)
                    {
                      i--;
                      if(randBall() == 0) break;
                    }

                    checkSheet();
                break;
              case false:                                                       // I nie był cześniej kliknięty
                  // To nic (sytuacja gdy nie mam zaznaczonej kulki i klikam w pusty box)
                break;
              default:
            }
          }
        }

  main.addEventListener("click", boxSelect);                                    // Rozpoczęcie wydarzenia po kliknięciu w obszar siatki
}
clickSelector();



function startGame(){                                                           // Funkcja obsługująca start gry
  var start = document.querySelector(".start");
      startTheGame =
        function () {
            futureColors = [randColor(),randColor(),randColor()];               // Przypisanie losowych wartości kolorów przy pierwszym uruchomieniu
            randBall();                                                         // Wywołanie 9  razy nowej kulki na siatke
            randBall();
            randBall();
            randBall();
            randBall();
            randBall();
            randBall();
            randBall();
            randBall();
            start.disabled = true;                                              // Uniemożliwia kliknięcie w przycisk rozpoczynający grę
        }
      start.addEventListener("click", startTheGame);
}
startGame();

function printTab(tab)
{
  let temp = undefined;
  for(let i = 0; i < 10; i++){
    temp = [];
    for(let j = 0; j < 10; j++){

      temp.push( tab[j][i]);
    }
    console.log(temp);
  }
}

/*function roadFunction(startI, startJ, endI, endJ)
{
  let queue = [];
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
      if(tab[i][j] != undefined)
        roadTab[i][j] = -1;
    }
  }
  roadTab[startI][startJ] = 1;
  roadTab[endI][endJ] = 100;

   printTab(roadTab);
   tabCreator(roadTab);
}*/


/*this.surrounding =
[
  this.cellT = (posJ-1 >= 0) ? tab[posI][posJ-1] : undefined,
  this.cellRT = (posI+1 <= maxRange && posJ-1 >= 0) ? tab[posI+1][posJ-1] : undefined,
  this.cellR = (posI+1 <= maxRange) ? tab[posI+1][posJ] : undefined,
  this.cellRB = (posI+1 <= maxRange && posJ+1 <= maxRange) ? tab[posI+1][posJ+1] : undefined,
  this.cellB = (posJ+1 <= maxRange) ? tab[posI][posJ+1] : undefined,
  this.cellLB = (posI-1 >= 0 && posJ+1 <= maxRange) ? tab[posI-1][posJ+1] : undefined,
  this.cellL = (posI-1 >= 0) ? tab[posI-1][posJ] : undefined,
  this.cellLT = (posI-1 >= 0 && posJ-1 >= 0) ? tab[posI-1][posJ-1] : undefined
]*/
