/*
 *
 * LinkList
 *
 */

import React from 'react';
import { useParams } from 'react-router-dom';

const LinkList = () => {
  const { type, ids } = useParams();
  const idsArray = ids.split(",");
  return (
    <div>
      <h1>Linkliste</h1>
      <br/>
      {idsArray.map((id, i) => {
        const link = `/admin/content-manager/collectionType/${type}/${id}`;
        return (<p>{ i + 1 } <a href={ link } target="_blank" rel="noopener">{ link }</a></p>)
      })}
    </div>
  );
};

export default LinkList;
