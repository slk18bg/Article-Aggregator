function authenticated(request, response, next) {
    // TODO implement authenticated middleware
    if (request.session.user_id) next();
    else response.redirect('/login');
}

module.exports = { authenticated }
