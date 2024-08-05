import styles from './SectionCard.module.scss';
import { routes } from 'Routes';
import { KbaseSection } from 'shared/interfaces/kbase';
import sectionMockImage from './image/section-mock.jpg';
import ItemCard from 'components/ItemCard/ItemCard';

const SectionCard = ({ section }: { section: KbaseSection }) => {
  return (
    <ItemCard
      innerContent={
        <>
          <h3>{section.name}</h3>
          <span className={styles.descriptionSection}>{section.description}</span>
        </>
      }
      className={styles.wrapper}
      targetRoute={routes.sectionMaterials.getLink(section.organization_id, section.id)}
      image={section.cover || sectionMockImage}
    />
  );
};

export default SectionCard;
