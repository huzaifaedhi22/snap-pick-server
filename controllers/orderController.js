'use strict';

const firebase = require('../db');
const { pickBucket } = require('../middlewares/pickBucket');
const Orders = require('../models/orders');
const firestore = firebase.firestore();
const cron = require('node-cron');
const { getBins } = require('./productController');



//to create a dummy order
const createOrder = async (req,res,next) => {
    try {
        const data = req.body;
        await firestore.collection('Orders').doc().set(data);
        res.send('Record Saved successfully');
        

    } catch (error) {
        res.status(400).send(error.message);
    }
}

//to get itemID's of all items in an order
const getOrders = async(req,res,next) => {
    let freeBins = 0;
  
    try {
        const bin = firestore.collection('Bins').where('orderID' ,'==', '');
        bin.get()
  .then((querySnapshot) => {
    freeBins = querySnapshot.size;
    console.log(`Number of documents matching the query: ${freeBins}`);
  })
  .catch((error) => {
    console.log('Error getting documents: ', error);
  });
        
        let order = firestore.collection('Orders').where('status','==','pending').limit(freeBins);
        let data = await order.get();
        let itemsArray = [];
        let ordersArray = [];
        if (data.empty) {
            res.status(404).send('No Pending orders found');
        }
         else {
        
            data.forEach(doc => {
                let order = new Orders(
                    doc.data().date,
                    doc.data().orderID,
                    doc.data().items,
                    itemsArray.push(doc.data().items),
                    ordersArray.push(doc.data().orderID),
                    console.log(ordersArray),
                );

            for(let i=0;i<ordersArray.length;i++) {
                firestore.collection('Orders').doc(ordersArray[i]).update({'status':'picking'})
            }
               return itemsArray;
            });            
            getBins(ordersArray);
            pickBucket(itemsArray);
          
        
        }
    } catch (error) {
        console.log(error.message);
        // res.status(400).send(error.message);
    }
}



cron.schedule('*/5 * * * *', function () {
    getOrders();
  }
  );


module.exports = {
    createOrder,
    getOrders,
    
}