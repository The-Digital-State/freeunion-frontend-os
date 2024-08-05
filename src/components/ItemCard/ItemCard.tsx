import { Link } from 'react-router-dom';
import cn from 'classnames';
import NewsOrganisationAvatar from 'common/NewsOrganisationAvatar/NewsOrganisationAvatar';
import { OrganizationShort } from 'shared/interfaces/organization';
import styles from './ItemCard.module.scss';

type ItemCardProps = {
  innerContent: JSX.Element;
  dropDownContent?: JSX.Element;
  actionButton?: JSX.Element;
  targetRoute?: any;
  organization?: OrganizationShort;
  className?: string;
  innerContentWrapperStyles?: string;
  image?: string;
  externalLink?: boolean;
  onClick?: () => void;
};

const ItemCard = ({
  innerContent,
  dropDownContent,
  actionButton,
  targetRoute,
  organization,
  image,
  className,
  innerContentWrapperStyles,
  externalLink,
  onClick,
}: ItemCardProps): JSX.Element => {
  // @ts-ignore
  let ItemCardWrapper: string | Link = externalLink ? 'a' : targetRoute ? Link : 'div';

  return (
    <ItemCardWrapper
      to={targetRoute}
      className={cn(styles.itemCard, className)}
      href={targetRoute}
      target={externalLink && '_blank'}
      rel="noreferrer"
      onClick={onClick}
    >
      {actionButton && actionButton}
      {organization && <NewsOrganisationAvatar organization={organization} />}
      <div className={cn(innerContentWrapperStyles, styles.innerContentWrapper)}>
        {image && <img src={image} alt="item-card" className={styles.image} />}
        <div className={styles.innerContent}>{innerContent}</div>
      </div>
      {!!dropDownContent && <div className={cn(styles.dropDownContentWrapper, 'custom-scroll custom-scroll-black')}>{dropDownContent}</div>}
    </ItemCardWrapper>
  );
};

export default ItemCard;
