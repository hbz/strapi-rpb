module.exports = [
  {
    method: 'POST',
    path: '/gnd',
    handler: 'lookupController.gnd',
    config: {
      policies: [],
    },
  },
];
