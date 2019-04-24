/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import express           = require('express');
import crypto            = require('crypto');
const jwt                = require('jsonwebtoken');
import JwtEngineOptions, {InternalJwtEngineOptions} from "./JwtEngineOptions";
import JwtToken            from "./JwtToken";

declare module 'express-serve-static-core' {
    interface Request {
        /**
         * The token of the request.
         * It is null if no singed token was provided or the singed token was not valid.
         */
        token : JwtToken | null;

        /**
         * The signed token of the request.
         * It is null if no singed token was provided.
         */
        signedToken : string | null;
    }
    interface Response {

        /**
         * This method will tell the client with the response to remove the token
         * and will remove the token and signed token from the request.
         */
        deauthenticate : () => void

        /**
         * This method will authenticate the client by creating a JSON web token and attach it to the client and the request.
         * You also can use this method to refresh/update a token.
         * @param token
         */
        authenticate : (token : Record<string,any>) => void
    }
}

type ExpressMiddlewareFunction = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export default class JwtEngine {

    private readonly _options : InternalJwtEngineOptions;

    constructor(options: JwtEngineOptions){
        this._options = JwtEngine.processOptions(options);
    }

    /**
     * Method for creating the JwtEngine.
     * Notice that the default options will try to save and load the token from the cookies,
     * so make sure you use the cookie-parser before or use custom options.
     * @param options
     */
    static generateEngine(options: JwtEngineOptions = {}): ExpressMiddlewareFunction {
        const jwtEngine = new JwtEngine(options);

        return (req, res, next) => {

            jwtEngine.processToken(req);

            res.deauthenticate = () => {
                req.token = null;
                req.signedToken = null;
                jwtEngine.options.removeToken(res);
            }


        };
    }

    processToken(req : express.Request) {
        const signedToken = this.options.getToken(req);
        if(signedToken !== null) {
            try {
                req.signedToken = signedToken;
                req.token = jwt.verify(signedToken,this.options.publicKey);
            }
            catch (e) {

            }
        }
        else {
            req.signedToken = null;
            req.token = null;
        }
    }

    static processOptions(options: JwtEngineOptions): InternalJwtEngineOptions {

        //set the private/public keys to secret key.
        let publicKey = options.publicKey;
        let privateKey = options.privateKey;
        if (!(publicKey && privateKey)) {
            //load secret key default
            options.secretKey = options.secretKey || crypto.randomBytes(32).toString('hex');
            publicKey = options.secretKey;
            privateKey = options.secretKey;
        }

        return {
            publicKey,
            privateKey,
            getToken: options.getToken || ((req: any) => {
                return req.cookies ? (
                        typeof req.cookies.jwtToken === 'string' ?
                            req.cookies.jwtToken : null
                    )
                    : null;
            }),
            setToken: options.setToken || ((signToken, plainToken, res: any) => {
                if (typeof res.cookie === 'function') {
                    res.cookie('jwtToken', signToken);
                } else {
                    throw new Error('Express.cookieParser is required with default get/set/remove token options.');
                }
            }),
            removeToken: options.removeToken || ((res: any) => {
                if (typeof res.clearCookie === 'function') {
                    res.clearCookie('jwtToken');
                } else {
                    throw new Error('Express.cookieParser is required with default get/set/remove token options.');
                }
            })
        };
    }

    get options(): InternalJwtEngineOptions {
        return this._options;
    }
}



