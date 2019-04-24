# Express-jwtoken
*Simple express JSON Web Token engine.*

<h1 align="center"> 
  <!-- Coverage -->
  <a href="https://npmjs.org/package/express-jwtoken">
    <img src="https://img.shields.io/badge/Coverage-98.18%25-brightgreen.svg" alt="Downloads"/>
  </a> 
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg" alt="API Stability"/>
  </a>
  <!-- TypeScript -->
  <a href="http://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-typescript-blue.svg" alt="TypeScript"/>
  </a>    
  <!-- Downloads -->
  <a href="https://npmjs.org/package/express-jwtoken">
    <img src="https://img.shields.io/npm/dm/express-jwtoken.svg" alt="Downloads"/>
  </a> 
  <!-- Size -->
  <a href="https://npmjs.org/package/express-jwtoken">
      <img src="https://img.shields.io/bundlephobia/min/express-jwtoken.svg" alt="Size"/>
  </a>  
</h1>

## What is Express-jwtoken?
Express-jwtoken is an extension library for express, 
that adds an authentication system which uses the [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) standard.
The significant advantage of JSON Web Tokens is that you don't need to store session information on the server, 
this makes it easy to scale your backend on more servers.

## Install

```bash
$ npm install --save express-jwtoken
```

## Usage

First, you have to set the leading middleware. 
This middleware will add functionality to the express response and request object. 
Also, it will try to get and verify the token from the request and attach the plain 
(encrypted token) to the request object. If there is no token or the token is not 
valid the assigned value will be null. You also can provide extra options as a parameter.

```js
import {jwtEngine} from "express-jwtoken";
app.use(jwtEngine());
```

### The Request object
These new properties will be added to the request object:
* `token` (`JwtToken | null`) - The plain token of the request,
                                it can be null if no singed token was provided or the singed token was not valid.
                                
* `signedToken` (`string | null`) - The singed token of the request,
                                    it can be null if no singed token was provided.

### The Response object
These new properties will be added to the response object:
* `deauthenticate` (`Function (() => void)`) - This method can be used to deauthenticate the client. 
It will tell the client to remove the token and set the token and signed token property of the request to null.

* `authenticate` (`Function ((token ?: Record<string,any>) => string)`) - This method will authenticate the client by creating a JSON Web Token and attach it to the client and the request.
You also can use this method to refresh a token, but notice that the token payload will not be merged with the old token payload. Also, it will return the new singed token.

### Options
The jwtEngine functions can take optional a jwtEngineOptions object as a parameter. 
This object can specify the following options:

* `secretKey` (`string`) - The secret key for encrypting and decrypt the token.
                           The default value is a random string.
                           Notice that this option is only used if no public and private key is defined.
                           
* `privateKey` (`string`) - The public secret key for encrypting and decrypt the token.
                            For using the public key, you also need to define the private key.
                            Otherwise, the secret key will be used.                                                    

* `publicKey` (`string`) - The private secret key for encrypting and decrypt the token.
                           For using the private key, you also need to define the public key.
                           Otherwise, the secret key will be used.     

* `expiresIn` (`string | number`) - Token expressed in seconds (number) or a string describing a time.
                                    If you use a string be sure you provide the time units (days, hours, etc),
                                    otherwise milliseconds unit is used by default ("120" is equal to "120ms").
                                    Examples: 60, "2 days", "10h", "7d".
                                    Default value is: '1 day'.   
                                    
* `notBefore` (`string | number`) - Token is not valid before seconds (number) or a string describing a time.
                                    If you use a string be sure you provide the time units (days, hours, etc),
                                    otherwise milliseconds unit is used by default ("120" is equal to "120ms").
                                    Examples: 60, "2 days", "10h", "7d".
                                    Default value is: undefined.
                                    
* `algorithm` (`string`) -  Algorithm for encrypting and decrypt the token.
                            Default value is the HS256 Algorithm.                          