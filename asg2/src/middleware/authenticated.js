function authenticated(request, response, next) {
    if (request.session.user_id) next();
    else response.redirect('/login');
}

module.exports = { authenticated }
