/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ClientTokenEngine from "./clientTokenEngine";

/**
 * Engine component to get the token from the client by using HTTP authorization headers.
 */
export const AuthorizationHeadersCTE : ClientTokenEngine =
    {
        /**
         * The function will try to get the token from the HTTP authorization headers.
         * @param req
         */
        getToken : (req : any) => {
            if(req.headers && req.headers.authorization) {
                const parts = req.headers.authorization.split(' ');
                //part[0] is scheme, part[1] is credentials.
                if(parts.length == 2 && /^Bearer$/i.test(parts[0])) {
                    return parts[1];
                }
            }
            return null;
        },

        /***
         * The set token is not handled here.
         */
        setToken : () => {},

        /**
         * The remove token is not handled here.
         */
        removeToken : () => {}
    };
