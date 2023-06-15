'use strict';

/**
 * rppd router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::rppd.rppd');
