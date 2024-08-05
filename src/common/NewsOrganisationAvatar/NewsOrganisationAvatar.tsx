import styles from './NewsOrganisationAvatar.module.scss';
import { CustomImage } from 'common/CustomImage/CustomImage';
import { useHistory } from 'react-router-dom';
import { routes } from 'Routes';
import cn from 'classnames';

type NewsOrganisationAvatarProps = {
  organization: {
    avatar: string;
    id: number;
    name: string;
  };
  classNames?: string;
};

const NewsOrganisationAvatar = ({ organization, classNames }: NewsOrganisationAvatarProps) => {
  const history = useHistory();

  return (
    <button
      className={cn(classNames, styles.newsOrganisationAvatar)}
      onClick={(e) => {
        e.preventDefault();
        history.push(routes.union.getLink(organization.id));
      }}
    >
      <CustomImage src={organization.avatar} alt={organization.name} width={52} height={52} />
    </button>
  );
};

export default NewsOrganisationAvatar;
