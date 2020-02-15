import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Flytbase-Assignment';
  n: number = 22 //rows
  m: number = 28  //columns (minimum=2)
  row = []
  column = []
  start = []
  end = []
  direction = "up"
  path = []
  ngOnInit() {
    document.getElementById("table-div").style.marginTop = (document.getElementById("top-div").offsetHeight + 10) + "px"
    this.column = []
    this.row = []
    for (let i = 1; i <= this.m; i++) {
      if (i % 2 != 0) {
        this.column.push(i, 0)
      } else {
        this.column.push(i)
      }
    }
    for (let i = 1; i <= this.n; i++) {
      this.row.push(i)
    }
  }
  database(){
    window.location.href = 'https://flytbase-assignment-backend.herokuapp.com/';
  }
  select(row, col) {
    if (this.start.length == 0) {
      this.start = [row, col]
      document.getElementById("R" + row + "C" + col).style.backgroundColor = 'red'
      document.getElementById("R" + row + "C" + col).innerText = "S"
    } else if (this.end.length == 0) {
      if (this.start[0] == row && this.start[1] == col) {
        alert("Choose ending point other than starting point")
      } else {
        this.end = [row, col]
        this.findPath()
      }

    } else {
      this.reset()
      this.start = [row, col]
      document.getElementById("R" + row + "C" + col).style.backgroundColor = 'red'
      document.getElementById("R" + row + "C" + col).innerText = "S"
    }
  }
  changeDirection() {
    if (this.direction == "up") {
      this.direction = "down"
    } else {
      this.direction = "up"
    }
    if (this.start.length > 0) {
      let temp = [this.start, this.end]
      this.reset()
      this.start = temp[0]
      this.end = temp[1]
      this.findPath()
    }
  }
  reset() {
    if (this.start.length > 0) {
      document.getElementById("R" + this.start[0] + "C" + this.start[1]).style.backgroundColor = "rgb(110, 110, 110)"
      document.getElementById("R" + this.start[0] + "C" + this.start[1]).innerHTML = "&nbsp"
    }
    if (this.end.length > 0) {
      document.getElementById("R" + this.end[0] + "C" + this.end[1]).style.backgroundColor = "rgb(110, 110, 110)"
      document.getElementById("R" + this.end[0] + "C" + this.end[1]).innerHTML = "&nbsp"
    }
    this.path.forEach(_ => {
      document.getElementById(_).style.backgroundColor = "rgb(110, 110, 110)"
      document.getElementById(_).innerHTML = "&nbsp"
    })
    this.start = []
    this.end = []
    this.path = []
  }
  findPath() {
    var endCell = [this.end[0], this.end[1]]
    var currentCell = [this.start[0], this.start[1]]
    var localDir
    if (this.direction == "up") {
      localDir = "up"
    } else {
      localDir = "down"
    }
    var flag = true

    while (flag) {
      let temp = currentCell
      if (localDir == "up") {
        for (let i = temp[0]; i >= 1; i--) {
          if (currentCell[0] == endCell[0] && currentCell[1] == endCell[1]) {
            flag = false
            break;
          } else {
            let cell = "R" + i + "C" + currentCell[1]
            this.path.push(cell)
            document.getElementById(cell).style.background = "#0275d8"
            document.getElementById(cell).innerText = "^"
            currentCell[0] = i
          }
        }
      } else {
        for (let i = temp[0]; i <= this.n; i++) {
          if (currentCell[0] == endCell[0] && currentCell[1] == endCell[1]) {
            flag = false
            break;
          } else {
            let cell = "R" + i + "C" + currentCell[1]
            this.path.push(cell)
            document.getElementById(cell).style.background = "#0275d8"
            document.getElementById(cell).innerText = "v"
            currentCell[0] = i
          }
        }
      }
      if (currentCell[0] == endCell[0] && currentCell[1] == endCell[1]) {
        flag = false
        if (this.path[-1] != "R" + endCell[0] + "C" + endCell[1]) {
          this.path.push("R" + endCell[0] + "C" + endCell[1])
        }
      } else {
        if (endCell[1] < currentCell[1]) {
          currentCell[1] -= 1
        } else {
          if (currentCell[1] < this.m) {
            currentCell[1] += 1
          } else {
            currentCell[1] -= 1
          }
        }
      }
      if (localDir == "up") {
        localDir = "down"
      } else if (localDir == "down") {
        localDir = "up"
      }
    }
    document.getElementById("R" + this.start[0] + "C" + this.start[1]).style.backgroundColor = 'red'
    document.getElementById("R" + this.start[0] + "C" + this.start[1]).innerText = "S"
    document.getElementById("R" + this.end[0] + "C" + this.end[1]).style.backgroundColor = 'green'
    document.getElementById("R" + this.end[0] + "C" + this.end[1]).innerText = "E"
    var pathObj={
      path:this.path
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST',"https://flytbase-assignment-backend.herokuapp.com/");
    xhr.onload = function(){
      console.log(xhr.responseText);
    }
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.send(JSON.stringify(pathObj))
  }
}
