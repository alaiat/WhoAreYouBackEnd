import fs from 'fs';
import fetch from 'node-fetch'

const writepath = 'json/players/'

fs.mkdirSync(writepath, {recursive:true})

try {
    // read leagues file into an array of lines
    const data = fs.readFileSync('players.txt', 'utf8').split("\n")
    let idx=0
    let interval = setInterval(() => {
        let elem=data[idx]
        const url = `https://media.api-sports.io/football/players/${elem.replace(/[^\w ]/g, '')}.png`
        console.log(url)
        fetch(url)
            .then(res => {
                // check status
                if (res.status === 200) {
                    res.body.pipe(fs.createWriteStream(`${writepath}${elem.replace(/[^\w ]/g, '')}.png`))
                } else {
                    console.log(`status: ${res.status} line: ${idx} elem:, ${elem} not found`)
                }
                if(idx===data.length-1){
                    clearInterval(interval)
                }else{
                    idx++
                }
            })
            .catch(err => console.log(err))
    }, 500)
} catch (err) {
    console.error(err);
}