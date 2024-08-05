import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CustomImage } from 'common/CustomImage/CustomImage';
import { GlobalContext } from 'contexts/GlobalContext';

import style from './DonationBanner.module.scss';

import donationBannerMobile from './donation_mobile.png';
import donationBannerDesktop from './donation_desktop.png';
import { routes } from 'Routes';

const DonationBanner = () => {
  const {
    services: {
      deviceService: { isMobile },
    },
  } = useContext(GlobalContext);

  const { id } = useParams<{ id: string }>();

  return (
    <Link
      className={style.donationBannerLink}
      to={routes.SUPPORT_US}
      onClick={() => {
        window.dataLayer.push({
          event: 'event',
          eventProps: {
            category: 'ui_interaction',
            action: 'click_support-us_banner',
            label: 'org_page',
            value: +id,
          },
        });
      }}
    >
      <CustomImage
        src={isMobile ? donationBannerMobile : donationBannerDesktop}
        alt="Пожертвования"
        background="white"
        errorImage="noImage"
        height={260}
        rounded={false}
        width="100%"
      />
    </Link>
  );
};

export default DonationBanner;
