import { CustomImage } from 'common/CustomImage/CustomImage';
import { IOrganisation } from 'interfaces/organisation.interface';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'Routes';
import { Button, ButtonColors } from 'shared/components/common/Button/Button';
import { Icon } from 'shared/components/common/Icon/Icon';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import styles from './AllianceInfoShort.module.scss';
import EnterButton from './EnterButton/EnterButton';
import cn from 'classnames';
import VerificationSign from 'common/VerificationSign/VerificationSign';
import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { BannerSlideShow } from 'common/BannerSlideShow/BannerSlideShow';
import BannerMock1 from '../../../public/images/banners/banner_mock_1.jpg';

const AllianceInfoShort = ({ organisation, index }: { organisation: IOrganisation; index?: number }) => {
  const { id: organisationId } = organisation;

  const [activeBanner, setActiveBanner] = useState<boolean>(true);

  //@ts-ignore
  const titleInfoPhoto = organisation.banners.map((banner) => banner['small'])[0];

  const {
    services: { deviceService },
    screen: { innerWidth },
  } = useContext(GlobalContext);
  const { user } = useContext(GlobalDataContext);

  if (!organisation) {
    return null;
  }

  // @ts-ignore
  const bannersImages = organisation?.banners
    ?.filter((banner) => !!banner.small || !!banner.large)
    .map((banner) => banner[deviceService.isMobile ? 'small' : 'large']);

  return (
    <div className={styles.wrapper}>
      {innerWidth <= 764 && <h2>{organisation.short_name}</h2>}

      <div className={styles.wrapperCard}>
        {innerWidth <= 764 && (
          <BannerSlideShow
            images={bannersImages}
            donationBanner={false}
            logoData={innerWidth <= 764 && { orgId: organisation.id, avatar: organisation.avatar }}
            index={index}
          />
        )}

        <div className={styles.mainInfo}>
          <div className={styles.avatarTitleBlock}>
            <div className={styles.organisationAvatar}>
              {!!user && (
                <Link
                  className={styles.chatIcon}
                  to={{
                    pathname: routes.chat,
                    search: `id=${organisationId}&type=organization`,
                  }}
                >
                  <Icon iconName={Icons.entryChat} />
                </Link>
              )}

              <Link to={routes.union.getLink(organisationId)}>
                <CustomImage width={80} height={80} src={organisation.avatar} alt="Изображение объединения" errorImage="noImage" rounded />
              </Link>
            </div>
            <div className={styles.titleBlock}>
              <Link className={styles.sectionTitleName} to={routes.union.getLink(organisationId)}>
                {organisation.name}
                {organisation.is_verified && <VerificationSign className={styles.verificationAllianceInfo} />}
              </Link>

              <span className={styles.organisationShortInfo}>
                <div>
                  <strong>Участников:</strong> <span className={styles.organisationCount}>{organisation?.members_count || 0}</span>
                </div>
              </span>
            </div>
          </div>
          {organisation.description && <span className={styles.focusWrapper}>{organisation.description}</span>}
          <div className={styles.buttonWrapper}>
            <EnterButton organisationId={organisationId} publicStatus={organisation.public_status} maxWidth={innerWidth <= 764} />
          </div>
          {innerWidth > 1200 && (
            <Button
              color={ButtonColors.primary}
              icon="arrowRight"
              iconPosition="right"
              onClick={() => setActiveBanner(!activeBanner)}
              className={styles.buttonContacts}
            >
              {activeBanner ? 'Активность' : 'Обложка'}
            </Button>
          )}
        </div>
        {innerWidth > 1200 && innerWidth > 764 && (
          <div className={styles.activeInfoWrapper}>
            <div
              className={cn(styles.wrapperBanner, {
                [styles.active]: activeBanner,
              })}
            >
              <img src={titleInfoPhoto || BannerMock1} alt={`Фото объединения ${organisation.name}`} />
            </div>

            <div className={styles.activeInfo}>
              <span className={cn(styles.organisationShortInfo, styles.organisationActiveInfo)}>
                <div>
                  <strong>Предложений:</strong>
                  <span className={styles.organisationCount}>{organisation.suggestions_count || 0}</span>
                </div>
                <div>
                  <strong>Задач:</strong>
                  <span className={styles.organisationCount}>{organisation.desk_tasks_count || 0}</span>
                </div>
                <div>
                  <strong>Новостей:</strong>
                  <span className={styles.organisationCount}>{organisation?.news_count || 0}</span>
                </div>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllianceInfoShort;
