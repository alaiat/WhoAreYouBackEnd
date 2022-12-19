import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import {autocomplete} from "./autocomplete.js";

function differenceInDays(date1) {
    const today = new Date();
    const time = today.getTime()-date1.getTime();
    let day = time/(1000*3600*24);
    let diffDays = Math.floor(day);
    return diffDays;
}

let difference_In_Days = differenceInDays(new Date("11-06-2022"));

window.onload = function () {
    window.localStorage.removeItem('WAYgameState');
    //window.localStorage.clear();

  document.getElementById(
    "gamenumber"
  ).innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};


let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {

    let length=solutionArray.length;

    while(difference_In_Days > solutionArray.length) {
        difference_In_Days = difference_In_Days-solutionArray.length;
    }
    let solid= solutionArray[difference_In_Days-1].id;

    return players.filter(r=>r.id==solid)[0];
}

Promise.all([fetchJSON("fullplayers"), fetchJSON("solution")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;


    game.solution = getSolution(game.players, solution, difference_In_Days);
    //console.log(solution)

    console.log(game.solution);



    document.getElementById("mistery")
        .src = `http://localhost:3000/api/players/player/${game.solution.id}`;
    //333670



      autocomplete(document.getElementById("myInput"), game)


  }
);
