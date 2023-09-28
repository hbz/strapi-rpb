import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

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
      type: "string", 
      intlLabel: {
        id: "lookup.lookup.label",
        defaultMessage: "Lookup",
      },
      intlDescription: {
        id: "lookup.lookup.description",
        defaultMessage: "Look something up",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import(/* webpackChunkName: "input-component" */ "./components/Autocomplete"),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: "lookup.sources",
              defaultMessage: "Quellen",
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
                  id: "lookup.sources.hbz-Verbundkatalog",
                  defaultMessage: "hbz-Verbundkatalog",
                },
                name: "options.source.hbz-Verbundkatalog",
                type: "checkbox",
              },
            ],
          },
        ],
        advanced: [],
        validator: (args) => ({}),
      },
    });
  },

  bootstrap(app) {},
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
