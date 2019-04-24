/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import JwtEngine from "./lib/jwtEngine";
import {reqAuthenticated,reqNotAuthenticated,tokenContains} from "./lib/accessChecker";

const jwtEngine = JwtEngine.generateEngine;

export {
    jwtEngine,
    reqAuthenticated,
    reqNotAuthenticated,
    tokenContains
};

