import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CustomImage } from '../CustomImage/CustomImage';
import DonationBanner from 'common/DonationBanner/DonationBanner';
import BannerMock1 from '../../public/images/banners/banner_mock_1.jpg';

import styles from './BannerSlideShow.module.scss';

interface BannerSlideShowProps {
  images: string[];
  donationBanner?: boolean;
  logoData?: {
    avatar: string;
    orgId: number;
  };
  index?: number;
}

export function BannerSlideShow({ images, donationBanner, logoData, index }: BannerSlideShowProps) {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState<number>();

  const mockBanners = [BannerMock1];

  let timer;

  useEffect(() => {
    const bannersImage =
      donationBanner && !!images?.length
        ? [...images, undefined]
        : donationBanner && !images?.length
        ? [...mockBanners, undefined]
        : !donationBanner && !images?.length
        ? mockBanners
        : images;
    setBanners(bannersImage);
    setImage(bannersImage[0]);
    setCurrentImage(bannersImage.length - 1);
  }, [images[0]]);

  const interval = () => {
    timer =
      !timer &&
      setInterval(() => {
        setImage(banners[currentImage]);
      }, 5000);

    if (currentImage === 0) {
      setCurrentImage(banners.length - 1);
    } else {
      setCurrentImage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (banners.length < 1) {
      return;
    }

    interval();

    return () => clearInterval(timer);
  }, [image]);

  if (!banners.length && !!donationBanner) {
    return (
      <div className={styles.container}>
        <DonationBanner />
      </div>
    );
  }
  if (!banners.length && !donationBanner) {
    return null;
  }

  return (
    <div className={styles.container}>
      {logoData && (
        <div className={styles.organisationAvatar}>
          <CustomImage width={80} height={80} src={logoData.avatar} alt="Изображение объединения" errorImage="noImage" rounded />
        </div>
      )}
      {banners.map((img) => {
        if (!img) {
          return null;
        }
        return (
          <CSSTransition
            classNames={{
              appear: styles.appear,
              appearActive: styles.appearActive,
              appearDone: styles.appearDone,
              enter: styles.enter,
              enterActive: styles.enterActive,
              enterDone: styles.enterDone,
              exit: styles.exit,
              exitActive: styles.exitActive,
              exitDone: styles.exitDone,
            }}
            key={img}
            timeout={1000}
            in={img === image}
            appear={true}
          >
            <div className={styles.imageBlock}>
              <CustomImage
                src={img}
                alt="Баннер объединения"
                background="white"
                errorImage="noImage"
                height={260}
                rounded={false}
                width="100%"
                className={styles.bannerStyle}
              />
            </div>
          </CSSTransition>
        );
      })}
      {!!donationBanner && (
        <CSSTransition
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            enterDone: styles.enterDone,
            exit: styles.exit,
            exitActive: styles.exitActive,
            exitDone: styles.exitDone,
          }}
          timeout={1000}
          in={typeof image === 'undefined'}
          appear={true}
        >
          <div className={styles.imageBlock}>
            <DonationBanner />
          </div>
        </CSSTransition>
      )}
    </div>
  );
}
