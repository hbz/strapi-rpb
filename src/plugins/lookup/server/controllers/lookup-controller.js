'use strict';

module.exports = ({ strapi }) => ({
  async generate(ctx) {
    ctx.body = await strapi
      .plugin('lookup')
      .service('lookup')
      .lookupGnd(ctx.request.body.prompt);
  },
});