const User = require('../models/User');
const bcrypt = require('bcrypt');


/**
 * Handles a HTTP GET /register
 */
function register(request, response, next) {
    response.render('registration', { session: request.session })
}

/**
 * Handles a HTTP GET /login
 */
function login(request, response, next) {
    request.session.successful_action = null;
    response.render('login', { session: request.session })
}

/**
 * Handles a HTTP POST /register
 */
async function processRegistration(req, res, next) {
    // TODO implement registration handling
    const {username, email, password} = req.body;

    // create new user object, store to DB
    try {
        if(!username || !email || !password) {
            req.session.error_message = "cannot have any empty fields!";
            res.redirect('/register');
        } else {
            const passDigest = await bcrypt.hash(password, 13);
            const createdUser = await User.create({username: username, email: email, password: passDigest});
            req.session.user_id = createdUser._id;
            res.redirect('/');
        }
    }catch (err) {
        res.status(400).send(err);
    }
}

/**
 * Handles a HTTP POST /login
 */
async function processLogin(request, response, next) {
    // TODO handle login request/form submission
    const {email, password} = request.body;
    let validUser = null;
    let validPassword = false;
    let validCredentials = false;

    // if any empty fields
    if(!email || !password) validCredentials = false;
    else {
        // grab user by email form DB
        validUser = await User.findOne({email: email});
        // user doesn't exist in DB
        if(!validUser || null) validCredentials = false;
        else validPassword = await bcrypt.compare(password, validUser.password);
        if (!validPassword) validCredentials = false;
        else validCredentials = true;
    }

    if (validCredentials) {
        request.session.user_id = validUser._id;
        response.redirect('/');
    } else {
        request.session.error_message = 'Invalid email or password';
        response.redirect('/login');
    }

}

function processLogout(request, response) {
    // TODO: handle logout -> destroy the session, ensure the session cookie is deleted.
    request.session.destroy()
    response.clearCookie('COMP_3012_Assignment_2')
    response.redirect('/')
}

module.exports = {
    register,
    login,
    processLogin,
    processRegistration,
    processLogout,
}
