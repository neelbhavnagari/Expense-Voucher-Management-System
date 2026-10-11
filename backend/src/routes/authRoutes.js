const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { validateLogin, validateRegister } = require('../validators/authValidator');

router.post('/login', validate(validateLogin), authController.login);
router.post('/register', validate(validateRegister), authController.register);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
