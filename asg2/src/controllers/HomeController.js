const Article = require("../models/Article");
const createError = require('http-errors');

async function home(request, response, next) {
    try {
        const articles = await Article.find().populate('posted_by').exec();            
        
        response.render(
            'home', {
                articles: articles, 
                session: request.session
            }
        );
    } catch (error) {
       response.status(500).send(error);
    }

}

module.exports = { home };