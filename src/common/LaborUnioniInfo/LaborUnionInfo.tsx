import { CustomImage } from '../CustomImage/CustomImage';
import { IOrganisationShort } from '../../interfaces/organisation.interface';
import styles from './LaborUnionInfo.module.scss';
import { Link, useHistory } from 'react-router-dom';
import { routes } from 'Routes';

type ILaborUnionInfo = {
  organisation: IOrganisationShort;
  onClick?: () => void;
  noLogo?: boolean;
};

export function LaborUnionInfo({ noLogo, organisation, onClick = () => {} }: ILaborUnionInfo) {
  let Component: string | Link = 'div';

  let elementParams: { [key: string]: any } = {};

  const { name, avatar, id } = organisation;
  const history = useHistory();

  if (!!id) {
    // @ts-ignore
    Component = Link;
    elementParams.to = routes.union.getLink(id);
  }

  return (
    <div className={styles.LaborUnionInfo}>
      {!noLogo && (
        // @ts-ignore
        <Component
          onClick={() => {
            onClick();
            setTimeout(() => {
              if (!!id) {
                history.push(routes.union.getLink(id));
              }
            });
          }}
          {...elementParams}
        >
          <CustomImage src={avatar} alt={name} width={75} height={75} />
        </Component>
      )}

      <h3>{name}</h3>
    </div>
  );
}
