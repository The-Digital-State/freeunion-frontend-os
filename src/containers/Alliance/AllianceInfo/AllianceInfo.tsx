import { Fragment, useContext, useState } from 'react';
import { IOrganisation, RegistrationTypesEnum, RegistrationTypesNamesEnum } from 'interfaces/organisation.interface';
import { CustomImage } from 'common/CustomImage/CustomImage';

import styles from './AllianceInfo.module.scss';
import { BannerSlideShow } from '../../../common/BannerSlideShow/BannerSlideShow';
import { GlobalContext } from '../../../contexts/GlobalContext';
import Socials from 'common/Socials/Socials';
import { Button, ButtonColors } from 'shared/components/common/Button/Button';
import VerificationSign from 'common/VerificationSign/VerificationSign';

type IAllianceInfoProps = { organisation: IOrganisation };

export function AllianceInfo({ organisation }: IAllianceInfoProps) {
  const [toggleInfo, setToggleInfo] = useState<boolean>(true);

  const {
    services: { deviceService },
    screen: { innerWidth },
  } = useContext(GlobalContext);

  if (!organisation) {
    return null;
  }

  const getInfoSection = [
    {
      sectionType: 'Сайт',
      secttionData: organisation.site,
    },
    {
      sectionType: 'Адрес',
      secttionData: organisation.address,
    },
    {
      sectionType: 'Телефон',
      secttionData: organisation.phone,
    },
    {
      sectionType: 'E-mail',
      secttionData: organisation.email,
    },
    {
      sectionType: 'Деятельность',
      secttionData: organisation.scopes?.map((interest) => interest?.name).join(', '),
    },
    {
      sectionType: 'Участники',
      secttionData: (
        <span className={styles.organisationInfoUsers}>
          Всего: <span className={styles.organisationUsersCount}>{organisation.members_count}</span> {'Новые: '}
          <span className={styles.organisationNewUsersCount}>{organisation.members_new_count}</span>
        </span>
      ),
    },
    {
      sectionType: 'Статус',
      secttionData: RegistrationTypesNamesEnum[RegistrationTypesEnum[organisation.registration]],
    },
  ];

  const toogleButton = innerWidth < 1280 && (
    <Button className={styles.toggleButton} color={ButtonColors.primary} icon="arrowRight" onClick={() => setToggleInfo(!toggleInfo)}>
      {!toggleInfo ? 'Об объединении' : 'Информация'}
    </Button>
  );

  // @ts-ignore
  const bannersImages = organisation?.banners
    ?.filter((banner) => !!banner.small || !!banner.large)
    .map((banner) => banner[deviceService.isMobile ? 'small' : 'large']);

  // @ts-ignore
  //const { large: bannerImage } = organisation.banners[0] || {};

  const isFreeUnion = organisation.id === +process.env.REACT_APP_ORG_FU;

  return (
    <>
      <h2>{organisation.short_name}</h2>

      <div className={styles.cardClass}>
        <div className={styles.banner}>
          <BannerSlideShow
            images={bannersImages}
            donationBanner={!!isFreeUnion}
            logoData={innerWidth <= 764 && { orgId: organisation.id, avatar: organisation.avatar }}
          />
        </div>
        <div className={styles.organisationInfo}>
          {(innerWidth > 1280 || !!toggleInfo) && (
            <div className={styles.organisationBlockAvatar}>
              {innerWidth > 764 && (
                <div className={styles.avatarTitleBlock}>
                  <div className={styles.organisationAvatar}>
                    <CustomImage
                      width={80}
                      height={80}
                      src={organisation.avatar}
                      alt="Изображение объединения"
                      errorImage="noImage"
                      rounded
                    />
                  </div>
                  <h3 className={styles.sectionTitleName}>
                    {organisation.name} {organisation.is_verified && <VerificationSign className={styles.verificationAllianceInfo} />}
                  </h3>
                </div>
              )}
              {innerWidth <= 764 && (
                <h3 className={styles.sectionTitleName}>
                  {organisation.name} {organisation.is_verified && <VerificationSign className={styles.verificationAllianceInfo} />}
                </h3>
              )}

              {organisation.description && <div className={styles.focusWrapper}>{organisation.description}</div>}

              {toogleButton}

              {!!organisation.social?.length && !!organisation.social?.filter((i) => i.value)?.length && (
                <div className={styles.sectionSocials}>
                  <div className={styles.sectionDataSocials}>{<Socials iconLinks={organisation.social} />}</div>
                </div>
              )}
            </div>
          )}
          {(innerWidth > 1280 || !toggleInfo) && (
            <div className={styles.organisationDetailsWrapper}>
              <div className={styles.organisationDetails}>
                {getInfoSection.map(({ sectionType, secttionData }) => {
                  if (!secttionData) {
                    return null;
                  }

                  return (
                    <Fragment key={sectionType}>
                      <p className={styles.sectionTitle}>
                        <span>{sectionType}:</span>
                      </p>
                      {(() => {
                        switch (sectionType) {
                          case 'Сайт':
                            return (
                              <a href={secttionData} target="_blank" rel="noreferrer">
                                {secttionData}
                              </a>
                            );

                          case 'Телефон':
                            return <a href={`tel:+${secttionData}`}>{secttionData}</a>;

                          case 'E-mail':
                            return (
                              <a href={`mailto:${secttionData}`} target="_blank" rel="noreferrer">
                                {secttionData}
                              </a>
                            );

                          case 'Адрес':
                            return (
                              <a href={`https://www.google.com/maps/search/${secttionData}'`} target="_blank" rel="noreferrer">
                                {secttionData}
                              </a>
                            );
                          default:
                            return <p className={styles.sectionData}>{secttionData}</p>;
                        }
                      })()}
                    </Fragment>
                  );
                })}
              </div>

              {toogleButton}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
