const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jose = require('node-jose');
const { printJwt } = require('./utils');

// Replace with your values
const tokenEndpoint = 'http://192.168.100.3:8028/realms/master/protocol/openid-connect/token';
const clientId = 'test-app3';

const privateKeyPath = path.join(__dirname, 'keys2','keypair.pem'); // Path to your RSA private key

const publicDPOPKeyPath = path.join(__dirname, 'keys-dpop','publickey.crt'); // Path to your DPOP RSA public key
const privateDPOPKeyPath = path.join(__dirname, 'keys-dpop','keypair.pem'); // Path to your DPOP RSA private key

// ===================================================================================================================
// Function to load the private key
function loadPrivateKey() {
  return fs.readFileSync(privateKeyPath, 'utf8');
}

// Function to load the DPOP private key
function loadDPOPPrivateKey() {
  return fs.readFileSync(privateDPOPKeyPath, 'utf8');
}

// Function to load the DPOP public key
function loadDPOPPublicKey() {
  return fs.readFileSync(publicDPOPKeyPath, 'utf8');
}

// Function to convert PEM to JWK
async function pemToJwk(pem) {
  const key = await jose.JWK.asKey(pem, 'pem');
  return key.toJSON();
}

// ===================================================================================================================
// Function to create a JWT
function createJwtToken(clientId, audience) {
  const privateKey = loadPrivateKey();

  const tokenPayload = {
    iss: clientId, // Issuer
    sub: clientId, // Subject
    aud: audience, // Audience
    exp: Math.floor(Date.now() / 1000) + (60 * 5), // Expiration (5 minutes from now)
    iat: Math.floor(Date.now() / 1000), // Issued at
    jti: uuidv4() // Unique identifier
  };

  return jwt.sign(tokenPayload, privateKey, { algorithm: 'RS256' });
}

// ===================================================================================================================
// Function to create the DPoP proof with JWK
async function createDpopProof(htu, htm) {
    const privateKey = loadDPOPPrivateKey();
    const publicKeyPem = loadDPOPPublicKey();
  
    const jwk = await pemToJwk(publicKeyPem);
    //console.log('jwk', jwk);
  
    const dpopPayload = {
      jti: uuidv4(),                      // Unique identifier for the JWT
      htm: htm,                           // HTTP method
      htu: htu,                           // URI
      iat: Math.floor(Date.now() / 1000), // Issued at
    };
  
    const signedToken = jwt.sign(dpopPayload, privateKey, {
      algorithm: 'RS256',
      header: {
        jwk: jwk,                          // Include JWK in header
        typ: 'dpop+jwt'
      }
    });

    return signedToken;
  }

// ===================================================================================================================
// Function to get the access token
async function getAccessToken() {
  const jwtBearerToken = createJwtToken(clientId, tokenEndpoint);
  const dpopProof = await createDpopProof(tokenEndpoint, 'POST');

  try {
    const response = await axios.post(tokenEndpoint, `grant_type=client_credentials&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${jwtBearerToken}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'DPoP': dpopProof
      }
    });

    console.log('Response:', response.data);
    printJwt(response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
  }
}

// Execute the function to get the access token
getAccessToken();