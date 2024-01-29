import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { TextInput } from '@strapi/design-system/TextInput';
import { Stack } from '@strapi/design-system/Stack';
import { auth } from '@strapi/helper-plugin';

import { Autocomplete } from './autocomplete';
import SearchItem from './searchItem';
import "@algolia/autocomplete-theme-classic";

export default function Index({
  name,
  error,
  description,
  onChange,
  value,
  intlLabel,
  attribute,
}) {
  const { formatMessage } = useIntl();
  const [prompt, setPrompt] = useState('');
  const [err, setErr] = useState(''); 

  const callLookupLobid = async (path, query, logo) => {
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          'prompt': `${query}`,
        })
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();

      return result.map(r => {return {
        name: r.label,
        category: {id: "0", name: "cat-name-0"},
        description: r.category,
        id: r.id,
        image: r.image || logo}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRppd = async (path, query, logo) => {
    try {
      const response = await fetch(`${path}${query}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();

      return result.data.map(r => {return {
        name: r.attributes.f1na,
        category:{id: "0", name: "cat-name-0"},
        description: "Person",
        id: "http://rppd.lobid.org/" + r.attributes.f00_,
        image: logo}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRpbAuthorities = async (path, query, logo) => {
    try {
      const response = await fetch(`${path}${query}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();

      return result.data.map(r => {return {
        name: r.attributes.f3na,
        category:{id: "0", name: "cat-name-0"},
        description: r.attributes.f99z,
        id: "http://rpb.lobid.org/sw/" + r.attributes.f00_,
        image: logo}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRpbNotations = async (path, query, logo) => {
    try {
      const response = await fetch(`${path}${query}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();

      return result.data.map(r => {return {
        name: r.attributes.prefLabel,
        category:{id: "0", name: "cat-name-0"},
        description: r.attributes.uri.split(/#/).pop(),
        id: r.attributes.uri,
        image: logo}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const getSource = (id, lookupFun, path, logo, query) => {
    try {
      return {
        sourceId: id,
        getItems() {
          return lookupFun(path, query, logo);
        },
        onSelect: function(event) {
            console.log(`${id} item`)
            console.log(event.item)
            event.setQuery(event.item.name);
            onChange({ target: { name, value: event.item.id, type: attribute.type } })
        },
        templates: {
            header({ html }) {
                return html`<span class="aa-SourceHeaderTitle">${id}</span><div class="aa-SourceHeaderLine" />`;
            },
            noResults() {
                return `Keine ${id}-Einträge für diese Anfrage gefunden.`;
            },
            item({ item, components, html }) {
                return <SearchItem item={item} components={components} html={html}/>;
            },
          },
      };

    } catch (err) {
      setErr(err.message);
    }
  }

  return (
    <Stack spacing={1}>
        <TextInput
          placeholder="ID"
          label={name}
          name="content"
          onChange={(e) =>
            onChange({
              target: { name, value: e.target.value, type: attribute.type },
            })
          }
          value={value}
        />
      <div style={{'--aa-input-border-color-rgb': 'rgb(220, 220, 228)'}}>
          <Autocomplete
            openOnFocus={false}
            detachedMediaQuery=''
            placeholder="Nachschlagen"
            getSources={({ query }) => [
              getSource("RPPD", callLookupRppd, "http://localhost:1337/api/rppds?pagination[limit]=3&filters[f1na][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Normdaten", callLookupRpbAuthorities, "http://localhost:1337/api/rpb-authorities?pagination[limit]=3&filters[f3na][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Sachsystematik", callLookupRpbNotations, "http://localhost:1337/api/rpb-notations?pagination[limit]=3&filters[prefLabel][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Raumsystematik", callLookupRpbNotations, "http://localhost:1337/api/rpb-spatials?pagination[limit]=3&filters[prefLabel][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("GND", callLookupLobid, "http://localhost:1337/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query),
              getSource("hbz-Verbundkatalog", callLookupLobid, "http://localhost:1337/lookup/resources", "https://www.hbz-nrw.de/favicon.ico", query),
            ].filter((e) => attribute.options.source[e.sourceId])}
          />
          </div>
    </Stack>
  )
}
