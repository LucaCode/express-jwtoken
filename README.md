# Express-jwtoken
*Simple express JSON Web Token library.*

<h1 align="center"> 
  <!-- Coverage -->
  <a href="https://npmjs.org/package/express-jwtoken">
    <img src="https://img.shields.io/badge/Coverage-100%25-brightgreen.svg" alt="Downloads"/>
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
**Express-jwtoken** is an extension library for express, 
that adds an authentication system which uses the [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) standard.
The significant advantage of JSON Web Tokens is that you don't need to store session information on the server, 
this makes it easy to scale your backend on more servers.

## Install

```bash
$ npm install --save express-jwtoken
```

## Usage

First, you have to set the jwtEngine middleware. 
This middleware will add functionality to the express response and request object. 
Also, it will try to get and verify the token from the request and attach the plain 
(decrypted token) to the request object. If there is no token or the token is not 
valid the assigned value will be null. You also can provide extra options as a parameter.

>Notice that the engine with the default options will use cookies to set, get or remove the signed token from a client. 
So make sure that you use the **cookie-parser** before using the JwtEngine if you don't provide custom options.

```typescript
import {jwtEngine} from "express-jwtoken";
import express = require('express');

const app = express();

//If using the default options
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//jwtEngine middleware
app.use(jwtEngine(options));
```

### The Request object
These new properties will be added to the request object:
* `token` (`JwtToken | null`) - The plain token of the request,
                                it can be null if no singed token was provided or the singed token was not valid.
                                
* `signedToken` (`string | null`) - The singed token of the request,
                                    it can be null if no singed token was provided.

### The Response object
These new properties will be added to the response object:
* `deauthenticate` (`Function (() => Promise<void>)`) - This method can be used to deauthenticate the client. 
It will tell the client to remove the token and set the token and signed token property of the request to null.

* `authenticate` (`Function ((token ?: Record<string,any>) => Promise<string>)`) - This method will authenticate the client by creating a JSON Web Token and attach it to the client and the request.
You also can use this method to refresh a token, but notice that the token payload will not be merged with the old token payload. Also, it will return the new singed token.

### Options
The jwtEngine function can take optional a jwtEngineOptions object as a parameter. 
This object can specify the following options:

* `clientTokenEngine` (`ClientTokenEngine`) - The ClientTokenEngine (CTE) is the engine component to modifier the token on the client that means set get or remove the token from the client.
                                                  Default is the CookieCTE (with cookie name 'jwt') which requires the **cookie-parser** before using the JwtEngine. 
                                                  This engine will use a cookie to set, get or remove the signed token from the client.

* `secretKey` (`string`) - The secret key for encrypting and decrypt the token.
                           The default value is a random string.
                           Notice that this option is only used if no public and private key is defined.
                           
* `privateKey` (`string`) - The private secret key for encrypting and decrypt the token.
                            For using the private key, you also need to define the public key.
                            Otherwise, the secret key will be used.                        

* `publicKey` (`string`) - The public secret key for encrypting and decrypt the token.
                           For using the public key, you also need to define the private key.
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
                            
* `onNotValidToken` (`Function ((signedToken : string,req : Request,res : Response) => void | Promise<void>)`) - 
Event function that gets invoked when a client signed token is not valid.  

### ClientTokenEngine (CTE)
The ClientTokenEngine (CTE) will be used to set get or remove the token from the client.
This library has two predefined CTE's:

* `CookieCTE` - This is the default CTE which requires the **cookie-parser** before using the JwtEngine. 
This engine will use a cookie to set, get or remove the signed token from the client.

> Notice that the CookieCTE is not directly a ClientTokenEngine. 
Instead, it is a function that returns a CTE. 
That gives you the possibility to change the name of the cookie variable. 
If you don't provide a cookie name than 'jwt' will be used as a cookie name.
                                
* `AuthorizationHeadersCTE` - This engine will use the HTTP authorization headers to get the token from the client. 
The set or remove of the singed token must be handled by yourself.

You can use one of these, modifier them or create your own engine by creating an object with these following properties:

>Notice that the module also exports a typescript interface for this.

* `getToken` (`Function ((req : Request) => Promise<string | null> | string | null)`) - Function to get the signed token from the client by using the request object.
                                The method can return the signed token as a string, or null if there is no signed token.
                                
* `setToken` (`Function ((signToken : string,plainToken : JwtToken,res : Response) => Promise<void> | void)`) - 
Function to set the token to the client.
Will be used by the authenticate method on the response object.

* `removeToken` (`Function ((res : Response) => Promise<void> | void)`) - Function to tell the client to remove the token. 
Will be used in the case that the provided token is not valid or by calling the deauthenticate method on the response object.

### Check Access  

For checking the access, you can create your own middleware functions that make use of the plain token on the request object.
You also can use these predefined middleware function from this library:

#### reqAuthenticated      

This middleware function will check if the client is authenticated with a token. Otherwise, 
it will block the request with a 403 HTTP status code.

```typescript
import {reqAuthenticated} from "express-jwtoken";
import express = require('express');

const api = express.Router();

api.use(reqAuthenticated);  
```

#### reqNotAuthenticated      

This middleware function will check if the client is not authenticated. Otherwise, 
it will block the request with a 403 HTTP status code.

```typescript
import {reqNotAuthenticated} from "express-jwtoken";
import express = require('express');

const api = express.Router();

api.use(reqNotAuthenticated);  
```
                           
#### reqAuthenticatedAndContains     

This middleware function will check if the client is authenticated and the token contains specific key-value pairs. 
Otherwise, it will block the request with a 403 HTTP status code.

```typescript
import {reqAuthenticatedAndContains} from "express-jwtoken";
import express = require('express');

const api = express.Router();

api.use(reqAuthenticatedAndContains({userGroup : 'admin'}));  
```
         
## License

MIT License

Copyright (c) 2019 Luca Scaringella

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.                                                      