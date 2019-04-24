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
 * Middleware for check the client is authenticated and
 * the token contains specific key-value pairs.
 * @param contains
 */
export const reqAuthenticatedAndContains: (contains : Record<string,any>) => ExpressMiddlewareFunction
    = (contains) => {
    return (req, res, next) => {
        if(req.token === null) {
            block(res);
        }
        else {
            const token = req.token;
            let blocked = false;
            for(let key in contains) {
                if(contains.hasOwnProperty(key) &&  contains[key] !== token[key]) {
                    block(res);
                    blocked = true;
                    break;
                }
            }
            if(!blocked){
                next();
            }
        }
    }
};