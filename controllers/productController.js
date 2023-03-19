'use strict';

const firebase = require('../db');
const Product = require('../models/product');
const Bin = require('../models/bin');
const firestore = firebase.firestore();


//to get zone of a particular item
const getZone = async(req,res,next) => {
    try {
        const id = req.params.id;
        const product = firestore.collection('Product').doc(id);
        const data = await product.get();
        if (!data.exists) {
            res.status(404).send('Product with given itemID not found');
        }
         else {
            res.send (data.data().zone );
        }
    } catch (error) {
        res.status(400).send(error.message);
    }

}

//to get itemID's of all items in an order
const getBins = async(req,res,next) => {
    try {
      
        const bin = firestore.collection('Bins');
        const data = await bin.get();
        const binArray = [];
      
        if (data.empty) {
            res.status(404).send('No Pending orders found');
        }
         else {
            data.forEach(doc => {
                const ben = new Bin(
                    doc.data().binID,
                    doc.data().flag,
                   
                );
                binArray.push(ben);
      

            });
           
            
            res.send(binArray);
          
        }
    } catch (error) {
        res.status(400).send(error.message);
    }

}








module.exports = {
    getZone,
    getBins
}
