const firebase = require('firebase-admin');
const config = require('./config');


const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const db = admin.initializeApp({credential: admin.credential.cert(serviceAccount)});




module.exports = db;