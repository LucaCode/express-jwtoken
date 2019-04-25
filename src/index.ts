/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import JwtEngine                   from "./lib/main/jwtEngine";
import {reqAuthenticated,reqNotAuthenticated,reqAuthenticatedAndContains} from "./lib/main/accessChecker";
import JwtEngineOptions            from "./lib/main/jwtEngineOptions";
import ClientTokenEngine           from "./lib/clientTokenEngine/clientTokenEngine";
import {CookieCTE}                 from "./lib/clientTokenEngine/cookieCTE";
import {AuthorizationHeadersCTE}   from "./lib/clientTokenEngine/authorizationHeadersCTE";

const jwtEngine = JwtEngine.generateEngine;

export {
    jwtEngine,
    reqAuthenticated,
    reqNotAuthenticated,
    reqAuthenticatedAndContains,
    ClientTokenEngine,
    CookieCTE,
    AuthorizationHeadersCTE,
    JwtEngineOptions
};

