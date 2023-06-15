'use strict';

/**
 * rppd service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rppd.rppd');
