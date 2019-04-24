/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import JwtEngine from "./lib/jwtEngine";
import {reqAuthenticated,reqNotAuthenticated,reqAuthenticatedAndContains} from "./lib/accessChecker";
import JwtEngineOptions from "./lib/jwtEngineOptions";

const jwtEngine = JwtEngine.generateEngine;

export {
    jwtEngine,
    reqAuthenticated,
    reqNotAuthenticated,
    reqAuthenticatedAndContains,
    JwtEngineOptions
};

