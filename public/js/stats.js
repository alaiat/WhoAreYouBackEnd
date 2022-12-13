export {initState}
export {updateStats}
export {getStats}

let initState = function(what, solutionId) {
    // YOUR CODE HERE
    let erantzuna=JSON.stringify({ "guesses" : [], "solution": solutionId});
    let state= window.localStorage.getItem(what);
    if(state!=null){
        erantzuna=JSON.parse(state);
    }else{
        window.localStorage.setItem(what, erantzuna);
    }


    return [erantzuna, function(guess) {
        let state=JSON.parse(window.localStorage.getItem(what));
        state.guesses.push(guess);
        window.localStorage.setItem(what, JSON.stringify(state));
        return window.localStorage.getItem(what);

    }]


}
function successRate (e){
    let asmaKop=e.winDistribution.reduce((acc,data)=>{
        return acc+data;
    },0)
    return (asmaKop/e.totalGames*100).toFixed(2);
}

let getStats = function(what) {
    let stat=JSON.parse(window.localStorage.getItem(what));
    if(stat==null){
        stat={winDistribution: [0,0,0,0,0,0,0,0],
            gamesFailed: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalGames: 0,
            successRate: 0
        }

    }
    window.localStorage.setItem(what,JSON.stringify(stat))
    return stat;
};


function updateStats(t){
    //console.log(gamestats)
    gamestats.totalGames++;
    if(t<8){
        gamestats.winDistribution[t-1]++;
        gamestats.currentStreak++;
        if(gamestats.currentStreak>gamestats.bestStreak){
            gamestats.bestStreak=gamestats.currentStreak;
        }
    }else{
        gamestats.gamesFailed++;
        gamestats.currentStreak=0;
    }
    gamestats.successRate=successRate(gamestats);
    //console.log(gamestats)
    window.localStorage.setItem('gameStats',JSON.stringify(gamestats));
   // console.log(window.localStorage.getItem('gameStats'))
};


let gamestats = getStats('gameStats');



