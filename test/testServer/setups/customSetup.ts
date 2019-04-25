/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import express   = require('express');
import {
    AuthorizationHeadersCTE,
    jwtEngine,
    reqAuthenticated
} from "../../../src";

const customSetup = express.Router();

//use jwtEngine
customSetup.use(jwtEngine({
    clientTokenEngine : AuthorizationHeadersCTE,

    onNotValidToken : (signedToken) => {
        //console.log('not valid token: ' + signedToken);
    },

    secretKey : 'specialSecretKey',

    notBefore : '10 ms'
}));

//api with authenticated protection.
const normalApi = express.Router();
normalApi.use(reqAuthenticated);
normalApi.get('/data',(req,res) => {
    res.status(200).send('Secure Api');
});

//authenticate
customSetup.post('/login',async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ token : (await res.authenticate())}));
});

customSetup.use('/api',normalApi);

export default customSetup;