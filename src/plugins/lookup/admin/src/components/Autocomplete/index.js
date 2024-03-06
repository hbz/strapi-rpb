import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { TextInput } from '@strapi/design-system/TextInput';
import { Link } from '@strapi/design-system/v2';
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
  const [details, setDetails] = useState(null);

  const lastSegment = (uri) => uri && uri.substring(uri.lastIndexOf("/") + 1)
  const uriFragment = (uri) => uri && uri.substring(uri.lastIndexOf("#") + 1)

  const callLookupLobid = async (path, query, filter, logo) => {
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          'prompt': `${query}`,
          'filter': `${filter}`,
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
        id: path.endsWith("rpb") ? "http://rpb.lobid.org/" + lastSegment(r.id) : r.id,
        image: r.image || logo}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRppd = async (path, query, filter, logo) => {
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

  const callLookupRpbAuthorities = async (path, query, filter, logo) => {
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

  const callLookupRpbNotations = async (path, query, filter, logo) => {
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

  const getSource = (id, lookupFun, path, logo, query, filter = "*") => {
    try {
      return {
        sourceId: id,
        getItems() {
          return lookupFun(path, query, filter, logo);
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

  useEffect(() => {
    const fetchData = async () => {
      setDetails(null)
      const supportedIdPrefixes = {
        "https://d-nb.info/gnd/": {url: `https://lobid.org/gnd/search?format=json&q=id:"${value}"`, test: (r) => r.member.length > 0, process: (r) => r.member[0].preferredName},
        "http://rppd.lobid.org/": {url: `https://rppd.lobid.org/search?format=json&q=rppdId:"${lastSegment(value)}"`, test: (r) => r.member.length > 0, process: (r) => r.member[0].preferredName},
        "http://lobid.org/resources": {url: `https://lobid.org/resources/${lastSegment(value)}.json`, test: (r) => r, process: (r) => r.title},
        "http://rpb.lobid.org": {url: `https://rpb.lobid.org/${lastSegment(value)}?format=json`, test: (r) => r.member.length > 0, process: (r) => r.member[0].title},
        "http://rpb.lobid.org/sw/": {url: `${strapi.backendURL}/api/rpb-authorities?pagination[limit]=1&filters[f00_][$eq]=${lastSegment(value)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.f3na},
        "http://purl.org/lobid/rpb": {url: `${strapi.backendURL}/api/rpb-notations?pagination[limit]=1&filters[uri][$endsWith]=${uriFragment(value)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel},
        "https://rpb.lobid.org/spatial": {url: `${strapi.backendURL}/api/rpb-spatials?pagination[limit]=1&filters[uri][$endsWith]=${uriFragment(value)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel},
        "https://w3id.org/lobid/rpb-fachgebiete/": {url: `${strapi.backendURL}/api/fachgebiete?pagination[limit]=1&filters[uri][$eq]=${value}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel}
      };
      for (const idPrefix in supportedIdPrefixes) {
        if(value && value.startsWith(idPrefix)) {
          const response = await fetch(supportedIdPrefixes[idPrefix].url);
          if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }
          const result = await response.json();
          if(supportedIdPrefixes[idPrefix].test(result)) {
            setDetails(supportedIdPrefixes[idPrefix].process(result));
          }
        }
      }
    };

    fetchData();
  }, [value]);

  return (
    <Stack spacing={1}>
        <TextInput
          placeholder="ID"
          label={intlLabel ? formatMessage(intlLabel) : name}
          name="content"
          disabled={!attribute.options.source.editable}
          onChange={(e) =>
            onChange({
              target: { name, value: e.target.value, type: attribute.type },
            })
          }
          value={value}
          hint={description && description.defaultMessage || ""}
        />
      {value && value.startsWith("http") &&
        <Link isExternal target="_top" href={value}> {details || "s. Normdatenquelle"} </Link>
      }
      <div style={{'--aa-input-background-color-rgb': '240, 240, 255', '--aa-input-border-color-rgb': '240, 240, 255'}}>
          <Autocomplete
            openOnFocus={false}
            detachedMediaQuery=''
            placeholder="Nachschlagen"
            getSources={({ query }) => [
              getSource("RPPD", callLookupRppd, strapi.backendURL + "/api/rppds?pagination[limit]=3&filters[f1na][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Normdaten", callLookupRpbAuthorities, strapi.backendURL + "/api/rpb-authorities?pagination[limit]=3&filters[f3na][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Sachsystematik", callLookupRpbNotations, strapi.backendURL + "/api/rpb-notations?pagination[limit]=3&filters[prefLabel][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Raumsystematik", callLookupRpbNotations, strapi.backendURL + "/api/rpb-spatials?pagination[limit]=3&filters[prefLabel][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Fachgebiete", callLookupRpbNotations, strapi.backendURL + "/api/fachgebiete?pagination[limit]=3&filters[prefLabel][$containsi]=", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Titeldaten", callLookupLobid, strapi.backendURL + "/lookup/rpb", "https://www.hbz-nrw.de/favicon.ico", query),
              getSource("GND", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query),
              getSource("GND-Schlagwörter", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query, "SubjectHeading"),
              getSource("GND-Geografika", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query, "PlaceOrGeographicName"),
              getSource("GND-Personen", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query, "Person"),
              getSource("hbz-Verbundkatalog", callLookupLobid, strapi.backendURL + "/lookup/resources", "https://www.hbz-nrw.de/favicon.ico", query),
            ].filter((e) => attribute.options.source[e.sourceId])}
          />
          </div>
    </Stack>
  )
}
