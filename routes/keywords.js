const router = require('express').Router();
const keywords = require('../controllers/keywords');
const authenticate = require('../middleware/auth');

router.get('/keywords', authenticate, keywords.loadKeywords);
router.post('/saveKeywords' , authenticate , keywords.saveKeywords);

module.exports = {
    router: router,
    basePath: '/api/userRoutes'
  };