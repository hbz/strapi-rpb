'use strict';

const axios = require('axios');

module.exports = ({ strapi }) => ({

  async lookupGnd(prompt) {
    try {
      const response = await axios(
        {
          url: `http://lobid.org/gnd/search?q=${prompt}&format=json:suggest&size=3`,
          method: 'GET',
        })

      return response.data;
    }
    catch (err) {
      console.log("Error on GND query")
      console.log(err)
    }

  },
  async lookupResources(prompt) {
    try {
      const response = await axios(
        {
          url: `http://lobid.org/resources/search?q=${prompt}&format=json:title&size=3`,
          method: 'GET',
        })

      return response.data;
    }
    catch (err) {
      console.log("Error on lobid-resources query")
      console.log(err)
    }

  },

});