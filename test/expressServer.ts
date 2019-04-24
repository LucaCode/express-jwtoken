/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import express   = require('express');
import bodyParser= require('body-parser');
import {jwtEngine, reqAuthenticated, reqNotAuthenticated, tokenContains} from "../src";
const cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//use jwtEngine
app.use(jwtEngine());

//api with authenticated protection.
const normalApi = express.Router();
normalApi.use(reqAuthenticated);
normalApi.get('/data',(req,res) => {
    res.status(200).send('Secure Api');
});

//api with authenticated and token contains protection.
const adminApi = express.Router();
adminApi.use(reqAuthenticated);
adminApi.use(tokenContains('isAdmin',true));
adminApi.get('/data',(req,res) => {
    res.status(200).send('Admin Api');
});

//api with not authenticated protection.
const guestApi = express.Router();
guestApi.use(reqNotAuthenticated);
guestApi.get('/data',(req,res) => {
    res.status(200).send('Guest Api');
});

app.use('/api',normalApi);
app.use('/admin',adminApi);
app.use('/guest',guestApi);

//authenticate
app.post('/login',(req,res) => {
    res.authenticate({isAdmin : req.body.admin});
    res.status(200).send();
});

//deauthenticate
app.post('/logout',(req,res) => {
    res.deauthenticate();
    res.status(200).send();
});

export default app;
