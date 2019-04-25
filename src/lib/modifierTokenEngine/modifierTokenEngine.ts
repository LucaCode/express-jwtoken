/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import JwtToken from "./../main/jwtToken";

/**
 * Engine component to modifier the token that means set, get or remove the token from the client.
 */
export default interface ModifierTokenEngine
{
    /**
     * Function for get the signed token from the request.
     * The method can return the signed token as a string, or null if there is no signed token.
     * @param req
     */
    getToken : (req : Express.Request) => string | null,

    /**
     * Function to set the signed token to the response.
     * Will be used by the authenticate method on the response object.
     * @param signToken
     * @param plainToken
     * @param res
     */
    setToken : (signToken : string,plainToken : JwtToken,res : Express.Response) => void,

    /**
     * Function to tell the client to remove the token.
     * Will be used in the case that the provided token is not valid or
     * by calling the deauthenticate method on the response object.
     * @param signToken
     * @param res
     */
    removeToken : (res : Express.Response) => void,
}

