import { useContext } from 'react';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import EnterOrganization from 'containers/EnterOrganization/EnterOrganization';
import OrganizationPreview from 'components/OrganizationPreview/OrganizationPreview';
import { Slider } from 'common/Slider/Slider';

import './Rejected.scss';

function Rejected({ comment }) {
  const { organisations, user } = useContext(GlobalDataContext);

  return (
    <EnterOrganization.Container title="Мы подобрали другие объединения, соответствующие вашим интересам, так как Ваша заявка была отклонена">
      {comment && <p>Причина отказа, комментарий администратора объединения: {comment}</p>}

      <div>
        <Slider
          controlsVerticalOffset={70}
          children={organisations
            .filter((organisation) => {
              return !(user.membership.some((membership) => membership.id === organisation.id) || user.requests.includes(organisation.id));
            })
            .map((organization) => {
              return <OrganizationPreview organizationId={organization.id} />;
            })}
        />
      </div>
    </EnterOrganization.Container>
  );
}

export default Rejected;
