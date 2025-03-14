// backend/routes/apiRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'API de exemplo' });
});

module.exports = router;
