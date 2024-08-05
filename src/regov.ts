import {
  basicNavigator,
  buildServerClient,
  buildUIExtensionRegistry,
  Config,
  extendNavigator,
} from '@owlmeans/regov-lib-react/dist/common';
import { WalletHandler } from '@owlmeans/regov-ssi-core';
import { useHistory } from 'react-router-dom';
import { routes } from 'Routes';
import { authIntegratedExtension, SERVER_INTEGRATION_ALIAS } from '@owlmeans/regov-ext-auth';
import { buildCommUIExtension, CommExtConfig, DEFAULT_SERVER_ALIAS } from '@owlmeans/regov-ext-comm';
import { buildIdentityExtensionUI } from '@owlmeans/regov-ext-identity';
import { groupsUIExtension } from 'regov-integration';

import './regov-integration/warmup';


export const FREEUNION_IDENTITY_TYPE = 'Freeunion:Identity';

export const regovConfig = {
  DID_PREFIX: process.env.REACT_APP_DIDPREFIX || 'frunby',
  DID_SCHEMA_PATH: process.env.REACT_APP_DIDSCHEMA_PATH || 'did-schema.json',
  code: process.env.REACT_APP_REGOV_APP_CODE || 'freeunionby.web.app',
  baseSchemaUrl: process.env.REACT_APP_BASE_SCHEMA_URL || '',
  name: process.env.REACT_APP_REGOV_APP_NAME || 'Freeunion Online',
  development: false,
};

const commConfig: CommExtConfig = {
  wsConfig: {
    [DEFAULT_SERVER_ALIAS]: {
      server: process.env.REACT_APP_DIDCOMM_SERVER,
      timeout: process.env.REACT_APP_DIDCOMM_TIMEOUT ? parseInt(process.env.REACT_APP_DIDCOMM_TIMEOUT) : 30,
    },
  },
};

export const walletServerClient = buildServerClient({
  baseUrl: process.env.REACT_APP_NODE_WALLET_URL || process.env.REACT_APP_API_URL,
  servers: {
    [SERVER_INTEGRATION_ALIAS]: process.env.REACT_APP_API_URL,
  },
});

export const regovNavigatorBuilder = (handler: WalletHandler, config: Config, history: ReturnType<typeof useHistory>) =>
  extendNavigator(basicNavigator, {
    assertAuth: async () => {
      if (handler.wallet) {
        return true;
      }

      if (!config.development) {
        history.push(routes.HOME);
      }

      return false;
    },

    checkAuth: async () => !!handler.wallet,

    home: async () => {
      setTimeout(() => history.push(routes.UNION), 100);
    },

    back: async () => history.goBack(),
  });

const registry = buildUIExtensionRegistry();
registry.registerSync(buildCommUIExtension(commConfig));
registry.registerSync(
  buildIdentityExtensionUI(
    FREEUNION_IDENTITY_TYPE,
    { appName: regovConfig.name },
    {
      name: 'Freeunion ID',
      code: 'freeunion-identity',
      organization: process.env.REACT_APP_REGOV_APP_NAME || 'Freeunion Online',
      home: 'https://freeunion.online/',
      schemaBaseUrl: process.env.REACT_APP_BASE_SCHEMA_URL || '',
    }
  )
);
registry.registerSync(authIntegratedExtension);
registry.registerSync(groupsUIExtension);

export const regovExtensionRegistry = registry;
