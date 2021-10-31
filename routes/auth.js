const router = require('express').Router();
const auth = require('../controllers/auth')

router.post('/signup',auth.signup);
router.post('/login', auth.login);
router.post('/otp', auth.otpCheck);
router.post('/token', auth.token);
router.post('/check-token', auth.checkToken);
router.post('/logout', auth.logout);

// router.get('/forgot', auth.getForgot);
router.post('/forgot', auth.postForgot);
// router.get('/reset/:token', auth.getReset);
router.post('/resetCheck', auth.postResetCheck);
router.post('/reset', auth.postReset);

module.exports = {
  router: router,
  basePath: '/api/auth'
};
