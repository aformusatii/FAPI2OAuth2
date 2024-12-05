const axios = require('axios');
const qs = require('qs');

// Replace with your values
const tokenEndpoint = 'http://192.168.100.3:8028/realms/master/protocol/openid-connect/token';
const clientId = 'test-app1';
const clientSecret = 'ysid0qrTziBTMKQwBNBqKGmRCLGxrJAB';

// Function to get the access token
async function getAccessToken() {
  const tokenData = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  };

  try {
    const response = await axios.post(tokenEndpoint, qs.stringify(tokenData), {
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