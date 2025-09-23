const express = require('express');
const router = express.Router();

// temporary placeholder
router.get('/', (req, res) => {
  res.send('Reviews route working');
});

module.exports = router;
