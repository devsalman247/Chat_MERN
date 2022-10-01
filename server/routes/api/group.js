const router = require('express').Router(), 
      Group = require('../../models/Group');

router.post('/create', (req, res, next) => {
    const group = new Group();
    console.log('Group created');
})

module.exports = router;