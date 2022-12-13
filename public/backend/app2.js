import fs from 'fs';
import fetch from 'node-fetch'

const writepath = 'json/nationalities/'

fs.mkdirSync(writepath, {recursive:true})

try {
    // read leagues file into an array of lines
    const data = fs.readFileSync('nationalities.txt', 'utf8').split("\n")
    data.forEach( (elem, idx) => {

        const url = `https://playfootball.games/who-are-ya/media/nations/${elem.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        }.svg`
        fetch(url)
            .then(res => {
                // check status
                if (res.status === 200) {
                    //console.log(`${writepath}${elem.replace(/[^a-zA-Z0-9 ]/g, '')}.svg`)
                   res.body.pipe(fs.createWriteStream(`${writepath}${elem.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
                   }.svg`))

                } else {
                    console.log(`status: ${res.status} line: ${idx} elem:, ${elem} not found`)
                }
            })
            .catch(err => console.log(err))
    })
} catch (err) {
    console.error(err);
}