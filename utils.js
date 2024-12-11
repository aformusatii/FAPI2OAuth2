// jwtDecoder.js
const jwt = require('jsonwebtoken');

/**
 * Decodes a JWT token and returns its header and payload.
 * @param {string} token - The JWT token to decode.
 * @returns {Object} An object with 'header' and 'payload' properties if successful, or an error message if decoding failed.
 */
function printJwt(token) {
  try {
    if (!token) {
        console.log('No token provided');
    }
    
    const decoded = jwt.decode(token, { complete: true });

    if (decoded) {
      console.log('Header:', JSON.stringify(decoded.header, null, 2));
      console.log('Payload:', JSON.stringify(decoded.payload, null, 2))
    } else {
      console.log('Invalid token');
    }
  } catch (err) {
    console.log({ error: 'Error decoding token: ' + err.message });
  }
}

module.exports = {printJwt};