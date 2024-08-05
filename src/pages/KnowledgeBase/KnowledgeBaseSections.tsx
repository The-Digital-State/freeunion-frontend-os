import { Helmet } from 'react-helmet';
import Navigation from 'common/Navigation/Navigation';
import KbaseGroupContainer, { KbaseDataTypes, KbaseGroupDirection, KbaseVariety } from './KbaseGroupContainer/KbaseGroupContainer';
import { navigationKbase } from 'constans/navigationKbase';

const KnowledgeBaseSections = () => {
  return (
    <>
      <Helmet>
        <title>База знаний: разделы</title>
        <meta name="description" content="База знаний: разделы" />
      </Helmet>

      <div>
        <Navigation navigations={navigationKbase()} />
        <KbaseGroupContainer variant={KbaseVariety.section} direction={KbaseGroupDirection.grid} type={KbaseDataTypes.all} />
      </div>
    </>
  );
};

export default KnowledgeBaseSections;
