const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Replace with your values
const tokenEndpoint = 'http://192.168.100.3:8028/realms/master/protocol/openid-connect/token';
const clientId = 'test-app2';
const privateKeyPath = path.join(__dirname, 'keys','keypair.pem'); // Path to your RSA private key

// Function to load the private key
function loadPrivateKey() {
  return fs.readFileSync(privateKeyPath, 'utf8');
}

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

// Function to get the access token
async function getAccessToken() {
  const jwtBearerToken = createJwtToken(clientId, tokenEndpoint);

  console.log('jwtBearerToken:', jwtBearerToken);

  try {
    const response = await axios.post(tokenEndpoint, `grant_type=client_credentials&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${jwtBearerToken}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Response:', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
  }
}

// Execute the function to get the access token
getAccessToken();