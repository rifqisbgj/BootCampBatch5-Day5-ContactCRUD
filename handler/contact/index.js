const getContact = require('./getDetail')
const dbContact = require('./myDb')
const createContact = require('./create')
const deleteContact = require('./delete')
const updateContact = require('./update')

module.exports = {
    getContact,
    dbContact,
    createContact,
    deleteContact,
    updateContact
}