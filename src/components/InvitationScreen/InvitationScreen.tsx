import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import { Redirect } from 'react-router-dom';
import { CustomImage } from 'common/CustomImage/CustomImage';
import { routes } from 'Routes';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import styles from './InvitationScreen.module.scss';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { Button } from 'shared/components/common/Button/Button';
import isEmpty from 'lodash/isEmpty';
import OrganizationPreview from 'components/OrganizationPreview/OrganizationPreview';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { organisationsService } from 'services';
import AllianceInfoShort from 'containers/Alliance/AllianceInfoShort/AllianceInfoShort';

export function InvitationScreen() {
  const [invited, setInvited] = useState({
    user: null,
    isMember: null,
    organisation: null,
  });

  const { organisations: organisationsList, user } = useContext(GlobalDataContext);
  const {
    services: { authService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const { inviteParams } = authService;

  const { REACT_APP_BASE_URL } = process.env;

  const firstSessionOrgId = REACT_APP_BASE_URL !== 'https://freeunion.online' ? 34 : 94;

  useEffect(() => {
    (async () => {
      try {
        if (!inviteParams && !!localStorage.getItem('firstSession')) {
          (async () => {
            const organisation = await organisationsService.getOrganisationById(firstSessionOrgId);
            setInvited({
              user: null,
              isMember: false,
              organisation: organisation,
            });
          })();

          return;
        }
        if (!inviteParams) {
          return;
        }
        showSpinner();
        const { invite_code, invite_id } = authService.inviteParams;
        const promises: Promise<any>[] = [authService.getInviteDetails(invite_id, invite_code)];
        const [invitedInfo] = await Promise.all(promises);

        setInvited({
          user: invitedInfo.user,
          isMember: invitedInfo.is_member,
          organisation: invitedInfo.organization,
        });
      } catch (error) {
        toast.error(formatServerError(error));
      } finally {
        hideSpinner();
      }
    })();

    return () => {
      authService.inviteParams = undefined;
      localStorage.removeItem('firstSession');
    };
  }, []);

  const buttons = (
    <>
      <Button color="light" to={routes.UNIONS} className={styles.btnall}>
        Все объединения
      </Button>
      <Button to={routes.CREATE_UNION} className={styles.btn}>
        Создать объединение
      </Button>
    </>
  );

  if (!inviteParams && !localStorage.getItem('firstSession')) {
    return <Redirect to={routes.UNION} />;
  }

  if (!!invited) {
    return (
      <SimpleRoutingContainer
        showCloseButton
        className={styles.main}
        classNameContainer={styles.container}
        closeButtonRoute={
          invited.organisation ? routes.union.getLink(invited.organisation.id) : !!user.membership.length ? routes.UNION : routes.UNIONS
        }
        logo={
          invited.user && invited.organisation
            ? { src: invited.user.public_avatar, alt: `${invited.user.public_name} ${invited.user.public_family}` }
            : { src: '', alt: '' }
        }
        title={
          !invited.user && invited.organisation
            ? `Вы можете присоединиться к "${invited.organisation.name}" или к любому другому, посмотрев Все объединения`
            : invited.organisation
            ? invited.isMember
              ? `человек, который вас пригласил, является членом объединения ${invited.organisation.name}`
              : `человек, который вас пригласил, предлагает вступить в объединение ${invited.organisation.name}`
            : 'человек, который вас пригласил, еше не присоединился к объединению, вступите в одно из предложенных нами, посмотрев Все объединения'
        }
        hideFooter
      >
        {invited.organisation ? (
          <>
            {!isEmpty(invited.organisation) && <AllianceInfoShort organisation={invited.organisation} />}
            <div className={styles.footer_wrapper}>{buttons}</div>
          </>
        ) : (
          !!invited.user && (
            <>
              <div className={styles.main_wrapper}>
                <div className={styles.main_profile}>
                  <div className={styles.profileInvitation}>
                    <div className={styles.profileInvitation_avatar}>
                      <CustomImage
                        src={invited.user.public_avatar}
                        alt={`${invited.user.public_name} ${invited.user.public_family}`}
                        width={160}
                        height={160}
                      />
                    </div>
                    <div className={styles.profileInvitation_text}>
                      <h3 className={styles.name}>
                        {invited?.user.public_name} {invited?.user.public_family}
                      </h3>
                    </div>
                  </div>
                  <div className={styles.buttons}>{buttons}</div>
                </div>
                <div className={styles.main_organisations}>
                  {organisationsList &&
                    !!organisationsList.length &&
                    organisationsList.map((organization, index) => {
                      return (
                        <div key={`${organization?.id}_${index}`} className={styles.main_organisation}>
                          <OrganizationPreview organizationId={organization.id} />
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )
        )}
      </SimpleRoutingContainer>
    );
  } else {
    return <></>;
  }
}
