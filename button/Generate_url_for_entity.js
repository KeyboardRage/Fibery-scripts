/*
	Generate a direct URL to this entity
*/

const url = `https://{WORKSPACE}.fibery.io/{APP_NAME}/{TYPE_NAME}/${urlReady(entity.Name)}-${entity["Public Id"]}`;

function urlReady(input) {
    let args = input.split(/ +/g);
    let newWord = Array();

    args.forEach(word => {
        if (/[^a-zA-Z0-9]$/.test(word)) {
            word = word.slice(0, (word.match(/[^a-zA-Z0-9]+$/)[0].length) * -1);
        }

        let matches = word.match(/[^a-zA-Z0-9]+/g);
        if (matches && matches.length) matches.forEach(e => {
            word = word.replace(e, "-");
        });

        newWord.push(word.replace(/[^a-zA-Z0-9]+$/, "-"));
    });

    return newWord.join("-").replace(/^-+/, "");
}