'use strict';

module.exports = ({ strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: 'lookup',
    plugin: 'lookup',
    type: 'text',
  });
};
