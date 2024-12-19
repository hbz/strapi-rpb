'use strict';

/**
 * external-record service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::external-record.external-record');
