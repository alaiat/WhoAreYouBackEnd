const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'ff86eded87msh2e684fd12c16acap1c8d6cjsnd834e8a00085',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
};


async function getTeamsOfLeague() {
    await fetch('https://api-football-v1.p.rapidapi.com/v3/leagues?id=564', options)
        .then(response => response.json())
        .then(response => console.log(response.response))
        .catch(err => console.error(err));

}
getTeamsOfLeague().then(r => console.log(r));


