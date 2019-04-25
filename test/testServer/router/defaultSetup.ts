/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import express   = require('express');
import {jwtEngine, reqAuthenticated, reqAuthenticatedAndContains, reqNotAuthenticated} from "../../../src";

const defaultSetup = express.Router();

//use jwtEngine
defaultSetup.use(jwtEngine());

//api with authenticated protection.
const normalApi = express.Router();
normalApi.use(reqAuthenticated);
normalApi.get('/data',(req,res) => {
    res.status(200).send('Secure Api');
});

//api with authenticated and token contains protection.
const adminApi = express.Router();
adminApi.use(reqAuthenticatedAndContains({isAdmin : true}));
adminApi.get('/data',(req,res) => {
    res.status(200).send('Admin Api');
});

//api with not authenticated protection.
const guestApi = express.Router();
guestApi.use(reqNotAuthenticated);
guestApi.get('/data',(req,res) => {
    res.status(200).send('Guest Api');
});

defaultSetup.use('/api',normalApi);
defaultSetup.use('/admin',adminApi);
defaultSetup.use('/guest',guestApi);

//authenticate
defaultSetup.post('/login',(req, res) => {
    res.authenticate({isAdmin : req.body.admin});
    res.status(200).send();
});

//deauthenticate
defaultSetup.post('/logout',(req, res) => {
    res.deauthenticate();
    res.status(200).send();
});

export default defaultSetup;