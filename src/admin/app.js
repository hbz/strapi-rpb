import React from 'react';
import { Typography, Link } from '@strapi/design-system';
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

  app.injectContentManagerComponent('editView', 'informations', {
    name: 'additional-links',
    Component: () => ["article", "person", "independent-work"].find(t => useCMEditViewDataManager().slug.includes(t)) ? (
      <p>
        <br/><Link target="_blank" href={
          `${strapi.backendURL}/api/${useCMEditViewDataManager().slug.split('.').pop()}s?filters[id][$eq]=${useCMEditViewDataManager().initialData.id}&populate=*`
          }>JSON</Link>
        <br/><Link target="_blank" href={
          useCMEditViewDataManager().initialData.rppdId ?
          `https://rppd.lobid.org/${useCMEditViewDataManager().initialData.rppdId}` :
          `https://rpb.lbz-rlp.de/${useCMEditViewDataManager().initialData.rpbId}`
          }>OPAC</Link>
      </p>
    ) : (<p/>),
  });

  app.injectContentManagerComponent('editView', 'informations', {
    name: 'additional-links-authorities',
    Component: () => ["rpb-authority"].find(t => useCMEditViewDataManager().slug.includes(t)) ? (
      <p>
        <br/><Link target="_blank" href={
          `${strapi.backendURL}/api/rpb-authorities?filters[id][$eq]=${useCMEditViewDataManager().initialData.id}&populate=*`
          }>JSON</Link>
        <br/><Link target="_blank" href={
          `https://rpb.lbz-rlp.de/search?subject="${encodeURIComponent(useCMEditViewDataManager().initialData.preferredName)}"`
          }>OPAC</Link>
      </p>
    ) : (<p/>),
  });
};

const date = (s) => {
  return s && new Date(Date.parse(s)).toLocaleString('de-DE');
}

export default {
  config,
  bootstrap,
};
