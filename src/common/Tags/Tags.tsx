import { Link } from 'react-router-dom';
import { routes } from 'Routes';
import styles from './Tags.module.scss';

const Tags = ({ tags, isMaterial }: { tags: string[]; isMaterial?: boolean }) => {
  if (!tags.length) {
    return null;
  }

  return (
    <div>
      <span>{!isMaterial ? 'Хэш-теги новости:' : 'Хэш-теги материала:'}</span>
      <div className={styles.wrapperTags}>
        {tags.map((tag, index) => {
          return (
            <Link
              className={styles.tag}
              key={index}
              to={(!isMaterial ? routes.TAGS_NEWS : routes.TAGS_MATERIALS) + '?' + new URLSearchParams({ tags: tag }).toString()}
            >
              {tag}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Tags;
