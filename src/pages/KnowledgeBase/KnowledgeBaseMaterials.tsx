import { Helmet } from 'react-helmet';
import Navigation from 'common/Navigation/Navigation';
import KbaseGroupContainer, { KbaseDataTypes, KbaseGroupDirection, KbaseVariety } from './KbaseGroupContainer/KbaseGroupContainer';
import { navigationKbase } from 'constans/navigationKbase';
import { GlobalContext } from 'contexts/GlobalContext';
import { useContext } from 'react';

const KnowledgeBaseMaterials = () => {
  const { screen } = useContext(GlobalContext);
  const allMaterialDirection = screen.innerWidth <= 680 ? KbaseGroupDirection.list : KbaseGroupDirection.grid;

  return (
    <>
      <Helmet>
        <title>База знаний: статьи</title>
        <meta name="description" content="База знаний: статьи" />
      </Helmet>

      <div>
        <Navigation navigations={navigationKbase()} />
        <KbaseGroupContainer
          variant={KbaseVariety.material}
          direction={KbaseGroupDirection.slider}
          type={KbaseDataTypes.all}
          title="Обучение"
          tags={['обучение']}
        />
        <KbaseGroupContainer variant={KbaseVariety.material} direction={allMaterialDirection} type={KbaseDataTypes.all} />

        {/* <KbaseGroupContainer
          variant={KbaseVariety.material}
          direction={KbaseGroupDirection.slider}
          type={KbaseDataTypes.all}
          title="Советы, кейсы"
          tags={['советы', 'кейсы']}
        /> */}
      </div>
    </>
  );
};

export default KnowledgeBaseMaterials;
