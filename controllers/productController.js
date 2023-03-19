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

async function getBins (itemsArray) {
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
                    doc.data().orderID,
                );
                binArray.push(ben);
                console.log('In Bin Array');
                
      

            });
            console.log('From Get Bins');
            console.log(binArray);
            console.log(itemsArray);

            let index = 0;
        for (let bin of binArray) {
        if (bin.orderID === '' && index < itemsArray.length) {
            bin.orderID = itemsArray[index];
            index++;
        } else {
            // index++;
        }
        }

        binArray.forEach(bin => {
            firestore.collection('Bins').doc(bin.binID).update({'orderID' : bin.orderID});
            console.log(`Updated order ID for bin ${bin.binID}: ${bin.orderID}`);
        
        });

        console.log('After updating');
        console.log(binArray);
            res.send(binArray);
        }
    } catch (error) {
        console.log(error.message);
    }


}











module.exports = {
    getZone,
    getBins
}
