const router = require('express').Router();

router.get('/', (req, res, next) => {
    console.log('get /test');
    return res.json('test: testData');
  });

module.exports = router;