const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
    title: {
        'type': mongoose.SchemaTypes.String,
        'required': true,
    },
    url: {
        'type': mongoose.SchemaTypes.String,
        'required': true,
    },
    updated_at: {
        'type': mongoose.SchemaTypes.Date,
        'required': false,
        'default': null,
    },
    created_at: {
        'type': mongoose.SchemaTypes.Date,
        'required': true,
        'default': new Date(),
    },
    posted_by: {
        'type': mongoose.Schema.Types.ObjectId, 
        'ref': 'User'
    },
});

module.exports = mongoose.model('Article', ArticleSchema)
