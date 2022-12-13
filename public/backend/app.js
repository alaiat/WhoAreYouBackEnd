import fs from 'fs';
import fetch from 'node-fetch'

const writepath = 'json/leagues/'

// 1.1.1 1. json/leagues/ era sinkronoan konectatzeko erabiltzen da
fs.mkdirSync(writepath, {recursive:true})

try {
    // read leagues file into an array of lines
    const data = fs.readFileSync('leagues.txt', 'utf8').split("\n")
    data.forEach( (elem, idx) => {
        const url = `https://playfootball.games/media/competitions/${elem}.png`
        fetch(url)
        .then(res => {
            // check status
            if (res.status === 200) {
                // 1.1.1 2. fs.createWriteStream fs.writeFile antzekoa da, berez egokiagoa textuak gordetzeko
                res.body.pipe(fs.createWriteStream(`${writepath}${elem}.png`))

                } else {
                 console.log(`status: ${res.status} line: ${idx} elem:, ${elem} not found`)
                }
            })
        .catch(err => console.log(err))
        })
    } catch (err) {
    console.error(err);
    }
// 1.1.1 3.
//302, elementua aldi baterako mugitu da
//401, behar diren aginduak ez dira bete
//429, eskaera asko aldi berean
//500, zerbitzariaren errorea