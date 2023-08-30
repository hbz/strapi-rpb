'use strict';

/**
 * independent-work service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::independent-work.independent-work');
