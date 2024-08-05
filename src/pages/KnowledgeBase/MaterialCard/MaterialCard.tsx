import ItemCard from 'components/ItemCard/ItemCard';
import styles from './MaterialCard.module.scss';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import { routes } from 'Routes';
import { KbaseMaterialFront, KbaseMaterialTypes } from 'shared/interfaces/kbase';
import materialMockImage from './image/material-mock.jpg';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import ExternalLinkModal from 'common/ExternalLinkModal/ExternalLinkModal';

const getFormattedData = (date: Date) => {
  return format(new Date(date), "dd MMM, yyyy 'в' HH:mm", {
    locale: ru,
  });
};

const MaterialCard = ({ material }: { material: KbaseMaterialFront }): JSX.Element => {
  const { REACT_APP_BASE_URL } = process.env;
  const { openModal } = useContext(GlobalContext);

  const openExternalLinkModal = () => {
    openModal({
      params: {
        mainContainer: <ExternalLinkModal link={material.link} />,
      },
    });
  };

  return (
    <ItemCard
      className={styles.materialCard}
      innerContent={<time>{getFormattedData(material.published_at)}</time>}
      innerContentWrapperStyles={styles.innerContentWrapperPopular}
      dropDownContent={
        <div>
          <h3>{material.title}</h3>
          <span className={styles.descriptionSpan}>{material.excerpt}</span>
        </div>
      }
      organization={material.organization}
      targetRoute={
        material.type === KbaseMaterialTypes.text ? routes.materialDetails.getLink(material.organization.id, material.id) : undefined
      }
      externalLink={material.type === KbaseMaterialTypes.link}
      image={material.image || materialMockImage}
      onClick={() => {
        if (material.type === KbaseMaterialTypes.link) {
          const linkMaterial = new URL(material.link);
          if (REACT_APP_BASE_URL !== linkMaterial.origin) {
            openExternalLinkModal();
          } else {
            window.open(linkMaterial, '_blank');
          }
        }
      }}
    />
  );
};

export default MaterialCard;
