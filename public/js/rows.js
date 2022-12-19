// YOUR CODE HERE :  
// .... stringToHTML ....
// .... setupRows .....
import {fetchJSON} from "./loaders.js"
import { stringToHTML } from "./fragments.js";
export { setupRows };
import {lower} from "./fragments.js";
import {higher} from "./fragments.js";
import {initState} from "./stats.js";
import {updateStats} from "./stats.js";
import {headless} from "./fragments.js";
import {toggle} from "./fragments.js";
import {stats} from "./fragments.js";


// From: https://stackoverflow.com/a/7254108/243532
function pad(a, b){
    return(1e15 + a + '').slice(-b);
}

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']


let setupRows = function (game) {

    let [state, updateState] = initState('WAYgameState', game.solution.id)


    function leagueToFlag(leagueId) {
        let flags = {"564" : "es1", "8" : "en1", "82" : "de1", "384" : "it1", "301" : "fr1"}
        return flags[leagueId];
    }


    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    
    let check = function (theKey, theValue) {
        switch (theKey) {
            case "id":
                if(game.solution.id==theValue){
                    return "correct";
                }else{
                    return "incorrect";
                }
                break;
            case "birthdate":
                if(game.solution.birthdate==theValue){
                    return "correct";
                }else if(getAge(game.solution.birthdate)<getAge(theValue)){
                    return "higher";
                }else{
                    return "lower";
                }
                break
            case "nationality":
                if(game.solution.nationality==theValue){
                    return "correct";
                }else{
                    return "incorrect";
                }
                break
            case "leagueId":
                if(game.solution.leagueId==theValue){
                    return "correct";
                }else {
                    return "incorrect";
                }
                break
            case "teamId":
                if(game.solution.teamId==theValue){
                    return "correct";
                }else {
                    return "incorrect";
                }
                break
            case "position":
                if(game.solution.position==theValue){
                    return "correct";
                }else {
                    return "incorrect";
                }
                break
            case "name":
                if(game.solution.name==theValue){
                    return "correct";
                }else{
                    return "incorrect";
                }
                break

            case "number":
                if(game.solution.number==theValue){
                    return "correct";
                }else {
                    return "incorrect";
                }
                break
            default:
                return "incorrect";
        }
    }
    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }


    function showStats(timeout) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));
                document.getElementById("showHide").onclick = toggle;
                bindClose();
                resolve();
            }, timeout)
        })
    }

    function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild)
            document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
        }
    }

    function checkAdina(birthdate){
        if(getAge(birthdate)<getAge(game.solution.birthdate)){
            return `${getAge(birthdate)}`+higher
        }else if(getAge(birthdate)>getAge(game.solution.birthdate)){
            return `${getAge(birthdate)}`+lower
        }else{
            return `${getAge(birthdate)}`
        }
    }

    function checkZenbakia(zenb){
        if(zenb<game.solution.number){
            return `${zenb}`+higher
        }else if(zenb>game.solution.number){
            return `${zenb}`+lower
        }else{
            return `${zenb}`
        }
    }
    function setContent(guess) {
        return [
            //pais
            `<img src="http://localhost:3000/api/players/nationality/${guess.nationality}" alt="" style="width: 60%;">`,
            //liga
            `<img src="http://localhost:3000/api/players/league/${leagueToFlag(guess.leagueId)}" alt="" style="width: 60%;">`,
            //equipo
            `<img src="http://localhost:3000/api/players/team/${guess.teamId}" alt="" style="width: 60%;">`,
            //posicion
            `${guess.position}`,
            //edad
            `${checkAdina(guess.birthdate)}`,
            //numero
            `${checkZenbakia(guess.number)}`,


        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    function resetInput(){
        let a=JSON.parse(state)
        let saiakerak=a["guesses"].length
        document.getElementById("myInput").value = ""
        document.getElementById("myInput").placeholder = `Guess ${saiakerak+1} of 8`

    }


    let getPlayer = function (playerId) {
        let player = game.players.filter(r => r.id == playerId)[0]
        return player;
    }

    function gameEnded(lastGuess){
        let a=JSON.parse(state)
        let saiakerak=a["guesses"].length
        if(saiakerak==8){
            return true
        }else if(lastGuess==game.solution.id){

            return true
        }else{
            return false
        }
    }
    function success(interval){
        showStats(interval)
        unblur("success")
    }
    function gameOver(interval){
        showStats(interval)
        unblur("fail")
    }

    resetInput();
    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)

        game.guesses.push(playerId)
        state= updateState(playerId)

        resetInput();
        if (gameEnded(playerId)) {
            updateStats(game.guesses.length);

            let interval = setInterval( () => {
                const now = new Date();
                const end = new Date(now);
                end.setDate(end.getDate() + 1);
                end.setHours(0, 0, 0, 0);
                return end - now;
            },1000) ;



            if (playerId == game.solution.id) {
                success(interval);
            }

            if (game.guesses.length == 8) {
                gameOver(interval);
            }

        }


        showContent(content, guess)
    }
}
