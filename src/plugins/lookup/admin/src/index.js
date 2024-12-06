import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import { Typography, Link, Button } from '@strapi/design-system';
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import { useSelector } from "react-redux";

const name = pluginPkg.strapi.name;
const date = (s) => {
  return s && new Date(Date.parse(s)).toLocaleString('de-DE');
}
export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
    app.customFields.register({
      name: "lookup",
      pluginId: "lookup",
      type: "text",
      intlLabel: {
        id: "lookup.lookup.label",
        defaultMessage: "Lookup / ID-Suche",
      },
      intlDescription: {
        id: "lookup.lookup.description",
        defaultMessage: "Feld mit Suchvorschlägen für ID-Auswahl",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import(/* webpackChunkName: "input-component" */ "./components/Autocomplete"),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: "lookup.sources.rlp",
              defaultMessage: "RLP-Normdaten",
            },
            items: [
              {
                intlLabel: {
                  id: "lookup.sources.RPPD",
                  defaultMessage: "RPPD",
                },
                name: "options.source.RPPD",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.RPB-Normdaten",
                  defaultMessage: "RPB-Normdaten",
                },
                name: "options.source.RPB-Normdaten",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.RPB-Sachsystematik",
                  defaultMessage: "RPB-Sachsystematik",
                },
                name: "options.source.RPB-Sachsystematik",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.RPB-Raumsystematik",
                  defaultMessage: "RPB-Raumsystematik",
                },
                name: "options.source.RPB-Raumsystematik",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.RPB-Fachgebiete",
                  defaultMessage: "RPB-Fachgebiete",
                },
                name: "options.source.RPB-Fachgebiete",
                type: "checkbox",
              },
            ],
          },
          {
            sectionTitle: {
              id: "lookup.sources.gnd",
              defaultMessage: "GND-Normdaten",
            },
            items: [
              {
                intlLabel: {
                  id: "lookup.sources.GND",
                  defaultMessage: "GND",
                },
                name: "options.source.GND",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.GND-Schlagwörter",
                  defaultMessage: "GND-Schlagwörter",
                },
                name: "options.source.GND-Schlagwörter",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.GND-Geografika",
                  defaultMessage: "GND-Geografika",
                },
                name: "options.source.GND-Geografika",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.GND-Personen",
                  defaultMessage: "GND-Personen",
                },
                name: "options.source.GND-Personen",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.GND-Berufe",
                  defaultMessage: "GND-Berufe",
                },
                name: "options.source.GND-Berufe",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.GND-Körperschaften",
                  defaultMessage: "GND-Körperschaften",
                },
                name: "options.source.GND-Körperschaften",
                type: "checkbox",
              },
            ],
          },
          {
            sectionTitle: {
              id: "lookup.sources.titles",
              defaultMessage: "Titeldaten",
            },
            items: [
              {
                intlLabel: {
                  id: "lookup.sources.hbz-Verbundkatalog",
                  defaultMessage: "hbz-Verbundkatalog",
                },
                name: "options.source.hbz-Verbundkatalog",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.RPB-Titeldaten",
                  defaultMessage: "RPB-Titeldaten",
                },
                name: "options.source.RPB-Titeldaten",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.hbz-Verbundkatalog-ohne-Aufsätze",
                  defaultMessage: "hbz-Verbundkatalog (ohne Aufsätze)",
                },
                name: "options.source.hbz-Verbundkatalog-ohne-Aufsätze",
                type: "checkbox",
              },
              {
                intlLabel: {
                  id: "lookup.sources.hbz-Verbundkatalog-nur-Reihen",
                  defaultMessage: "hbz-Verbundkatalog (nur Reihen)",
                },
                name: "options.source.hbz-Verbundkatalog-nur-Reihen",
                type: "checkbox",
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: "lookup.textfield",
              defaultMessage: "Textfeld",
            },
            items: [
              {
                intlLabel: {
                  id: "lookup.editable",
                  defaultMessage: "Werte manuell editierbar",
                },
                name: "options.editable",
                type: "checkbox",
              },
            ]
          },
          {
            sectionTitle: {
              id: "lookup.suggestions",
              defaultMessage: "Vorschläge",
            },
            items: [
              {
                intlLabel: {
                  id: "lookup.detached",
                  defaultMessage: "Immer als Dialogfenster",
                },
                name: "options.detached",
                type: "checkbox",
              },
            ]
          }
        ],
        validator: (args) => ({}),
      },
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'informations', {
      name: 'exact-dates',
      Component: () => (
        <Typography>
          <br />&#10035; {date(useCMEditViewDataManager().initialData.createdAt) || '--'}
          <br />&#9998; {date(useCMEditViewDataManager().initialData.updatedAt) || '--'}
        </Typography>
      ),
    });

    app.injectContentManagerComponent('editView', 'informations', {
      name: 'additional-links',
      Component: () => ["article", "person", "independent-work"].find(t => useCMEditViewDataManager().slug.includes(t)) ? (
        <p>
          <br /><Link target="_blank" href={
            `${strapi.backendURL}/api/${useCMEditViewDataManager().slug.split('.').pop()}s?filters[id][$eq]=${useCMEditViewDataManager().initialData.id}&populate=*`
          }>JSON</Link>
          <br /><Link target="_blank" href={
            useCMEditViewDataManager().initialData.rppdId ?
              `https://rppd.lobid.org/${useCMEditViewDataManager().initialData.rppdId}` :
              useCMEditViewDataManager().initialData.inCollection && useCMEditViewDataManager().initialData.inCollection==='nur BiblioVino' ?
              `http://test.wein.lobid.org/${useCMEditViewDataManager().initialData.rpbId}` :
              `http://test.rpb.lobid.org/${useCMEditViewDataManager().initialData.rpbId}`
          }>OPAC</Link>
        </p>
      ) : (<p />),
    });

    app.injectContentManagerComponent('editView', 'informations', {
      name: 'additional-links-authorities',
      Component: () => ["rpb-authority"].find(t => useCMEditViewDataManager().slug.includes(t)) ? (
        <p>
          <br /><Link target="_blank" href={
            `${strapi.backendURL}/api/rpb-authorities?filters[id][$eq]=${useCMEditViewDataManager().initialData.id}&populate=*`
          }>JSON</Link>
          <br /><Link target="_blank" href={
            `http://test.rpb.lobid.org/search?q="${encodeURIComponent(useCMEditViewDataManager().initialData.preferredName)}"`
          }>OPAC</Link>
        </p>
      ) : (<p />),
    });

    app.injectContentManagerComponent('listView', 'actions', {
      name: 'export',
      Component: () => {
        const state = useSelector((state) => state);
        return <Button variant='tertiary' onClick={() => {
          console.log("state:", state);
          const listView = state["content-manager_listView"];
          const type = listView.contentType.uid;
          const ids = listView.data.map(item => item.id);
          window.open(`/admin/plugins/lookup/list/${type}/${ids}`, '_blank', 'noopener');
        }}>Linkliste</Button>;
      }
    });
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
