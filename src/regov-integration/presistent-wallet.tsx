/**
 *  Copyright 2022 OwlMeans
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { MainModalAuthenticatedEventParams, MainModalHandle, WalletAppParams } from '@owlmeans/regov-lib-react';
import { i18nDefaultOptions, i18nSetup, BasicNavigator, RegovProvider, MainLoading } from '@owlmeans/regov-lib-react';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { buildStorageHelper } from '@owlmeans/regov-lib-react';
import { UIExtensionRegistry } from '@owlmeans/regov-lib-react';
import { webComponentMap } from '@owlmeans/regov-lib-react';
import {
  buildWalletWrapper,
  createWalletHandler,
  EXTENSION_TRIGGER_AUTHENTICATED,
  EXTENSION_TRIGGER_INIT_SENSETIVE,
  InitSensetiveEventParams,
  WalletHandler,
  webCryptoHelper,
} from '@owlmeans/regov-ssi-core';
import CircularProgress from '@mui/material/CircularProgress';
import { i18n as I18n } from 'i18next';

const i18n = i18nSetup(i18nDefaultOptions);

export const i18nRegisterExtensions = (i18n: I18n, extensions: UIExtensionRegistry) => {
  extensions?.uiExtensions.forEach((ext) => {
    if (ext.extension.localization) {
      Object.entries(ext.extension.localization.translations).forEach(([lng, resource]) => {
        if (ext.extension.localization?.ns) {
          i18n.addResourceBundle(lng, ext.extension.localization?.ns, resource, true, true);
        }
      });
    }
  });
};

export const WalletPersistentIntegrationReact = ({
  config,
  extensions,
  navigatorBuilder,
  children,
  serverClient,
}: PropsWithChildren<
  WalletAppParams & {
    navigatorBuilder: (handler: WalletHandler) => BasicNavigator;
  }
>) => {
  const handler = useMemo(createWalletHandler, []);
  const storage = useMemo(() => buildStorageHelper(handler, config), [config]);
  const handle = useMemo<MainModalHandle>(() => ({}), ['default']);

  const [loaded, setLoaded] = useState(false);

  const navigator = navigatorBuilder(handler);

  useEffect(() => extensions && i18nRegisterExtensions(i18n, extensions), extensions?.uiExtensions || []);

  useEffect(() => {
    storage.init().then(async (_) => {
      if (!handler.wallet) {
        if (!handler.stores['default']) {
          const wallet = await buildWalletWrapper(
            { crypto: webCryptoHelper, extensions: extensions?.registry },
            '11111111',
            {
              name: 'Default wallet',
              alias: 'default',
            },
            {
              prefix: config.DID_PREFIX,
              defaultSchema: config.baseSchemaUrl,
              didSchemaPath: config.DID_SCHEMA_PATH,
            }
          );
          await extensions?.triggerEvent<InitSensetiveEventParams>(wallet, EXTENSION_TRIGGER_INIT_SENSETIVE, {
            extensions: extensions.registry,
          });
          handler.stores[wallet.store.alias] = await wallet.export();
          handler.notify();
        }
        await handler.loadStore(async (handler) => {
          return await buildWalletWrapper(
            { crypto: webCryptoHelper, extensions: extensions?.registry },
            '11111111',
            handler.stores['default'],
            {
              prefix: config.DID_PREFIX,
              defaultSchema: config.baseSchemaUrl,
              didSchemaPath: config.DID_SCHEMA_PATH,
            }
          );
        });
      }

      /**
       * @TODO handle should be able to open modals or process incomming VCs some other way
       */
      await extensions.triggerEvent<MainModalAuthenticatedEventParams>(handler.wallet, EXTENSION_TRIGGER_AUTHENTICATED, {
        handle,
        config,
        handler,
        extensions,
      });

      console.info('STORE INITIALIZED');
      setLoaded(true);
    });

    return () => {
      console.info('STORE DETACHED');
      storage.detach();
    };
  }, [storage]);

  return loaded ? (
    <RegovProvider
      i18n={i18n}
      map={webComponentMap}
      handler={handler}
      config={config}
      navigator={navigator}
      extensions={extensions}
      serverClient={serverClient}
    >
      {children}
      <MainLoading nav={navigator} />
    </RegovProvider>
  ) : (
    <CircularProgress color="inherit" />
  );
};
