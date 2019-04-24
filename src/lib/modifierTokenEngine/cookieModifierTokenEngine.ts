/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ModifierTokenEngine from "./modifierTokenEngine";

/**
 * Engine component to modifier the token by using cookies.
 * This engine requires the cookie-parser before using the JwtEngine.
 */
export const CookieModifierTokenEngine : ModifierTokenEngine =
{
    /**
     * Function will try to get the token from a cookie (cookies.jwtToken).
     * @param req
     */
    getToken : (req : any) => {
        return req.cookies ? (
        typeof req.cookies.jwtToken === 'string' ?
        req.cookies.jwtToken : null
        )
        : null;
    },

    /***
     * Function will set the token with a cookie (cookies.jwtToken).
     * @param signToken
     * @param plainToken
     * @param res
     */
    setToken : (signToken, plainToken, res: any) => {
        if (typeof res.cookie === 'function') {
            res.cookie('jwtToken', signToken);
        } else {
            throw new Error('Express.cookieParser is required with default get/set/remove token options.');
        }
    },

    /**
     * Function will remove the token from the cookie (cookies.jwtToken).
     * @param res
     */
    removeToken : (res: any) => {
        if (typeof res.clearCookie === 'function') {
            res.clearCookie('jwtToken');
        } else {
            throw new Error('Express.cookieParser is required with default get/set/remove token options.');
        }
    }
};
