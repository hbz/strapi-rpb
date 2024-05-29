import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { TextInput } from '@strapi/design-system/TextInput';
import { Link } from '@strapi/design-system/v2';
import { Button, Flex } from '@strapi/design-system';
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
  const [fieldValue, setFieldValue] = useState(value || '');
  const [details, setDetails] = useState('');

  const lastSegment = (uri) => uri && uri.substring(uri.lastIndexOf("/") + 1)
  const uriFragment = (uri) => uri && uri.substring(uri.lastIndexOf("#") + 1)

  const callLookupLobid = async (path, query, filter, logo) => {
    const q = query.startsWith("http") ? `"${query}"` : query.replace(/([()\[\]!?:/])/g, "\\$1");
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          'prompt': `${q}`,
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
        id: path.endsWith("rpb") ? "http://rpb.lobid.org/" + lastSegment(r.id) : path.endsWith("rppd") ? "http://rppd.lobid.org/" + lastSegment(r.id) : r.id,
        image: r.image || logo}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRpbAuthorities = async (path, query, filter, logo) => {
    try {
      const response = await fetch(`${path}?pagination[limit]=10
&filters[$or][0][preferredName][$containsi]=${query}
&filters[$or][1][rpbId][$endsWithi]=${query}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();

      return result.data.map(r => {return {
        name: r.attributes.preferredName,
        category:{id: "0", name: "cat-name-0"},
        description: r.attributes.type,
        id: "http://rpb.lobid.org/sw/" + r.attributes.rpbId,
        image: logo}});

    } catch (err) {
      setErr(err.message);
    }
  }

  const callLookupRpbNotations = async (path, query, filter, logo) => {
    try {
      const response = await fetch(`${path}?pagination[limit]=10
&filters[$or][0][prefLabel][$containsi]=${query}
&filters[$or][1][uri][$endsWithi]=${query}`, {
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
          return lookupFun(path, encodeURIComponent(query), encodeURIComponent(filter), logo);
        },
        onSelect: function(event) {
            console.log(`${id} item`)
            console.log(event.item)
            event.setQuery(event.item.name);
            setFieldValue(event.item.id);
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
      setDetails('');
      const supportedIdPrefixes = {
        "https://d-nb.info/gnd/": {url: `https://lobid.org/gnd/search?format=json&q=id:"${fieldValue}"`, test: (r) => r.member.length > 0, process: (r) => r.member[0].preferredName},
        "http://rppd.lobid.org/": {url: `https://rppd.lobid.org/search?format=json&q=rppdId:"${lastSegment(fieldValue)}"+OR+gndIdentifier:"${lastSegment(fieldValue)}"`, test: (r) => r.member.length > 0, process: (r) => r.member[0].preferredName},
        "http://lobid.org/resources": {url: `https://lobid.org/resources/${lastSegment(fieldValue)}.json`, test: (r) => r, process: (r) => r.title},
        "http://rpb.lobid.org": {url: `https://rpb.lobid.org/${lastSegment(fieldValue)}?format=json`, test: (r) => r.member.length > 0, process: (r) => r.member[0].title},
        "http://rpb.lobid.org/sw/": {url: `${strapi.backendURL}/api/rpb-authorities?pagination[limit]=1&filters[rpbId][$eq]=${lastSegment(fieldValue)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.preferredName},
        "http://purl.org/lobid/rpb": {url: `${strapi.backendURL}/api/rpb-notations?pagination[limit]=1&filters[uri][$endsWith]=${uriFragment(fieldValue)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel},
        "https://rpb.lobid.org/spatial": {url: `${strapi.backendURL}/api/rpb-spatials?pagination[limit]=1&filters[uri][$endsWith]=${uriFragment(fieldValue)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel},
        "https://w3id.org/lobid/rpb-fachgebiete/": {url: `${strapi.backendURL}/api/fachgebiete?pagination[limit]=1&filters[uri][$eq]=${fieldValue}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel}
      };
      for (const idPrefix in supportedIdPrefixes) {
        if(fieldValue && fieldValue.startsWith(idPrefix)) {
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
  }, [fieldValue]);

  return (
    <Stack spacing={1}>
        <TextInput
          placeholder="ID"
          label={intlLabel ? formatMessage(intlLabel) : name}
          name="content"
          disabled={!attribute.options.source.editable}
          onChange={(e) => setFieldValue(e.target.value)}
          value={fieldValue && fieldValue.trim() ? fieldValue : ""}
          hint={description && description.defaultMessage || ""}
          error={error}
          required={attribute.required}
        />
      <Flex gap={1}>
        {fieldValue && fieldValue.startsWith("http") &&
          <Link isExternal target="_top" href={fieldValue}> {details || "s. Normdatenquelle"} </Link>
        }
        {fieldValue && fieldValue.trim() && !attribute.options.source.editable &&
          <Button 
            size="s"
            variant="secondary"
            onClick={() => setFieldValue(' ')}>Löschen</Button>
        }
      </Flex>
      <div style={{'--aa-input-background-color-rgb': '240, 240, 255', '--aa-input-border-color-rgb': '240, 240, 255'}}>
          <Autocomplete
            openOnFocus={false}
            detachedMediaQuery=''
            placeholder="Nachschlagen"
            getSources={({ query }) => [
              getSource("RPPD", callLookupLobid, strapi.backendURL + "/lookup/rppd", "https://rpb.lobid.org/assets/images/wappen.png", query.replace("http://rppd.lobid.org/", "")),
              getSource("RPB-Normdaten", callLookupRpbAuthorities, strapi.backendURL + "/api/rpb-authorities", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Sachsystematik", callLookupRpbNotations, strapi.backendURL + "/api/rpb-notations", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Raumsystematik", callLookupRpbNotations, strapi.backendURL + "/api/rpb-spatials", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Fachgebiete", callLookupRpbNotations, strapi.backendURL + "/api/fachgebiete", "https://rpb.lobid.org/assets/images/wappen.png", query),
              getSource("RPB-Titeldaten", callLookupLobid, strapi.backendURL + "/lookup/rpb", "https://www.hbz-nrw.de/favicon.ico", query),
              getSource("GND", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query),
              getSource("GND-Schlagwörter", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query, "type:SubjectHeading"),
              getSource("GND-Geografika", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query, "type:(PlaceOrGeographicName AND NOT BuildingOrMemorial)"),
              getSource("GND-Personen", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query, "type:Person"),
              getSource("GND-Körperschaften", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query, "type:CorporateBody"),
              getSource("GND-Berufe", callLookupLobid, strapi.backendURL + "/lookup/gnd", "https://gnd.network/Webs/gnd/SharedDocs/Downloads/DE/materialien_GNDlogoOhneSchrift_png.png?__blob=publicationFile&v=2", query, `gndSubjectCategory.id:"https://d-nb.info/standards/vocab/gnd/gnd-sc#9.4ab" AND type:SubjectHeading`),
              getSource("hbz-Verbundkatalog", callLookupLobid, strapi.backendURL + "/lookup/resources", "https://www.hbz-nrw.de/favicon.ico", query),
              getSource("hbz-Verbundkatalog-ohne-Aufsätze", callLookupLobid, strapi.backendURL + "/lookup/resources", "https://www.hbz-nrw.de/favicon.ico", query, "NOT type:Article"),
              getSource("hbz-Verbundkatalog-nur-Reihen", callLookupLobid, strapi.backendURL + "/lookup/resources", "https://www.hbz-nrw.de/favicon.ico", query, "type:Series"),
            ].filter((e) => attribute.options.source[e.sourceId])}
          />
          </div>
    </Stack>
  )
}
