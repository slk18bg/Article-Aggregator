function guest(request, response, next) {
    // TODO implement guest middleware
    if(!request.session.user_id) next();
    else response.redirect('/');
}

module.exports = { guest }
