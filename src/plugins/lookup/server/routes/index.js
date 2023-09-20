module.exports = [
  {
    method: 'POST',
    path: '/lookup',
    handler: 'lookupController.generate',
    config: {
      policies: [],
    },
  },
];
