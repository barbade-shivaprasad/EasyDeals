const {Router} = require('express')
const client = require('./client')
const router = Router();

router.use('/',client);


module.exports = router;

