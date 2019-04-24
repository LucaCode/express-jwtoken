/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import express                   = require('express');
import {ExpressMiddlewareFunction} from "./jwtEngine";

const block = (res : express.Response,message : string = 'Access Forbidden') => {
    res.status(403).send({
        message: message
    });
};

/**
 * Middleware for check the client is authenticated.
 * @param req
 * @param res
 * @param next
 */
export const reqAuthenticated : ExpressMiddlewareFunction = (req, res, next) => {
    if(req.token === null){
        block(res);
    }
    else {
        next();
    }
};

/**
 * Middleware for check the client is not authenticated.
 * @param req
 * @param res
 * @param next
 */
export const reqNotAuthenticated : ExpressMiddlewareFunction = (req, res, next) => {
    if(req.token === null){
        next();
    }
    else {
        block(res);
    }
};

/**
 * Middleware for check the token contains a specific key value pair.
 * Notice if the token is null the request will not be blocked!
 * @param key
 * @param value
 */
export const tokenContains : (key : string,value : any) => ExpressMiddlewareFunction
    = (key,value) => {
    return (req, res, next) => {
        if(req.token === null) {
           next();
        }
        else {
            if(req.token[key] === value) {
                next();
            }
            else {
                block(res);
            }
        }
    }
};