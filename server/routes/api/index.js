const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/friend', require('./friend'));
router.use('/group', require('./group'));
router.use('/chat', require('./chat'));

module.exports = router;