'use strict';

const axios = require('axios');

module.exports = ({ strapi }) => ({

  async lookupGnd(prompt) {
    try {
      const response = await axios(
        {
          url: `http://lobid.org/gnd/search?q=${prompt}&format=json:suggest&size=5`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({})
        })

      return response.data;
    }
    catch (err) {
      console.log(err.response)
    }

  }

});