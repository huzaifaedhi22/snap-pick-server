const express = require ('express');
const {createOrder,getOrders} = require ('../controllers/orderController');

const router = express.Router();
router.post('/order',createOrder);
router.get('/order',getOrders);

module.exports = {
    routes : router
}