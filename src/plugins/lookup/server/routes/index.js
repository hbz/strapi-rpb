module.exports = [
  {
    method: 'POST',
    path: '/gnd',
    handler: 'lookupController.gnd',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/resources',
    handler: 'lookupController.resources',
    config: {
      policies: [],
    },
  },
];
