'use strict';

const axios = require('axios');

const suggestFields = "preferredName,*_dateOfBirth+_placeOfBirth,†_dateOfDeath+_placeOfDeath,placeOfActivity,professionOrOccupation";

module.exports = ({ strapi }) => ({

  async lookupGnd(prompt, filter) {
    try {
      const response = await axios(
        {
          url: `http://lobid.org/gnd/search?q=${prompt}&filter=${filter}&format=json:${suggestFields}&size=10`,
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
    const nzFilter = encodeURIComponent(`inCollection.id:"http://lobid.org/organisations/DE-655#!"`); // hbz network zone (nz)
    const searchAs = (searchType) => `http://lobid.org/resources/search?${searchType}=${prompt}&filter=${filter}+AND+${nzFilter}&format=json:suggest&size=10`;
    try {
      const idQueryResponse = await axios({ url: searchAs("id"), method: 'GET' });
      const nameQueryResponse = await axios({ url: searchAs("name"), method: 'GET' });
      return idQueryResponse.data.concat(nameQueryResponse.data);
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
          url: `http://quaoar1.hbz-nrw.de:1990/resources/search?q=${prompt}&filter=${filter}&format=json:suggest&size=10`,
          method: 'GET',
        })

      return response.data;
    }
    catch (err) {
      console.log("Error on rpb query")
      console.log(err)
    }

  },
  async lookupRppd(prompt, filter) {
    try {
      const response = await axios(
        {
          url: `http://rppd.lobid.org/search?q=${prompt}&filter=${filter}&format=json:${suggestFields}&size=10`,
          method: 'GET',
        })

      return response.data;
    }
    catch (err) {
      console.log("Error on RPPD query")
      console.log(err)
    }

  },

});