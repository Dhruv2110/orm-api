const router = require('express').Router();
const connection = require('../controllers/connection');
const authenticate = require('../middleware/auth');


router.get('/connection', authenticate, connection.loadConnections);
router.post('/saveConnection', authenticate, connection.saveConnections);
router.post('/emptyConnection', authenticate, connection.emptyConnections);

module.exports = {
    router: router,
    basePath: '/api/userRoutes'
};