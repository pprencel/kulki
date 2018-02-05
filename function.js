var colorsAmount = 5,     // Ilość kolorów
    SheetSize    = 10,    // Wielkość siatki
    totalScore   = 0,     // Wynik punktowy
    inRowToCross = 5,     // Ilość kulek w rzędzie do ich zniknięcia
    delayTime = 200;      // stała wartość opóźnienia między animacjami
var tab = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
];

var tabTemp = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
];
var tabColorInRow = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
];
function randPositon(){                                                         // Losuje w pozycje w siatce
  return Math.floor(Math.random() * SheetSize);                                 // Wartość z przedziału 0-9
}

function randColor(){                                                           // Losuje kolor
  return Math.floor((Math.random() * colorsAmount) + 1);                        // Wartość z przedziału 1-5
}
function gameOver(){                                                            // Funkcja sprawdzająca czy gra
  var i = 0;
  for(i = 0; i < SheetSize; i++){                                               // Przeglądanie kolejnych wierszy tablicy zawierającej pozycje kulek
    if(tab[i].indexOf(0) != -1) {                                               // Jeśli w danym wierszu znajduje się 0 (czyli wolne miejsce) to:
      return false;                                                             // Zwróć wartość false czyli czyli nie gameOver :D
    }
  }
  alert("Koniec gry!\n Twój wynik to: "+totalScore);                            // Informacja o końcu gry i  wyniku
  window.location.reload();                                                     // Przeładowanie strony (przygotowanie do nowej rozgrywki)
}
function printTab(tabName) {                                                    // Funkcja drukująca zawartość tablicy (pomocnicza)
      var i=0;
      for(i=0;i<tabName.length;i++){
        console.log("\t"+tabName[i]);
  }
}
function zeroTab(tabName){                                                      // Funkcja czysząca tablice
  var i,j = 0;
  for(i=0;i<tabName.length;i++){
    for(j=0;j<tabName.length;j++){
      tabName[i][j] = 0;
    }
  }
}
function checkThisBox(y, x) {                                                   // Funkcja sprawdzająca czy w podane wartość nie wychodzą poza zakres tablicy
  if ((x < 0) || (x > 9) || (y < 0) || (y > 9)) return false;                   // Jeśli poza zakresem tablicy to zwraca false
  if(tabTemp[y][x] == -1) return false;                                         // Jeśli przeszkoda(-1) to zwraca false (wykorzysytywane przy funkcji queueAdd)
  return true;
}

function colorsUpdate(){
  var boxForFuture = document.querySelectorAll(".boxForFuture"),                // 3 boksy z nadchodzącymi kolorami
      nextColor = randColor(),                                                  // Losowanie następnego kolru
      i = 0;
      futureColors.unshift(nextColor);                                          // Dodanie nowego koloru na poczatek kolejki

      for(i=0; i<boxForFuture.length; i++){                                     // Przegladanie wszystkich 3 boxów
          if(boxForFuture[i].hasChildNodes() == true)                           // Jezeli ma dziecko (czyli kulke)
            boxForFuture[i].removeChild(boxForFuture[i].childNodes[0]);         // To usuń dziecko

          element  =  document.createElement("div");                            // Nowy element typu div
          element.className = "ball"+futureColors[i];                           // Nowy element z klasą określającą jego kolor
            boxForFuture[i].appendChild(element);                               // Przypisanie do boxu nowego elementu
      }
}
function ballPositions(){                                                       // Sprawdzenie pozycji kulek na warstwie graficznej
  var i = 0,
      j = 0;
      for(i = 0; i < SheetSize; i++){
        for(j = 0; j < SheetSize; j++){
          if(tab[j][i] != 0)                                                    // Jeśli nie jest 0 (czyli kulka w jakimś kolorze) to:
            addBall(j,i, tab[j][i]);                                            // Dodaj kulke (kolor określa wartość w danym polu głównej tabli)
          else
            deleteBall(j, i);                                                   // W innym wypadku - usuń kulke
        }
      }
      function addBall(x, y, color){                                            // Funkcja dodająca kulkę na warstwe graficzna
        var position = x+y*10,                                                  // Pozycja z zakresu 0-99
            box      =  document.querySelectorAll(".box"),
            element  =  document.createElement("div");                          // Tworzy nowy element
          element.className = "ball"+color;                                     // Dodaje klase określającą kolor do nowego elementu

          if(box[position].hasChildNodes() == false)                            // Jeśli nie ma dziecka (przydatne w sytuacji gdy nie nastapiła zmiana w danej siatce)
            box[position].appendChild(element);                                 // Dodaj dziecko
      }

      function deleteBall(x, y){                                                // Funkcja usuwająca kulke z warstwy graficznej
        var position = x+y*10,                                                  // Pozycja z zakresu 0-99
            box      =  document.querySelectorAll(".box");

            if(box[position].hasChildNodes() == true)                           // Jeśli ma dziecko (upewnienie się)
              box[position].removeChild(box[position].childNodes[0]);           // Usuń dziecko
      }
}
function checkSheet(){                                                          // Kasowenie kulek gdy sa ustawione w szeregu
  var score = document.querySelector(".score"),                                 // Element wyświetlający wynik
      i = 0,
      j = 0,
      color = 0,
      tempTotalScore = totalScore;                                              // Zmienna pomocnicza trzymająca ilość punktów przed sprawdzaniem

      function clearThisColor(){                                                // Funkcja znajdująca różnice miedzy główną tablicą a tablicą zaiwrającą kolory w rzędach
        var i = 0,
            j = 0;
        for(i = 0; i < SheetSize; i++){
          for(j = 0; j < SheetSize; j++){
            if(tabColorInRow[i][j] != 0) {                                      // Jeśli w tablicy z określonymi kolorami znajduje się
              tab[i][j] = 0;                                                    // To w głównej tabli ustawia 0
              totalScore++;                                                     // a wynik zwiększa o 1
            }
          }
        }
      }

      function checkThisColor(x, y, color){                                     // Sprawdza dla konkretnej komórki czy ta aby nie wchodzi w jakiś rząd
        var ball =  document.querySelectorAll(".ball"),
            ballAmount = ball.length,
            i,j    =  0,
            counterB = 1, counterT = 1, counterR = 1, counterL = 1, counterRT = 1, counterRB = 1, counterLT = 1, counterLB = 1,
            slopeR = 0, slopeL = 0, vertical = 0, horizontall = 0;
            tabTemp[y][x] = color;                                              // Do dany kolor do wablicy pomocniczej



            function findDifference(_color){                                    // Funkcja znajdująca różnicę między tablicą tymczasową a tablicą kolorów
              var i = 0,                                                        // Tablica kolorów przechowuje wszystkie komórki danego koloru ustawione w rzędy
                  j = 0;                                                        // Tablica tymczasowa przechowuje komórki danego koloru ustawione w rząd
              for(i = 0; i < SheetSize; i++){
                for(j = 0; j < SheetSize; j++){
                  if(tabTemp[i][j] == _color) tabColorInRow[i][j] = _color;
                }
              }
            }

            //      PION
            function bottom(_x, _y){
              _y++;                                                             // Idzie o jedną pozycje w dół

              if(checkThisBox(_y, _x)){                                         // Spawdza czy nie wychodzi poza zakres
                if(tab[_y][_x] == color){                                       // Jeżeli w danym polu jest pożądany kolor
                  tabTemp[_y][_x] = color;                                      // To dodaje do tablicy tymczasowej na tej samej pozycj te sam kolor
                  counterB++;                                                   // Liczni w dół++
                  bottom(_x,_y);                                                // Rekurencyjne wywołanie tej funkcji
                }
              }
              return counterB;                                                  // Zwraca ilość komórek w dół
            }

            function top(_x, _y){
              _y--;                                                             // Idzie o jedną pozycje do góry

              if(checkThisBox(_y, _x)){                                         // Sprawdza czy nie wychodzi poza zakres
                if(tab[_y][_x] == color){                                       // Jeżeli w danym polu jest pożądany kolor
                  tabTemp[_y][_x] = color;                                      // To dodaje do tablicy tymczasowej na tej samej pozycj te sam kolor
                  counterT++;                                                   // Liczni w góre++
                  top(_x,_y);                                                   // Rekurencyjne wywołanie tej funkcji
                }
              }
              return counterT;                                                  // Zwraca ilość komórek do góry
            }

            vertical = bottom(x, y) + top(x, y) - 1;                            // Zmienna ustalająca ile jest kulek danego koloru w pionie
            // Jeśli jest więcej niż 5 ? to idz do funkcji znajdującą różnicę między tablicami a jak nie : to wyczyść tablice tymczasową
            vertical >= 5 ? findDifference(color) : zeroTab(tabTemp);

            //            POZIOM
            function right(_x, _y){
              _x++;                                                             // Idzie o jedną pozycje w prawo

              if(checkThisBox(_y, _x)){                                         // Sprawdza czy nie wychodzi poza zakres
                if(tab[_y][_x] == color){                                       // Jeżeli w danym polu jest pożądany kolor
                  tabTemp[_y][_x] = color;                                      // To dodaje do tablicy tymczasowej na tej samej pozycj te sam kolor
                  counterR++;                                                   // Liczni w prawo++
                  right(_x,_y);                                                 // Rekurencyjne wywołanie tej funkcji
                }
              }
              return counterR;                                                  // Zwraca ilość komórek w prawo
            }

            function left(_x, _y){
              _x--;                                                             // Idzie o jedną pozycje w lewo

              if(checkThisBox(_y, _x)){                                         // Sprawdza czy nie wychodzi poza zakres
                if(tab[_y][_x] == color){                                       // Jeżeli w danym polu jest pożądany kolor
                  tabTemp[_y][_x] = color;                                      // To dodaje do tablicy tymczasowej na tej samej pozycj te sam kolor
                  counterL++;                                                   // Liczni w lewo++
                  left(_x,_y);                                                  // Rekurencyjne wywołanie tej funkcji
                }
              }
              return counterL;                                                  // Zwraca ilość komórek w lewo
            }

            horizontall = right(x, y) + left(x, y) - 1;
            // Jeśli jest więcej niż 5 ? to idz do funkcji znajdującą różnicę między tablicami a jak nie : to wyczyść tablice tymczasową
            horizontall >= 5 ? findDifference(color) : zeroTab(tabTemp);

            //      SKOS Prawy
            function rightTop(_x, _y){
              _x++;                                                             // Idzie o jedną pozycje w prawo
              _y--;                                                             // Idzie o jedną pozycje w górę

              if(checkThisBox(_y, _x)){                                         // Sprawdza czy nie wychodzi poza zakres
                if(tab[_y][_x] == color){                                       // Jeżeli w danym polu jest pożądany kolor
                  tabTemp[_y][_x] = color;                                      // To dodaje do tablicy tymczasowej na tej samej pozycj te sam kolor
                  counterRT++;                                                  // Liczni w prawo-góra++
                  rightTop(_x,_y);                                              // Rekurencyjne wywołanie tej funkcji
                }
              }
              return counterRT;                                                 // Zwraca ilość komórek w prawo-góra
            }

            function leftBottom(_x, _y){
              _x--;                                                             // Idzie o jedną pozycje w lewo
              _y++;                                                             // Idzie o jedną pozycje w dół

              if(checkThisBox(_y, _x)){                                         // Sprawdza czy nie wychodzi poza zakres
                if(tab[_y][_x] == color){                                       // Jeżeli w danym polu jest pożądany kolor
                  tabTemp[_y][_x] = color;                                      // To dodaje do tablicy tymczasowej na tej samej pozycj te sam kolor
                  counterLB++;                                                  // Liczni w lewo-dół++
                  leftBottom(_x,_y);                                            // Rekurencyjne wywołanie tej funkcji
                }
              }
              return counterLB;                                                 // Zwraca ilość komórek w lewy-dół
            }

            slopeR = rightTop(x, y) + leftBottom(x, y) - 1;
            // Jeśli jest więcej niż 5 ? to idz do funkcji znajdującą różnicę między tablicami a jak nie : to wyczyść tablice tymczasową
            slopeR >= 5 ? findDifference(color) : zeroTab(tabTemp);

            //      SKOS LEWY
            function rightBottom(_x, _y){
              _x++;                                                             // Idzie o jedną pozycje w prawo
              _y++;                                                             // Idzie o jedną pozycje w dół

              if(checkThisBox(_y, _x)){                                         // Sprawdza czy nie wychodzi poza zakres
                if(tab[_y][_x] == color){                                       // Jeżeli w danym polu jest pożądany kolor
                  tabTemp[_y][_x] = color;                                      // To dodaje do tablicy tymczasowej na tej samej pozycj te sam kolor
                  counterRB++;                                                  // Liczni w prawy-dół++
                  rightBottom(_x,_y);                                           // Rekurencyjne wywołanie tej funkcji
                }
              }
              return counterRB;                                                 // Zwraca ilość komórek w prawo-dół
            }

            function leftTop(_x, _y){
              _x--;                                                             // Idzie o jedną pozycje w lewo
              _y--;                                                             // Idzie o jedną pozycje w dół

              if(checkThisBox(_y, _x)){                                         // Sprawdza czy nie wychodzi poza zakres
                if(tab[_y][_x] == color){                                       // Jeżeli w danym polu jest pożądany kolor
                  tabTemp[_y][_x] = color;                                      // To dodaje do tablicy tymczasowej na tej samej pozycj te sam kolor
                  counterLT++;                                                  // Liczni w lewa-góra++
                  leftTop(_x,_y);                                               // Rekurencyjne wywołanie tej funkcji
                }
              }
              return counterLT;                                                 // Zwraca ilość komórek w lewy-góra
            }

            slopeL = rightBottom(x, y) + leftTop(x, y) - 1;
            // Jeśli jest więcej niż 5 ? to idz do funkcji znajdującą różnicę między tablicami a jak nie : to wyczyść tablice tymczasową
            slopeL >= 5 ? findDifference(color) : zeroTab(tabTemp);
      }

      for(color = 1; color <= 5; color++){                                      // Przeglądaj główną tablicę dla kolejnych kolorów
        for(i = 0; i < SheetSize; i++){
          for(j = 0; j < SheetSize; j++){
            if(tab[i][j] == color) {                                            // Jeśli miejsce w tablicy ma taką samą wartość co poszukiwany kolor
              checkThisColor(j,i,color);                                        // To użyj funkcji sprawdzającej czy można skreślić
            }
          }
        }
        clearThisColor();                                                       // Funkcja usuwająca z glownej tablicy kulki które są do usunięcia
        zeroTab(tabColorInRow);                                                 // Czyści tablice przechowującą kulki w danym kolorze stojące w rzedzie >= 5
        ballPositions();                                                        // Operacje na warstwie graficznej
      }
      score.innerHTML = "Wynik to: "+totalScore;                                // Aktualizacja wyniku
      if(tempTotalScore != totalScore) return true;
      else return false;
}

function randBall(){
  var x = randPositon(),
      y = randPositon(),
      color = 0;
      if(gameOver() == false){                                                  // Jeśli są jeszcze wolne miejsca w siatce czyli gameOver() == false
        while(tab[x][y] != 0){                                                  // Do momentu gdy nie znajdę wolnego miejsca
          x = randPositon();                                                    // Losuj x na nowo
          y = randPositon();                                                    // Losuj y na nowo
        }
        tab[x][y] = futureColors.pop();                                         // Do wylosowanego wolnego miejsca przypisuje ostatni kolor z kolejki
        ballPositions();                                                        // Dodanie elementu do warstwy graficzniej
        colorsUpdate();                                                         // Aktualizacja kolorow
        checkSheet();                                                           // Sprawdzenie siatki
      }
}

function ballMove(xNew, yNew, xOld, yOld, _activeBall){                         // Funkcja obsługująca przemieszczanie kulki
  var i = 0, j = 0,
      xTemp = 0, yTemp = 0,
      pointsToCheck = [],                                                       // Tablica przechowująca obiekty(elementy kolejki)
      road = [],                                                                // Tablica w której będą kolejne etapy drogi
      roadExist = false;                                                        // Flaga przechowująca informacje czy droga istnieje

      if(xNew == xOld && yNew == yOld) return false;                            // Jeśli kliknę w tę samą komórkę
      if(tab[yNew][xNew] != 0) return false;                                    // Jeśli dana komórka jest już zajętę

  function Point(posY, posX, step) {                                            // Funkcja tworząca objetk
        this.posY = posY;
        this.posX = posX;
        this.step = step;
    }

    function prepareTempTab() {                                                 // Funkcja przygotowująca tablice do tworzenia ścieżki
      for(i=0; i<SheetSize; i++){
        for(j=0;j<SheetSize;j++){
          if(i == yNew && j == xNew)                                            // W punkcie docelowym ustawia 100
            tabTemp[i][j] = 100;
          else if(i == yOld && j == xOld)                                       // W punkcie startowym ustawia 1
            tabTemp[i][j] = 1;
          else if(tab[i][j] != 0)                                               // Jeżeli znajduje się jakakolwiek kulka to ustawia na -1 (przeszkoda)
            tabTemp[i][j] = -1;
        }
      }
    }

  prepareTempTab();                                                             // Stworzenie tablicy

    function isWayPoint(y, x) {                                                 // Funkcja sprawdzająca czy jestem w punkcie docelowy
      if(tabTemp[y][x] != 100){                                                 // Jeśli komórka rózna od 100 to:
        return false;                                                           // Nie jest to punkt docelowy czyli false
      }else{
        tabTemp[y][x] = pointsToCheck[0].step + 1;                              // Przypisuje do punktu docelowego wartość o 1 większą
        return true;                                                            // zwraca true kończąc działanie funckcji queueAdd()
    }
  }
    function isVisited(y, x) {                                                  // Funkcja sprawdzająca czy dana komórka była odwiedzana
      if(tabTemp[y][x] == 0){                                                   // Jeśli nie była odwiedzana
        step = pointsToCheck[0].step+1;                                         // Wartość o jeden większą niż mam komórka w której się znajduję
        tabTemp[y][x] = step;                                                   // To przypiosanie wartości do komórki
        pointsToCheck.push(new Point(y,x,step));                                // Dodaję tę komórkę do kolejki
      }
    }

    function queueAdd() {                                                       // Funkcja Tworząca kolejke
      var i = 0;
      var x,y,value,valueTemp = 0;
                                                                                // pointsToCheck[0] to początek kolejki
      x = pointsToCheck[0].posX;
      y = pointsToCheck[0].posY;

      y--;  // Top
      if(checkThisBox(y,x) == true){                                            // Jeśli nie przeszkoda lub koniec zakresu
        if(isWayPoint(y,x) == true) roadExist = true;                           // Funkcja sprawdzająca czy jestem w punkcie docelowy
        else isVisited(y,x);                                                    // Funkcja sprawdza czy byłem już w tej komórce
      }
      y++;

      x++;    // Right
      if(checkThisBox(y,x) == true){                                            // Jeśli nie przeszkoda lub koniec zakresu
          if(isWayPoint(y,x) == true) roadExist = true;                         // Funkcja sprawdzająca czy jestem w punkcie docelowy
          else isVisited(y,x);                                                  // Funkcja sprawdza czy byłem już w tej komórce

      }
      x--;

      y++;    // Bottom
      if(checkThisBox(y,x) == true) {                                           // Jeśli nie przeszkoda lub koniec zakresu
        if(isWayPoint(y,x) == true) roadExist = true;                           // Funkcja sprawdzająca czy jestem w punkcie docelowy
        else isVisited(y,x);                                                    // Funkcja sprawdza czy byłem już w tej komórce
      }
      y--;

      x--;    // Left
      if(checkThisBox(y,x) == true) {                                           // Jeśli nie przeszkoda lub koniec zakresu
        if(isWayPoint(y,x) == true) roadExist = true;                           // Funkcja sprawdzająca czy jestem w punkcie docelowy
        else isVisited(y,x);                                                    // Funkcja sprawdza czy byłem już w tej komórce
      }
      x++;
      pointsToCheck.shift();                                                    // Usunięcie tego punktu z kolejki
    }

    function makeRoad() {                                                       // Funkcja tworząca drogę (idzie od komórki docelowej do startowej)
      currentStep = tabTemp[yTemp][xTemp];                                      // Wartość wpunkcie docelowym

      yTemp--;  // Top
      if(checkThisBox(yTemp,xTemp) == true){                                    // Sprawdza czy nie jest poza zakresem i czy nie jest przeszkodą
        if(tabTemp[yTemp][xTemp] == currentStep - 1){                           // Jeśli znajdzie o jeden mniejsza
          road.push(1);                                                         // To dodaje do tablicy drogi 1
          makeRoad();                                                           // Rekurencja
        }
        if(currentStep == 1) return true;                                       // Jeśli dojdzie do docelowego to przerwya pętle
      }
      yTemp++;

      xTemp++;  // Right
      if(checkThisBox(yTemp,xTemp) == true){                                    // Sprawdza czy nie jest poza zakresem i czy nie jest przeszkodą
        if(tabTemp[yTemp][xTemp] == currentStep - 1){                           // Jeśli znajdzie o jeden mniejsza
          road.push(2);                                                         // To dodaje do tablicy drogi 2
          makeRoad();                                                           // Rekurencja
        }
        if(currentStep == 1) return true;                                       // Jeśli dojdzie do docelowego to przerwya pętle
      }
      xTemp--;

      yTemp++;  // Bottom
      if(checkThisBox(yTemp, xTemp) == true){                                   // Sprawdza czy nie jest poza zakresem i czy nie jest przeszkodą
        if(tabTemp[yTemp][xTemp] == currentStep - 1){                           // Jeśli znajdzie o jeden mniejsza
          road.push(3);                                                         // To dodaje do tablicy drogi 3
          makeRoad();                                                           // Rekurencja
        }
        if(currentStep == 1) return true;                                       // Jeśli dojdzie do docelowego to przerwya pętle
      }
      yTemp--;

      xTemp--;  // Left
      if(checkThisBox(yTemp,xTemp) == true){                                    // Sprawdza czy nie jest poza zakresem i czy nie jest przeszkodą
        if(tabTemp[yTemp][xTemp] == currentStep - 1) {                          // Jeśli znajdzie o jeden mniejsza
          road.push(4);                                                         // To dodaje do tablicy drogi 4
          makeRoad();                                                           // Rekurencja
        }
        if(currentStep == 1) return true;                                       // Jeśli dojdzie do docelowego to przerwya pętle
      }
      xTemp++;
    }

    function transformBall() {                                                  // Funkcja tworząca animacje przejścia kulki
      var i = 0;
                                                                                // Funkcje animacyjne
      function transformTop() {                                                 // Przsuwająca do góry
          setTimeout(function (){
            _activeBall.style.transform += "translateY(-70px)";
          },delayTime*i);                                                       // Czeka tyle ile stała animacji * ruch w kolejności
      }                                                                         // Np. i=1 idzie do góry po 300*1 następnie i++(i=2), idzie w prawo po 300*2 następnie i++(i=3)
      function transformBottom() {
          setTimeout(function (){
            _activeBall.style.transform += "translateY(70px)";
          },delayTime*i);
      }
      function transformRight() {
          setTimeout(function (){
            _activeBall.style.transform += "translateX(70px)";
          },delayTime*i);
      }
      function transformLeft() {
          setTimeout(function (){
            _activeBall.style.transform += "translateX(-70px)";
          },delayTime*i);
      }

      road.reverse();                                                           // Odwócenie drogi (teraz idziemy od komórki startowej do docelowej a kierunki sa na odwót)
      for (i=0; i<road.length; i++) {                                           // Przechodzę całą tablice zawierającą drogę
        switch (road[i]) {                                                      // W zależności od i wybieram kierunek
          case 1:                                                               // Jeśli 1 to w dół
              transformBottom();
          break;
          case 2:                                                               // Jeśli 2 to w lewo
              transformLeft()
          break;
          case 3:                                                               // Jeśli 3 to w górę
              transformTop();
          break;
          case 4:
              transformRight();                                                 // Jeśli 4 to w prawo
          break;
        }
      }

      setTimeout(function(){                                                    // Funkcja czeka aż wykona się proces animacji kulki a następnie
        tab[yNew][xNew] = tab[yOld][xOld];                                      // Przypisuje do komórki docelowej taki kolor jaki był w polu startowym
        tab[yOld][xOld] = 0;                                                    // W polu startowym wartość 0
        zeroTab(tabTemp);                                                       // Czyści tablicę pomocniczą (ta z odwiedzonymi polami i przeszkodami)
        zeroTab(road);                                                          // Czyści tablicę zawierającą droge

        if(checkSheet() == false){                                              // Jeśli nie nastąpiła zmiana wyniku to:
          randBall();                                                           // Losowanie trzech kulek
          randBall();
          randBall();
        }
      }, delayTime*(road.length+1));                                              // Czeka tyle czasu ile potrzeba na animacje ruchu kulki
  }

    pointsToCheck.push(new Point(yOld, xOld, tabTemp[yOld][xOld]));             // Inicjacja - ustawienie na pierwszą komórkę do sprawdzenia kmoroke z ktorej wychodzimy
    while(roadExist == false){                                                  // Jeśli nie znalazła się droga
      if(pointsToCheck[0] == null) break;                                       // Jeśli wszystkie komórki z kolejki sprawdzone to przerwij
      else queueAdd();                                                          // W przeciwnym wypadku odpal funkcje tworzącą kolejkę
    }
    if(roadExist == true) {                                                     // Jeśli droga istnieje to:
      xTemp = xNew;                                                             // Zmienna pomocnicza potrzebna przy tworzeniu drogi
      yTemp = yNew;                                                             // Zmienna pomocnicza potrzebna przy tworzeniu drogi
      makeRoad();                                                               // Wywołaj funkcje tworzącą drogę od punktu docelowego do starowego
      transformBall();                                                          // Wywołaj funkcje odwracającą drogę i robiącą animacje
    }else{
      console.log("ruch niemożliwy");                                           // Jeśli nie ma drogi to wypisz że ruch jest nie możliwy
    }
}
////////////////// Dwie funkcje odsługujące eventy klikane ////////////////////

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

function clickSelector(){                                                       // Funkcja odpowiadająca za event kliknięcia w siatkę
  var main =  document.querySelector(".main"),                                  // Główny obszar
      box  =  document.querySelectorAll(".box"),
      xNew,yNew,xActive,yActive = 0,
      nameNew, nameActive = 0;
      ballState = false;
      activeBall = 0;

      boxSelect =
        function boxSelect(e){
          if(e.target.parentNode.className == "box" ){                          // Jeśli klikne kulke
            switch (ballState) {
              case true:                                                        // Była kliknięta wcześniej
                  activeBall.className = "ball"+tab[yActive][xActive];          // To przypisuje jej klasę jaką miała przed kliknięciem
                  ballState = false;                                            // Kulka nieaktywna
                break;
              case false:                                                       // Nie była kliknięta wcześniej
                  ballState = true;                                             // Kulka została kliknięta
                  activeBall = e.target;                                        // 'kliknęta' w DOM
                  activeBall.className += " --active";                          // 'kliknięta' dostaje klase aktywnej
                  nameActive = e.target.parentNode.getAttribute("name");        // Nazwa siatki w której znajduje się kliknięta
                  xActive = nameActive.substring(0, 1);                         // Pozycja X
                  yActive = nameActive.substring(2,3);                          // Pozycja Y
                break;
              default:
            }

          }else if(e.target.className == "box" ){                               // Jeśli klikne box
            switch (ballState) {
              case true:                                                        // Była kliknięta wcześniej
                    nameNew = e.target.getAttribute("name");                    // Nazwa siatki w której bedzie znajdować się kliknięta
                    xNew = nameNew.substring(0, 1);                             // Pozycja X
                    yNew = nameNew.substring(2,3);                              // Pozycja Y
                    ballMove(xNew, yNew, xActive, yActive, activeBall);         // Funkcja przemieszczająca
                    activeBall.className = "ball"+tab[yActive][xActive];        // 'kliknięta' dostaje klase jaką miała przed kliknięciem
                    ballState = false;                                          // Kulka nieaktywna
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
