const Validator = require('validator')
const checkExist = require('./getDetail')
const dbContact = require('./myDb')
const fs = require('fs')

module.exports = (req, res, name, email, mobile) => {
    const user = dbContact()
    const message = []
    if (checkExist(name)) {
        message.push({
            status: 'error',
            message: 'Nama sudah tersedia',
        })
    }

    // cek apakah user memasukkan nomor hp atau tidak
    const isMobilePhoneValid = Validator.isMobilePhone(mobile, 'id-ID')
    if (mobile) {
        if (!isMobilePhoneValid) { // jika validasi nombor handphone false
            // menambah pesan jika terjadi salah format telpon
            message.push({
                status: 'error',
                message: 'Format nomor telpon salah(contoh: 08212345678)'
            })
            // memberikan informasi kepada user bahwa nomor hp salah dan informasi nomor hp yang benar
        }
    }

    // cek apakah user memasukkan email atau tidak
    if (email) {
        const isEmailValid = Validator.isEmail(email);
        if (!isEmailValid) { // kondisi jika validasi false
            // menambah pesan jika format email salah
            message.push({
                status: 'error',
                message: 'Format email salah (contoh: example@domain.com)'
            })
            // memberikan informasi kepada user bahwa email salah dan informasi email yang benar
        }
    }

    const contact = {
        name,
        email,
        mobile
    }

    // Jika sampai validasi terdapat error
    if (message.length) {
        req.flash('message', message)
        req.flash('olddata', contact)
        res.redirect('/contact/create')
        return false
    }

    if (!email) {
        user.push({
            name: name,
            mobile: mobile
        })
        fs.writeFileSync('./data/contacts.json', JSON.stringify(user));
        // menambah pesan jika data berhasil ditambahkan
        message.push({
            status: 'success',
            message: 'Data berhasil ditambahkan'
        })
        req.flash('message', message)
        res.redirect('/contact')
    }

    user.push(contact)

    // kemudian data tersebut ke contacts.json
    fs.writeFileSync('./data/contacts.json', JSON.stringify(user));
    // menambah pesan jika data berhasil ditambahkan
    message.push({
        status: 'success',
        message: 'Data berhasil ditambahkan'
    })
    req.flash('message', message)
    res.redirect('/contact')
}