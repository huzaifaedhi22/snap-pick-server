const express = require ('express');
const {createPickBuckets} = require ('../controllers/pickBucketController');

const router = express.Router();
router.post('/pickBuckets',createPickBuckets);


module.exports = {
    routes : router
}