import React from 'react';
import { Typography, Link, Button } from '@strapi/design-system';
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import { useSelector } from "react-redux";

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
          `https://rpb.lbz-rlp.de/search?q="${encodeURIComponent(useCMEditViewDataManager().initialData.preferredName)}"`
          }>OPAC</Link>
      </p>
    ) : (<p/>),
  });

  app.injectContentManagerComponent('listView', 'actions', {
    name: 'export',
    Component: () => {
      const state = useSelector((state) => state);
      return <Button variant='tertiary' onClick={() => {
        const listView = state["content-manager_listView"];
        const type = listView.contentType.uid;
        const ids = listView.data.map(item => item.id);
        window.open(`/admin/plugins/lookup/list/${type}/${ids}`, '_blank', 'noopener');
      }}>Linkliste</Button>;
    }
  });
};

const date = (s) => {
  return s && new Date(Date.parse(s)).toLocaleString('de-DE');
}

export default {
  config,
  bootstrap,
};
