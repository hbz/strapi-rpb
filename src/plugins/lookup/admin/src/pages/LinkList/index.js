/*
 *
 * LinkList
 *
 */

import React from 'react';
import { useParams } from 'react-router-dom';

const LinkList = () => {
  const { links } = useParams();
  const linksArray = decodeURIComponent(links).split(",");
  return (
    <div>
      <h1>Linkliste</h1>
      <br/>
      {linksArray.map((link, i) => {
        return (<p>{ i + 1 } <a href={ link } target="_blank" rel="noopener">{ link }</a></p>)
      })}
    </div>
  );
};

export default LinkList;
