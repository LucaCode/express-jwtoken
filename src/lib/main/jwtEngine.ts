/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import express           = require('express');
import crypto            = require('crypto');
const jwt                = require('jsonwebtoken');
import JwtEngineOptions, {InternalJwtEngineOptions} from "./jwtEngineOptions";
import JwtToken                    from "./jwtToken";
// noinspection TypeScriptPreferShortImport
import {CookieModifierTokenEngine} from "../modifierTokenEngine/cookieModifierTokenEngine";
import ModifierTokenEngine         from "../modifierTokenEngine/modifierTokenEngine";

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
         * This method will authenticate the client by creating a JSON web token
         * and attach it to the client and the request.
         * You also can use this method to refresh a token,
         * but notice that the token payload will not be merged with the old token payload.
         * @param token
         * @return The singed token
         */
        authenticate : (token ?: Record<string,any>) => string
    }
}

export type ExpressMiddlewareFunction = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

interface SignOptions {
    algorithm ?: string,
    expiresIn ?: number | string,
    notBefore ?: number | string
}

export default class JwtEngine {

    private readonly _options : InternalJwtEngineOptions;
    private readonly _signOptions : SignOptions;
    private readonly _modifierTokenEngine : ModifierTokenEngine;

    constructor(options: JwtEngineOptions){
        this._options = JwtEngine.processOptions(options);

        this._signOptions = {
            algorithm : this._options.algorithm,
            expiresIn : this._options.expiresIn
        };
        if(this._options.notBefore){
            this._signOptions.notBefore = this._options.notBefore;
        }

        this._modifierTokenEngine = this._options.modifierTokenEngine;
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

            jwtEngine.verify(req,res);

            res.deauthenticate = () => {
                req.token = null;
                req.signedToken = null;
                jwtEngine._modifierTokenEngine.removeToken(res);
            };

            res.authenticate = (token = {}) => {
                return jwtEngine.sign(token,req,res);
            };

            next();
        };
    }

    /**
     * Sign a token.
     * @param token
     * @param req
     * @param res
     */
    sign(token : Record<string,any>, req : express.Request, res : express.Response) : string {
        const signToken = jwt.sign(token,this._options.privateKey,this._signOptions);
        req.token = token;
        req.signedToken = signToken;
        this._modifierTokenEngine.setToken(signToken,token,res);
        return signToken;
    }

    /**
     * Try to verify the singed token of an request.
     * @param req
     * @param res
     */
    verify(req : express.Request, res : express.Response) {
        const signedToken = this._modifierTokenEngine.getToken(req);
        if(signedToken !== null) {
            req.signedToken = signedToken;
            try {
                req.token = jwt.verify(signedToken,this._options.publicKey,{
                    algorithms : [this._options.algorithm]
                });
            }
            catch (e) {
                req.token = null;
                this._modifierTokenEngine.removeToken(res);
                if(typeof this._options.onNotValidToken === 'function'){
                    this._options.onNotValidToken(signedToken,req,res);
                }
            }
        }
        else {
            req.signedToken = null;
            req.token = null;
        }
    }

    /**
     * Process the JwtEngineOptions and loading default options.
     * @param options
     */
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
            algorithm : options.algorithm || 'HS256',
            expiresIn : options.expiresIn || '1 day',
            notBefore : options.notBefore,
            modifierTokenEngine : options.modifierTokenEngine || CookieModifierTokenEngine,
            onNotValidToken : options.onNotValidToken
        };
    }
}



