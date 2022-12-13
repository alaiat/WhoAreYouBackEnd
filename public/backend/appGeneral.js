import fs from 'fs';
import fetch from 'node-fetch'

//leagues,nationalities, teamIDs
function getImages(zerenArgazkia){
    const writepath = `json/${zerenArgazkia}/`
    fs.mkdirSync(writepath, {recursive:true})
    try {
        // read leagues file into an array of lines
        const data = fs.readFileSync(`${zerenArgazkia}.txt`, 'utf8').split("\n")
        data.forEach( (elem, idx) => {

            let url
            switch (zerenArgazkia) {
                case 'leagues':
                    url=`https://playfootball.games/media/competitions/${elem}.png`
                    break;
                case 'nationalities':
                    url=`https://playfootball.games/who-are-ya/media/nations/${elem.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")}.svg`
                    break;
                case 'teamIDs':
                    url=`https://cdn.sportmonks.com/images/soccer/teams/${parseInt(elem.replace(/[^\w ]/g, ''))%32}/${elem.replace(/[^\w ]/g, '')}.png`
                    break;
                    default:
                        console.log("Ez daude horren argazkiak")
            }
            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        if(zerenArgazkia==='nationalities'){
                            res.body.pipe(fs.createWriteStream(`${writepath}${elem.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')}.svg`))
                        }else{
                            res.body.pipe(fs.createWriteStream(`${writepath}${elem.replace(/[^\w]/g, '')}.png`))
                        }
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem:, ${elem} not found`)
                    }
                })
                .catch(err => console.log(err))
        })
    } catch (err) {
        console.error(err);
    }
}

getImages('leagues')
getImages('nationalities')
getImages('teamIDs')
