import React from 'react';
import { Typography } from '@strapi/design-system';
import { useCMEditViewDataManager } from "@strapi/helper-plugin";

const config = {
  locales: ['de'],
};

const bootstrap = (app) => {
  app.injectContentManagerComponent('editView', 'informations', {
    name: 'exact-dates',
    Component: () => (
      <Typography>
        <br/>&#10035; {date(useCMEditViewDataManager().initialData.createdAt) || '--'}
        <br/>&#9998; {date(useCMEditViewDataManager().initialData.updatedAt) || '--'}
      </Typography>
    ),
  });
};

const date = (s) => {
  return s && new Date(Date.parse(s)).toLocaleString('de-DE');
}

export default {
  config,
  bootstrap,
};
