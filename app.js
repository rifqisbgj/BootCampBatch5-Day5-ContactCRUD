const express = require('express')
const app = express()
const port = 3000
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const contactFunc = require('./handler/contact')
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override')

app.use(methodOverride('_method'))

app.use(session({
    secret: 'rifqipage',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({
    extended: true
}));
// akan mengatur file lain yang dapat dibaca, berada pada folder public
app.use(express.static('public'))

// memanggil ejs atau menggunakan ejs sebagai view engine
app.set('view engine', 'ejs')

// menggunakan express-ejs-layouts
app.use(expressLayouts)
// set custom layout to other file location/name
app.set('layout', './layout/mainLayout')

// "{root: __dirname}" client akan ngebaca berdasarkan lokasi file pada server
app.get('/', (req, res) => {
    res.render('index', {
        pageName: 'Home'
        // just add layout for spesific single render (e.g layout: 'layoutlocation')
    });
})

// START ROUTE ABOUT
app.get('/about', (req, res, next) => {
    res.render('about', {
        pageName: 'About Page'
    })
})
// END ROUTE ABOUT

// START ROUTE CONTACT
// index Route Contact
app.get('/contact', (req, res) => {
    res.render('contact/contact', {
        // melempar data kontak dan disimpan pada array contact
        contact: contactFunc.dbContact(),
        pageName: 'Contact Page',
        message: req.flash('message')
    })
})

// Route Create Contact
app.get('/contact/create', (req, res) => {
    res.render('contact/createContact', {
        pageName: 'Create Contact Page',
        message: req.flash('message'),
        datalama: req.flash('olddata')
    })
})

// Route Store Contact
app.post('/contact/store', (req, res) => {
    contactFunc.createContact(req, res, req.body.namakontak, req.body.email, req.body.nomorhp);
})

// Route Detail Contact
app.get('/contact/:nama', (req, res) => {
    res.render('contact/detailContact', {
        pageName: 'Detail Contact Page',
        detail: contactFunc.getContact(req.params.nama)
    })
})

// Route Delete Contact
app.delete('/contact/delete', (req, res) => {
    contactFunc.deleteContact(req, res, req.body.name)
})

// Route Update Contact
app.get('/contact/edit/:name', (req, res) => {
    res.render('contact/updateContact', {
        pageName: 'Update Contact Page',
        dataContact: contactFunc.getContact(req.params.name),
        message: req.flash('message'),
    })
})

app.put('/contact/update/:name', (req, res) => {
    contactFunc.updateContact(req, res, req.params.name, req.body.namakontak, req.body.email, req.body.nomorhp)
})

// END ROUTE CONTACT

// menampilkan data berdasarkan product ID dan query category ID
app.get('/product/:productId/', (req, res) => {
    res.send(`Product ID: ${req.params.productId} <br> Category ID: ${req.query.category}`)
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('page not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})