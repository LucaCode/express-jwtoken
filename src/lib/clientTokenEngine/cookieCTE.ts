/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ClientTokenEngine from "./clientTokenEngine";

/**
 * Engine component to modifier the token on the client by using cookies.
 * This engine requires the cookie-parser before using the JwtEngine.
 * Optionally you can pass a string in the CookieCTE.
 * This string will be used for the name of the cookie. The default name is: 'jwt'.
 */
export const CookieCTE : (cookieName ?: string) => ClientTokenEngine = (cookieName = 'jwt') => {
    return {
        /**
         * Function will try to get the token from a cookie.
         * @param req
         */
        getToken : (req : any) => {
            return req.cookies ? (
                    typeof req.cookies[cookieName] === 'string' ?
                        req.cookies[cookieName] : null
                )
                : null;
        },

        /***
         * Function will set the token with a cookie.
         * @param signToken
         * @param plainToken
         * @param res
         */
        setToken : (signToken, plainToken, res: any) => {
            if (typeof res.cookie === 'function') {
                res.cookie(cookieName, signToken);
            }
        },

        /**
         * Function will remove the token from the cookie.
         * @param res
         */
        removeToken : (res: any) => {
            if (typeof res.clearCookie === 'function') {
                res.clearCookie(cookieName);
            }
        }
    }
};

