/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import express     = require('express');
import bodyParser  = require('body-parser');
const cookieParser = require('cookie-parser');
import defaultSetup      from "./router/defaultSetup";
import customSetup      from "./router/customSetup";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/1',defaultSetup);
app.use('/2',customSetup);

export default app;
