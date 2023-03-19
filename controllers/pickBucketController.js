
const firebase = require('../db');
const firestore = firebase.firestore();
const createPickBuckets = async (req,res,next) => {
    try {
        const data = req.body;
        await firestore.collection('pickBuckets').doc().set({data});
        res.send('Record Saved successfully');
  
    } catch (error) {
        res.status(400).send(error.message);
  
    }
  }
  

  module.exports = {
    createPickBuckets,
    
}