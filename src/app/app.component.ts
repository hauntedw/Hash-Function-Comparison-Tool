import { Component } from "@angular/core";

//array and variable declaring
let isbns = [];
var total = 0;
var list = new String("");
var toBeAdded = new String("");
var lineBreak = new String(",\n");

//our hash table
let hashL = [];
let hashQ = [];
let hashD = [];

//tester variables
let collisionCount = 0;
var elapsedTime = 0;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  text: string;
  outputText: string;
  outputList: string;
  outputTotal: string;
  lHeader: string;
  qHeader: string;
  dHeader: string;
  qCrash: string;
  qTime: string;
  lCrash: string;
  lTime: string;
  dCrash: string;
  dTime: string;

  //check for file change
  file: any;
  fileChanged(e) {
    this.file = e.target.files[0];
  }

  /* 
  when user clicks upload fileReader sends result to console
  set text to result as well textByLine splits the text file by line
  textByLine is an array so we can set isbns[] to textByLine
  */
  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      var text = fileReader.result;
      var textByLine = (text as string).split("\n");
      isbns = textByLine;
    };
    fileReader.readAsText(this.file);
  }

  submit() {
    //this.text comes from text box input
    this.outputText = "You entered: " + this.text;
    //push adds to the array
    isbns.push(+this.text);
  }

  display() {
    //iterating through isbn[] and adding elements to a string
    for (let i in isbns) {
      total += isbns[i];
      toBeAdded = isbns[i].toString();
      toBeAdded = toBeAdded.concat(lineBreak.toString());
      list = list.concat(toBeAdded.toString());
    }
    //toString() converts to int
    this.outputList = "List of ISBNS: " + list.toString();
    this.outputTotal = "Sum of ISBNS: " + total.toString();
  }

  run() {
    //l = linear, q = quadratic, d = double
    this.lHeader = "Running Linear...";
    this.qHeader = "Running Quadratic...";
    this.dHeader = "Running Double...";

    //initialize our hash arrays
    for (let i = 0; i < isbns.length; i++) {
      hashL[i] = -1;
      hashQ[i] = -1;
      hashD[i] = -1;
    }

    var lStart = window.performance.now();

    for (let i = 0; i < hashL.length; i++) {
      //Computing hash value
      let hashV = isbns[i] % hashL.length;

      //Insert in table if there is no collision
      if (hashL[hashV] === -1) {
        hashL[hashV] = isbns[i];
      } else {
        collisionCount++;
        //If there is a collision iterate through all possible linear values
        for (let j = 0; j < hashL.length; j++) {
          //Computing new hash value
          let hv = (hashV + j) % hashL.length;
          if (hashL[hv] === -1) {
            //Break the loop after inserting the value in table
            hashL[hv] = isbns[j];
            break;
          }
        }
      }
    }

    //End time - start time
    elapsedTime = window.performance.now() - lStart;
    this.lCrash = "Collisions occured: " + collisionCount.toString();
    this.lTime = "Time Taken: " + elapsedTime.toString() + " milliseconds";
    collisionCount = 0;

    var qStart = window.performance.now();
    for (let i = 0; i < hashQ.length; i++) {
      //Computing hash value
      let hashV = isbns[i] % hashQ.length;
      //Insert in table if there is no collision
      if (hashQ[hashV] === -1) {
        hashQ[hashV] = isbns[i];
      } else {
        collisionCount++;
        //If there is a collision iterate through all possible linear values
        for (let j = 0; j < hashQ.length; j++) {
          //Computing new hash value
          let hv = (hashV + j * j) % hashQ.length;
          if (hashQ[hv] === -1) {
            //Break the loop after inserting the value in table
            hashQ[hv] = isbns[j];
            break;
          }
        }
      }
    }

    //End time - start time
    elapsedTime = window.performance.now() - qStart;
    this.qCrash = "Collisions occured: " + collisionCount.toString();
    this.qTime = "Time Taken: " + elapsedTime.toString() + " milliseconds";
    collisionCount = 0;

    //Start time
    var dStart = window.performance.now();

    //Keep track of probes, insertion location, collisions, and collision loop
    var probeCount = 0;

    for (let i = 0; i < hashD.length; i++) {
      //computing hash values
      let hash1 = isbns[i] % hashD.length;
      let hash2 = isbns[i] % 3;
      let insert = hash1 + hash2 * probeCount;

      //inserting without collision
      if (hashD[hash1] === -1) {
        hashD[hash1] = isbns[i];
      }

      //inserting with collision
      else {
        collisionCount++;
        for (let j = 0; j < hashD.length; j++) {
          probeCount++;
          insert = hash1 + hash2 * probeCount;
          if (hashD[insert] === -1) {
            hashD[insert] = isbns[i];
            break;
          }
        }
      }
      probeCount = 0;
    }

    //End time - start time
    elapsedTime = window.performance.now() - dStart;
    this.dCrash = "Collisions occured: " + collisionCount.toString();
    this.dTime = "Time Taken: " + elapsedTime.toString() + " milliseconds";
  }
}
