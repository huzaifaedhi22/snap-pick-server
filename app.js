

'use strict';

const express = require('express');
const cors = require ('cors');
const bodyParser = require ('body-parser');
const config = require ('./config');
const orderRoutes = require ('./routes/order-routes');
const productRoutes = require ('./routes/product-routes');
const { getZone,getBins} = require('./controllers/productController');
const { getOrders } = require('./controllers/orderController');
const {pickBucket} = require ('./middlewares/pickBucket');
const bucketRoutes = require('./routes/bucket-routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api',orderRoutes.routes);
app.use('/api',productRoutes.routes);
app.use('/api',bucketRoutes.routes);








app.listen(config.port,()=>console.log("App is listening on url http://localhost:" + config.port))




