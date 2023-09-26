'use strict';

module.exports = ({ strapi }) => ({
  async gnd(ctx) {
    ctx.body = await strapi
      .plugin('lookup')
      .service('lookup')
      .lookupGnd(ctx.request.body.prompt);
  },
});