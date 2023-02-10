const db = require('./myDb')
module.exports = (name) => {
    const user = db();

    const detailContact = user.find(x => x.name.toLowerCase() === name.toLowerCase())
    if (detailContact) {
        return detailContact;
    }

}