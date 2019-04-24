/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import JwtToken from "./jwtToken";

export default interface JwtEngineOptions {

    /**
     * The secret key for encrypting and decrypt the token.
     * The default value is a random string.
     * Notice that this option is only used if no public and private key is defined.
     */
    secretKey ?: string,

    /**
     * The public secret key for encrypting and decrypt the token.
     * For using the public key, you also need to define the private key.
     * Otherwise, the secret key will be used.
     */
    privateKey ?: string,

    /**
     * The private secret key for encrypting and decrypt the token.
     * For using the private key, you also need to define the public key.
     * Otherwise, the secret key will be used.
     */
    publicKey ?: string,

    /**
     * Function for get the signed token from the request.
     * Default function will try to get the token from a cookie (cookies.jwtToken),
     * so the cookie-parser is required before using the JwtEngine.
     * @param req
     */
    getToken ?: (req : Express.Request) => string | null,

    /**
     * Function to set the signed token to the response.
     * Default function will set the token with a cookie (cookies.jwtToken),
     * so the cookie-parser is required before using the JwtEngine.
     * @param signToken
     * @param res
     */
    setToken ?: (signToken : string,plainToken : JwtToken,res : Express.Response) => void,

    /**
     * Function to tell the response to remove the token.
     * Default function will remove the token from the cookie (cookies.jwtToken),
     * so the cookie-parser is required before using the JwtEngine.
     * @param signToken
     * @param res
     */
    removeToken ?: (res : Express.Response) => void,

    /**
     * Event function that gets invoked when a client signed token is not valid.
     * @param signToken
     * @param req
     * @param res
     */
    onNotValidToken ?: (signedToken : string,req : Express.Request,res : Express.Response) => void;

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
    getToken : (req : Express.Request) => string | null,
    setToken : (signToken : string,plainToken : JwtToken,res : Express.Response) => void,
    removeToken : (res : Express.Response) => void,
    privateKey : string,
    publicKey : string,
    algorithm :  string,
    expiresIn : string | number
}