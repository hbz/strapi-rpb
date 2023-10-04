'use strict';

module.exports = ({ strapi }) => ({
  async gnd(ctx) {
    ctx.body = await strapi
      .plugin('lookup')
      .service('lookup')
      .lookupGnd(ctx.request.body.prompt);
  },
  async resources(ctx) {
    ctx.body = await strapi
      .plugin('lookup')
      .service('lookup')
      .lookupResources(ctx.request.body.prompt);
  },
});