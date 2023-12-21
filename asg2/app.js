const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const dbUrl = 'mongodb://127.0.0.1:27017/comp3012_assignment2'

const app = express()

// Session Configuration
const sessionConfig = {
    name: 'COMP_3012_Assignment_2',
    secret: 'secret_key_here',
    resave: false, // forces a session to be saved back to the store even if the session was not modified
    saveUninitialized: true, // save uninitilized/unmodified sessions
    cookie: {
        secure: false, // we don't have https locally, so choose false. Good to have this set to true in a real application
        httpOnly: true, // only accessible using HTTP. JS cannot access it
    },
    store: MongoStore.create({
        mongoUrl: dbUrl,
        collectionName: 'sessions', // default
    }),
}

app.use(session(sessionConfig))

// Routes
const indexRouter = require('./src/routes/index')
const authRouter = require('./src/routes/auth')
const articleRouter = require('./src/routes/articles')

// view engine setup
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', './src/views')
app.set('layout', 'layout/main')

app.locals.dayjs = require('dayjs')
app.locals.dayjs.extend(require('dayjs/plugin/duration'));
app.locals.dayjs.extend(require('dayjs/plugin/relativeTime'))

// Request parsing
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Set up application routes
app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/articles', articleRouter)

const port = 8000

mongoose
    .connect(dbUrl)
    .then(() => {
        console.log('connected to DB...')
        app.listen(port, () => {
            console.log(`Listening for connections on http://localhost:${port}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })

app.use((error, req, res, next) => {
    res.locals.error = error;
    res.render('error', {error: error, session: req.session})
})