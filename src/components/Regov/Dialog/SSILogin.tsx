import { IntegratedDIDBasedAuth } from '@owlmeans/regov-ext-auth';
import { IntegrationWrapper } from '@owlmeans/regov-lib-react';
import { routes } from 'Routes';
import { RegovSSILoginProps } from './types';
import { WalletHandler } from '@owlmeans/regov-ssi-core';
import { regovConfig, regovNavigatorBuilder, walletServerClient, regovExtensionRegistry } from 'regov';
import { WalletPersistentIntegrationReact } from 'regov-integration/presistent-wallet';

const SSILogin = (props: RegovSSILoginProps) => {
  const history = props.history;

  const navigatorBuilder = (handler: WalletHandler) => regovNavigatorBuilder(handler, regovConfig, history);

  return (
    <WalletPersistentIntegrationReact
      config={regovConfig}
      extensions={regovExtensionRegistry}
      navigatorBuilder={navigatorBuilder}
      serverClient={walletServerClient}
    >
      <IntegrationWrapper>
        <IntegratedDIDBasedAuth
          auth={async (data: RegovAuthResult, loading) => {
            if (data.ok && data.token && data.notificationToken) {
              props.authService.authenticate({
                token: data.token,
                notificationToken: data.notificationToken,
              });

              await props.auth.authenticate();

              window.dataLayer.push({
                event: 'event',
                eventProps: {
                  category: 'account',
                  action: 'login-ssi',
                },
              });

              setImmediate(() => {
                props.closeModal();
                setImmediate(() => {
                  if (props.authService.inviteParams || !!localStorage.getItem('firstSession')) {
                    history.push(routes.INVITATION_SCREEN);
                  } else {
                    history.push(routes.UNION);
                  }
                });
              });

              return true;
            }

            loading.error(data.errors[0] ? data.errors[0] : 'Неизвестная ошибка');
            return false;
          }}
          valideteResponseUrl="/auth/login/ssi"
        />
      </IntegrationWrapper>
    </WalletPersistentIntegrationReact>
  );
};

type RegovAuthResult = {
  ok: boolean;
  errors?: string[];
  token?: string;
  notificationToken?: string;
};

export default SSILogin;
