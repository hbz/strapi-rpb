'use strict';

const axios = require('axios');

module.exports = ({ strapi }) => ({

  async lookupGnd(prompt, filter) {
    try {
      const response = await axios(
        {
          url: `http://lobid.org/gnd/search?q=${prompt}&filter=${filter}&format=json:suggest&size=3`,
          method: 'GET',
        })

      return response.data;
    }
    catch (err) {
      console.log("Error on GND query")
      console.log(err)
    }

  },
  async lookupResources(prompt, filter) {
    try {
      const response = await axios(
        {
          url: `http://lobid.org/resources/search?q=${prompt}&filter=${filter}&format=json:title&size=5`,
          method: 'GET',
        })

      return response.data;
    }
    catch (err) {
      console.log("Error on lobid-resources query")
      console.log(err)
    }

  },
  async lookupRpb(prompt, filter) {
    try {
      const response = await axios(
        {
          url: `http://quaoar1.hbz-nrw.de:1990/resources/search?q=${prompt}&filter=${filter}&format=json:title&size=5`,
          method: 'GET',
        })

      return response.data;
    }
    catch (err) {
      console.log("Error on rpb query")
      console.log(err)
    }

  },

});