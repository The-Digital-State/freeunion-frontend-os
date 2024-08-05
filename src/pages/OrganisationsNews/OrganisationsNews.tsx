import { Redirect, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import NewsGroupContainer, { NewsDataTypes } from 'pages/News/NewsGroupContainer/NewsGroupContainer';
import { routes } from 'Routes';
import { NewsGroupDirection } from 'pages/News/NewsGroup/NewsGroup';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { IOrganisation } from 'interfaces/organisation.interface';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { GlobalContext } from 'contexts/GlobalContext';

type ILogo = {
  src: string;
  alt: string;
  href?: string;
};

function OrganisationsNews() {
  const {
    services: { organisationsService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const { organizationId } = useParams<{ organizationId: string }>();
  const [organisation, setOrganisation] = useState<IOrganisation>(null);
  const [logo, setLogo] = useState<ILogo>(undefined);

  useEffect(() => {
    if (!organizationId) {
      setOrganisation(null);
      return;
    } else {
      (async () => {
        try {
          showSpinner();
          const organisation = await organisationsService.getOrganisationById(+organizationId);

          setOrganisation(organisation);
          setLogo({
            src: organisation?.avatar,
            href: routes.union.getLink(organizationId),
            alt: organisation?.name,
          });
        } catch (error) {
          console.log(error);
          toast.error(formatServerError(error));
        } finally {
          hideSpinner();
        }
      })();
    }
  }, []);

  if (!organizationId || !organisation?.id) {
    return null;
  }

  if (!organizationId && !organisation?.id) {
    return <Redirect to={routes.union.getLink(organizationId)} />;
  }

  return (
    <SimpleRoutingContainer
      showCloseButton
      closeButtonRoute={routes.union.getLink(organizationId)}
      logo={logo}
      title={organisation?.short_name}
      showScrollToTopButton
    >
      <Helmet>
        <title>Новости {organisation?.name}</title>
        <meta name="description" content={`Новости ${organisation?.name}`} />
      </Helmet>

      <NewsGroupContainer
        organisationId={organisation?.id}
        type={NewsDataTypes.organisationNewsPage}
        direction={NewsGroupDirection.grid}
        key={organisation?.id}
      />
    </SimpleRoutingContainer>
  );
}
export default OrganisationsNews;
