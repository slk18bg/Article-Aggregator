const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/authenticated')

const {
    editArticle,
    newArticle,
    processNewArticle,
    processUpdateArticle,
    processArticleDeletion,
} = require('../controllers/ArticleController')

router.get('/new', newArticle)

router.post('/new', processNewArticle)

router.get('/:id/edit', editArticle)

router.post('/:id/edit', processUpdateArticle)

router.post('/:id/delete', processArticleDeletion)

module.exports = router
