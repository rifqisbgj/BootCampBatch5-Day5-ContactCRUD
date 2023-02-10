const db = require('./myDb')
const findPk = require('./getDetail')
const Validator = require('validator')
const fs = require('fs')

module.exports = (req, res, oldName, newName, email, mobile) => {
    const user = db();
    const message = []

    const indexOldData = user.findIndex(x => x.name.toLowerCase() === oldName.toLowerCase())

    if (indexOldData === -1) {
        message.push({
            status: 'error',
            message: 'Nama sudah tersedia'
        })
    }

    // jika nama baru dan nama lama beda, maka ganti
    if (newName.toLowerCase() != oldName.toLowerCase()) {
        if (findPk(newName)) {
            message.push({
                status: 'error',
                message: 'Nama sudah tersedia'
            })
        } else {
            user[indexOldData].name = newName
        }
    }

    if (newName === "") {
        user[indexOldData].name = oldName
    }

    const isMobilePhoneValid = Validator.isMobilePhone(mobile, 'id-ID')
    if (!isMobilePhoneValid) { // jika validasi nombor handphone false
        // memberikan informasi kepada user bahwa nomor hp salah dan informasi nomor hp yang benar
        console.log("Format nomor telpon salah (contoh: 08212345678)");
        message.push({
            status: 'error',
            message: 'Format nomor telpon salah (contoh: 08212345678)'
        })
    } else { // kalau nomor telpon valid
        // mobile baru akan masuk ke contact berdasarkan index
        user[indexOldData].mobile = mobile;
    }

    if (email) {
        const isEmailValid = Validator.isEmail(email);
        if (!isEmailValid) { // kondisi jika validasi false
            // memberikan informasi kepada user bahwa email salah dan informasi email yang benar
            message.push({
                status: 'error',
                message: 'Format email salah (contoh: example@domain.com)'
            })
        } else { // kalau email valid
            // email baru dimasukkan ke contact berdasarkan index
            user[indexOldData].email = email;
        }
    }

    if (email === "") {
        delete user[indexOldData].email
    }

    if (message.length) {
        req.flash('message', message)
        res.redirect(`/contact/edit/${oldName}`)
        return false
    }

    message.push({
        status: 'success',
        message: 'Data berhasil diubah'
    })
    req.flash('message', message)
    fs.writeFileSync('./data/contacts.json', JSON.stringify(user));
    res.redirect('/contact')
}