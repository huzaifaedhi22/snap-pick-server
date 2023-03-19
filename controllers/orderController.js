'use strict';

const firebase = require('../db');
const { pickBucket } = require('../middlewares/pickBucket');
const Orders = require('../models/orders');
const firestore = firebase.firestore();
const cron = require('node-cron');



//to create a dummy order
const createOrder = async (req,res,next) => {
    try {
        const data = req.body;
        await firestore.collection('orders').doc().set(data);
        res.send('Record Saved successfully');

    } catch (error) {
        res.status(400).send(error.message);

    }
}




//to get itemID's of all items in an order
const getOrders = async(req,res,next) => {
    try {
      
        const order = firestore.collection('Orders');
        const data = await order.get();
        // const ordersArray = [];
        const itemsArray = [];
        if (data.empty) {
            res.status(404).send('No Pending orders found');
        }
         else {
            data.forEach(doc => {
                const order = new Orders(
                    doc.data().date,
                    doc.data().orderID,
                    doc.data().items,
                    itemsArray.push(doc.data().items),
                );
                    
             
               
               return itemsArray;
            

            });
            pickBucket(itemsArray);
        
          
          
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
        
    }

}

cron.schedule('*/2 * * * *', function () {
    getOrders();
  }
  );






module.exports = {
    createOrder,
    getOrders,
    
}