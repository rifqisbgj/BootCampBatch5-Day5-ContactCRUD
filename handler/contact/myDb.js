const fs = require('fs')

module.exports = () => {

    const folder = './data'
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder); // membuat folder sesuai dengan nilai folder
    }
    // end check folder

    // check apakah ada file contacts.json dalam folder data
    const filejson = './data/contacts.json'
    if (!fs.existsSync(filejson)) {
        fs.writeFileSync(filejson, '[]', 'utf-8');
        // membuat file dengan lokasi sesuai var filejson dengan value []
        // value tersebut untuk menunjukkan bahwa file json tersebut berisi object yg tersimpan dalam array
    }

    const rawData = fs.readFileSync('./data/contacts.json', 'utf-8')
    const contact = JSON.parse(rawData)
    return contact;
}