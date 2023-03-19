const express = require ('express');
const {createOrder, getZone,getBins} = require ('../controllers/productController');

const router = express.Router();

router.get('/products/:id',getZone);
router.get('/bins',getBins);

module.exports = {
    routes : router
}