const router = require('express').Router();
const serp = require('../controllers/serp');
const authenticate = require('../middleware/auth');

router.post('/serp', authenticate, serp.loadSerpData);

module.exports = {
    router: router,
    basePath: '/api/userRoutes'
  };