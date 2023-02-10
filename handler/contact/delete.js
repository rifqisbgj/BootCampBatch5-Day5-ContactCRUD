const checkExist = require('./getDetail')
const fs = require('fs')
const dbContact = require('./myDb')

module.exports = (req, res, name) => {
    const user = dbContact()
    const indexContact = user.findIndex(x => x.name.toLowerCase() === name.toLowerCase())
    const message = []

    if (indexContact == -1) {
        message.push({
            status: 'error',
            message: `Data ${name} tidak tersedia`,
        })
        return message
    }

    if (indexContact > -1) {
        user.splice(indexContact, 1);
    }

    fs.writeFileSync('./data/contacts.json', JSON.stringify(user));
    message.push({
        status: 'success',
        message: `Data ${name} dihapus`,
    })

    req.flash('message', message)
    res.redirect('/contact')

}