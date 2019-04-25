/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ClientTokenEngine from "../clientTokenEngine/clientTokenEngine";

export default interface JwtEngineOptions {

    /**
     * The secret key for encrypting and decrypt the token.
     * The default value is a random string.
     * Notice that this option is only used if no public and private key is defined.
     */
    secretKey ?: string,

    /**
     * The private secret key for encrypting and decrypt the token.
     * For using the private key, you also need to define the public key.
     * Otherwise, the secret key will be used.
     */
    privateKey ?: string,

    /**
     * The public secret key for encrypting and decrypt the token.
     * For using the public key, you also need to define the private key.
     * Otherwise, the secret key will be used.
     */
    publicKey ?: string,

    /**
     * Engine component to modifier the token on the client that means set get or remove the token from the client.
     * @default is the CookieCTE which requires the cookie-parser before using the JwtEngine.
     */
    clientTokenEngine ?: ClientTokenEngine,

    /**
     * Event function that gets invoked when a client signed token is not valid.
     * @param signToken
     * @param req
     * @param res
     */
    onNotValidToken ?: (signedToken : string,req : Express.Request,res : Express.Response) => void | Promise<void>;

    /**
     * Token expressed in seconds (number) or a string describing a time.
     * If you use a string be sure you provide the time units (days, hours, etc),
     * otherwise milliseconds unit is used by default ("120" is equal to "120ms").
     * @example
     * 60, "2 days", "10h", "7d".
     * @default '1 day'
     */
    expiresIn ?: string | number,

    /**
     * Token is not valid before seconds (number) or a string describing a time.
     * If you use a string be sure you provide the time units (days, hours, etc),
     * otherwise milliseconds unit is used by default ("120" is equal to "120ms").
     * @example
     * 60, "2 days", "10h", "7d".
     * @default undefined
     */
    notBefore ?: string | number,

    /**
     * Algorithm for encrypting and decrypt the token.
     * @default HS256 Algorithm.
     */
    algorithm ?:  string,
}

export interface InternalJwtEngineOptions extends JwtEngineOptions {
    privateKey : string,
    publicKey : string,
    algorithm :  string,
    expiresIn : string | number,
    clientTokenEngine : ClientTokenEngine,
    onNotValidToken : (signedToken : string,req : Express.Request,res : Express.Response) => void
}