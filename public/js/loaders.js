export { fetchJSON };

async function fetchJSON(file) {

    let erantzuna=await fetch(`./JSON/${file}.json`).then(r => r.json());
    //console.log(erantzuna);
    return erantzuna;
}
