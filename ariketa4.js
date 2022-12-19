
var express = require('express');

const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['teams'])
const db2 = mongojs('mongodb://127.0.0.1:27017/footballdata', ['LaLiga'])

const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ff86eded87msh2e684fd12c16acap1c8d6cjsnd834e8a00085',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };




async function getLaLigaTeams(){
    let laLiga = await fetch('https://api-football-v1.p.rapidapi.com/v3/leagues?name=La%20Liga&country=Spain', options)
        .then(response => response.json())
        .then(response => {return response.response})
        .catch(err => console.error(err));



    let laLigaTeams= await fetch(`https://api-football-v1.p.rapidapi.com/v3/teams?league=${laLiga[0].league.id}&season=${laLiga[0].seasons.pop().year}`, options)
        .then(response => response.json())
        .then(response => {
            return response.response})
        .catch(err => console.error(err));


    db2.LaLiga.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            docs.map((doc) => {
                let teams=laLigaTeams.map((team) => {
                    if(doc.newId === team.team.id){
                        team.team.id = doc.teamId;
                    }
                })
            })
            db.teams.insert(teams, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result)
                }
            })

        }
    })

}

async function getBig5Teams() {
    let big5 = [140, 39, 135, 61, 78]

    big5.forEach( (leagueId) => {


    })
}

getLaLigaTeams()

