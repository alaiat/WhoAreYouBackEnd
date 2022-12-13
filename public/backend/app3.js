import fs from 'fs';
import fetch from 'node-fetch'

const writepath = 'json/teamIDs/'

fs.mkdirSync(writepath, {recursive:true})

try {
    // read leagues file into an array of lines
    const data = fs.readFileSync('teamIDs.txt', 'utf8').split("\n")
    data.forEach( (elem, idx) => {

        const url = `https://cdn.sportmonks.com/images/soccer/teams/${parseInt(elem.replace(/[^\w ]/g, ''))%32}/${elem.replace(/[^\w ]/g, '')}.png`
        //console.log(url)
        fetch(url)
            .then(res => {
                // check status
                if (res.status === 200) {
                    //console.log(`${writepath}${elem.replace(/[^\w ]/g, '')}.png`)
                    res.body.pipe(fs.createWriteStream(`${writepath}${elem.replace(/[^\w ]/g, '')}.png`))

                } else {
                      console.log(`status: ${res.status} line: ${idx} elem:, ${elem} not found`)
                }
            })
            .catch(err => console.log(err))
    })
} catch (err) {
    console.error(err);
}