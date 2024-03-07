const Article = require('../models/Article')
const createError = require('http-errors');

async function editArticle(request, response, next) {
    // render the edit page
    const id = request.params.id;

    try{
        const article = await Article.findOne({_id: id});

        if (request.session.user_id === article.posted_by.toString()) {
            response.render('../views/articles/edit', {article: article, session: request.session});
        } else {
            return next(
                createError(401, 'Unauthorized access! Is this your article?')
                );
        }
    }catch(err){
        // if anything wrong with DB connection
        res.status(500).send(err);
    }
}

function newArticle(request, response, next) {
    // render the new article page
    response.render('../views/articles/new', {session: request.session});
}

async function processNewArticle(request, response, next) {
    // save an article to the DB
    const {title, url} = request.body;
    try {
        if(request.session.user_id) {
            await Article.create({title: title, url: url, posted_by: request.session.user_id});

        } else {
            return next(
                createError(401, 'Unauthorized access! Is this your account?')
                );
        }
    } catch (error) {
        response.status(500).send(error);
    }

    request.session.successful_action = "Article successfully created";
    response.redirect('/');
}

async function processUpdateArticle(request, response, next) {
    // update an article in the DB

    const {title, url} = request.body;
    const id = request.params.id;

    try{
        const article = await Article.findOne({_id: id});
        if (request.session.user_id === article.posted_by.toString()) {
            await Article.updateOne({_id: id}, { $set: {title: title, url: url, updated_at: new Date()}});
        } else {
            return next(
                createError(401, 'Unauthorized access to edit')
                );
        }
    }catch(err) {
        response.status(500).send(err);
    }
    request.session.successful_action = "Article successfully updated";
    response.redirect('/');
}

async function processArticleDeletion(request, response, next) {
    // delete an article in the DB
    const id = request.params.id;

    try{
        const article = await Article.findOne({_id: id});
        if (request.session.user_id === article.posted_by.toString()) {
            await Article.findByIdAndDelete({_id: id});
        } else {
            return next(
                createError(401, 'Unauthorized access to delete')
                );
        }
    }catch(err) {
        response.status(500).send(err);
    }
    request.session.successful_action = "Article successfully deleted";
    response.redirect('/');

    
}

module.exports = {
    newArticle,
    editArticle,
    processNewArticle,
    processUpdateArticle,
    processArticleDeletion,
}
