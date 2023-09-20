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

  const callLookup = async (query) => {
    try {
      const response = await fetch(`/lookup/lookup`, {
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
      return result.map(r => {return {name: r.label, category:{id: "0", name: "cat-name-0"}, description: r.category, id: r.id, image: r.image}});
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
                  return callLookup(query);
                },
                onSelect: function(event) {
                    console.log("event")
                    console.log(event)
                    console.log("item")
                    console.log(event.item)
                    event.setQuery(event.item.name);
                    onChange({ target: { name, value: event.item.id, type: attribute.type } })
                },
                templates: {
                    header({ html }) {
                        return html`<span class="aa-SourceHeaderTitle">GND</span><div class="aa-SourceHeaderLine" />`;
                    },
                    noResults() {
                        return 'No GND entries for this query.';
                    },
                    item({ item, components, html }) {
                        return <SearchItem item={item} components={components} html={html}/>;
                    },
                  },
              },
              {
                sourceId: "rppd",
                getItems() {
                  return [
                      {name: "rppd-name-1", category:{id: "1", name: "cat-name-1"}, description: "desc-1", id: "id-1", image: "http://rpb.lobid.org/assets/images/wappen.png"},
                      {name: "rppd-name-2", category:{id: "1", name: "cat-name-1"}, description: "desc-2", id: "id-2", image: "http://rpb.lobid.org/assets/images/wappen.png"}];
                },
                templates: {
                    header({ html }) {
                    return html`<span class="aa-SourceHeaderTitle">RPPD</span><div class="aa-SourceHeaderLine" />`;
                    },
                    noResults() {
                        return 'No RPPD entries for this query.';
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
