import { useContext, useEffect, useState } from 'react';
import { routes } from 'Routes';
import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { IOrganisation } from 'interfaces/organisation.interface';

import { Button } from 'shared/components/common/Button/Button';
import { CustomImage } from 'common/CustomImage/CustomImage';

import styles from './OrganizationPreview.module.scss';
import { Link } from 'react-router-dom';
interface Props {
  organizationId: number;
}

function OrganizationPreview({ organizationId }: Props) {
  const {
    services: { organisationsService },
  } = useContext(GlobalContext);

  const { user, organisationMethods } = useContext(GlobalDataContext);

  // refactor state to context data
  const [organisation, setOrganisation] = useState<IOrganisation>(null);
  useEffect(() => {
    (async () => {
      const org = await organisationsService.getOrganisationById(organizationId);
      if (org) {
        setOrganisation(org);
      }
    })();
  }, []);

  if (!organisation) {
    return null; // better is loading UI
  }

  const { avatar, name } = organisation;

  const userInOrganisation = user.membership.some((membership) => membership.id === organisation.id);

  return (
    <div className={styles.wrapper}>
      {/* {avatar && ( */}
      <Link
        to={routes.union.getLink(organizationId)}
        className={styles.avatar}
        onClick={() => {
          window.dataLayer.push({
            event: 'event',
            eventProps: {
              category: 'unionPreview',
              action: 'click',
              label: 'avatar',
            },
          });
        }}
      >
        <CustomImage src={avatar} alt={name} width={160} height={160} rounded={false} errorImage="noImage" />
      </Link>
      {/* )} */}
      <Link
        className={styles.title}
        to={routes.union.getLink(organizationId)}
        onClick={() => {
          window.dataLayer.push({
            event: 'event',
            eventProps: {
              category: 'unionPreview',
              action: 'click',
              label: 'title',
            },
          });
        }}
      >
        {name}
      </Link>
      <span className={styles.reject__members}>
        <span className="text-bold">Участников:</span>
        {!!organisation?.members_count && <span className={styles.membersCount}>{organisation?.members_count}</span>}
      </span>
      <span className={styles.reject__focus}>
        <span className="text-bold">Фокус работы: </span>
        {!!organisation?.scopes.length && <span>{organisation?.scopes.map((s) => s.name).join(', ')}</span>}
      </span>

      <p className={`${styles.text} custom-scroll custom-scroll-black`}>{organisation?.description}</p>

      {/*<div className={styles.tags}>tags</div>*/}
      <Button
        className={styles.button}
        to={userInOrganisation ? routes.union.getLink(organizationId) : undefined}
        onClick={
          userInOrganisation
            ? () => organisationMethods.leaveOrganisation(organizationId)
            : () => organisationMethods.enterOrganisation(organizationId)
        }
      >
        {userInOrganisation ? 'Выйти из объединения' : 'Вступить'}
      </Button>
    </div>
  );
}

export default OrganizationPreview;
