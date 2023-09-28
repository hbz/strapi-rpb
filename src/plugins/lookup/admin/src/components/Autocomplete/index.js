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

  const callLookupGnd = async (query) => {
    try {
      const response = await fetch(`/lookup/gnd`, {
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
        image: r.image || "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2"}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRppd = async (query) => {
    try {
      const response = await fetch(`/api/rppds?pagination[limit]=3&filters[f1na][$containsi]=${query}`, {
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
        id: r.attributes.f00_,
        image: "http://rpb.lobid.org/assets/images/wappen.png"}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRpbAuthorities = async (query) => {
    try {
      const response = await fetch(`/api/rpb-authorities?pagination[limit]=3&filters[f3na][$containsi]=${query}`, {
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
        id: r.attributes.f00_,
        image: "http://rpb.lobid.org/assets/images/wappen.png"}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRpbNotations = async (type, query) => {
    try {
      const response = await fetch(`/api/${type}?pagination[limit]=3&filters[prefLabel][$containsi]=${query}`, {
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
        image: "http://rpb.lobid.org/assets/images/wappen.png"}});

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
              {
                sourceId: "gnd",
                getItems() {
                  return callLookupGnd(query);
                },
                onSelect: function(event) {
                    console.log("GND item")
                    console.log(event.item)
                    event.setQuery(event.item.name);
                    onChange({ target: { name, value: event.item.id, type: attribute.type } })
                },
                templates: {
                    header({ html }) {
                        return html`<span class="aa-SourceHeaderTitle">GND</span><div class="aa-SourceHeaderLine" />`;
                    },
                    noResults() {
                        return 'Keine GND-Einträge für diese Anfrage gefunden.';
                    },
                    item({ item, components, html }) {
                        return <SearchItem item={item} components={components} html={html}/>;
                    },
                  },
              },
              {
                sourceId: "rppd",
                getItems() {
                  return callLookupRppd(query);
                },
                onSelect: function(event) {
                  console.log("RPPD item")
                  console.log(event.item)
                  event.setQuery(event.item.name);
                  onChange({ target: { name, value: event.item.id, type: attribute.type } })
              },
                templates: {
                    header({ html }) {
                    return html`<span class="aa-SourceHeaderTitle">RPPD</span><div class="aa-SourceHeaderLine" />`;
                    },
                    noResults() {
                        return 'Keine RPPD-Einträge für diese Anfrage gefunden.';
                    },
                    item({ item, components, html }) {
                        return <SearchItem item={item} components={components} html={html}/>;
                    }
                }
              },
              {
                sourceId: "rpb-authorities",
                getItems() {
                  return callLookupRpbAuthorities(query);
                },
                onSelect: function(event) {
                  console.log("rpb-authorities item")
                  console.log(event.item)
                  event.setQuery(event.item.name);
                  onChange({ target: { name, value: event.item.id, type: attribute.type } })
              },
                templates: {
                    header({ html }) {
                    return html`<span class="aa-SourceHeaderTitle">RPB-Normdaten</span><div class="aa-SourceHeaderLine" />`;
                    },
                    noResults() {
                        return 'Keine RPB-Normdaten für diese Anfrage gefunden.';
                    },
                    item({ item, components, html }) {
                        return <SearchItem item={item} components={components} html={html}/>;
                    }
                }
              },
              {
                sourceId: "rpb-notations",
                getItems() {
                  return callLookupRpbNotations("rpb-notations", query);
                },
                onSelect: function(event) {
                  console.log("rpb-notations item")
                  console.log(event.item)
                  event.setQuery(event.item.name);
                  onChange({ target: { name, value: event.item.id, type: attribute.type } })
              },
                templates: {
                    header({ html }) {
                    return html`<span class="aa-SourceHeaderTitle">RPB-Sachsystematik</span><div class="aa-SourceHeaderLine" />`;
                    },
                    noResults() {
                        return 'Keine RPB-Sachsystematik-Einträge für diese Anfrage gefunden.';
                    },
                    item({ item, components, html }) {
                        return <SearchItem item={item} components={components} html={html}/>;
                    }
                }
              },
              {
                sourceId: "rpb-spatials",
                getItems() {
                  return callLookupRpbNotations("rpb-spatials", query);
                },
                onSelect: function(event) {
                  console.log("rpb-notations item")
                  console.log(event.item)
                  event.setQuery(event.item.name);
                  onChange({ target: { name, value: event.item.id, type: attribute.type } })
              },
                templates: {
                    header({ html }) {
                    return html`<span class="aa-SourceHeaderTitle">RPB-Raumsystematik</span><div class="aa-SourceHeaderLine" />`;
                    },
                    noResults() {
                        return 'Keine RPB-Raumsystematik-Einträge für diese Anfrage gefunden.';
                    },
                    item({ item, components, html }) {
                        return <SearchItem item={item} components={components} html={html}/>;
                    }
                }
              },
            ]}
          />
          </div>
    </Stack>
  )
}
