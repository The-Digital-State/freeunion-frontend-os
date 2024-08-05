import { Helmet } from 'react-helmet';
import { Redirect, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { routes } from 'Routes';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import Navigation from 'common/Navigation/Navigation';
import KbaseGroupContainer, {
  KbaseDataTypes,
  KbaseGroupDirection,
  KbaseVariety,
} from 'pages/KnowledgeBase/KbaseGroupContainer/KbaseGroupContainer';
import { navigationKbase } from 'constans/navigationKbase';

const TagsMaterials = () => {
  function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();

  let tags = [];

  const urlTags = query.get('tags')?.split(',') || [];
  tags = urlTags;

  if (!tags.length) {
    return <Redirect to={routes.KNOWLEDGE_BASE_MATERIALS} />;
  }

  return (
    <SimpleRoutingContainer showCloseButton closeButtonRoute={routes.UNION} logoWithText>
      <Helmet>
        <title>Материалы по теме: {tags.join(',')}</title>
        <meta name="description" content={`Новости по теме: ${tags.join(',')}`} />
      </Helmet>

      <div>
        <Navigation navigations={navigationKbase()} />

        {!!tags.length && (
          <KbaseGroupContainer type={KbaseDataTypes.all} tags={tags} direction={KbaseGroupDirection.grid} variant={KbaseVariety.material} />
        )}
      </div>
    </SimpleRoutingContainer>
  );
};

export default TagsMaterials;
