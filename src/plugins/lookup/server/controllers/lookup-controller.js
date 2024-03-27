'use strict';

module.exports = ({ strapi }) => ({
  async gnd(ctx) {
    ctx.body = await strapi
      .plugin('lookup')
      .service('lookup')
      .lookupGnd(ctx.request.body.prompt, ctx.request.body.filter);
  },
  async resources(ctx) {
    ctx.body = await strapi
      .plugin('lookup')
      .service('lookup')
      .lookupResources(ctx.request.body.prompt, ctx.request.body.filter);
  },
  async rpb(ctx) {
    ctx.body = await strapi
      .plugin('lookup')
      .service('lookup')
      .lookupRpb(ctx.request.body.prompt, ctx.request.body.filter);
  },
  async rppd(ctx) {
    ctx.body = await strapi
      .plugin('lookup')
      .service('lookup')
      .lookupRppd(ctx.request.body.prompt, ctx.request.body.filter);
  },
});