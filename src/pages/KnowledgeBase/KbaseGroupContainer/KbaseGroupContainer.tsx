import { useSsrEffect, useSsrState } from '@issr/core';
import { GlobalContext } from 'contexts/GlobalContext';
import { useContext, useEffect } from 'react';
import { getMaterials, getOrganizationMaterials, getOrganizationSections, getSections } from 'services/knowledge-base';
import { KbaseMaterialFront, KbaseSection } from 'shared/interfaces/kbase';
import KbaseGroup from '../KbaseGroup/KbaseGroup';

export enum KbaseGroupDirection {
  slider,
  grid,
  list,
}

export enum KbaseVariety {
  material,
  section,
}

export enum KbaseDataTypes {
  all = 'all',
  organisation = 'organisation',
}

const config = {
  [KbaseVariety.material]: {
    [KbaseDataTypes.all]: {
      method: getMaterials,
      sort: { sortBy: 'id' },
      title: 'Все статьи',
    },
    [KbaseDataTypes.organisation]: {
      method: getOrganizationMaterials,
      sort: { sortBy: 'id' },
      title: '',
    },
  },
  [KbaseVariety.section]: {
    [KbaseDataTypes.all]: {
      method: getSections,
      sort: {},
      title: 'Все разделы',
    },
    [KbaseDataTypes.organisation]: {
      method: getOrganizationSections,
      sort: {},
      title: '',
    },
  },
};

interface Props {
  variant: KbaseVariety;
  type: KbaseDataTypes;
  organisationId?: number;
  tags?: string[];
  direction?: KbaseGroupDirection;
  title?: string;
}

const KbaseGroupContainer = ({ variant, type, organisationId, tags, direction, title }: Props) => {
  const [materials, setMaterials] = useSsrState<KbaseMaterialFront[]>([]);
  const [sections, setSections] = useSsrState<KbaseSection[]>([]);
  const [metaPageData, setMetaPageData] = useSsrState<{ last_page: number; current_page: number }>(null);

  const {
    isMounted,
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const isListDirection = direction === KbaseGroupDirection.list || direction === KbaseGroupDirection.grid;

  const loadData = async (limit?: number) => {
    const { method, sort } = config[variant][type];

    let requestedData;
    const defaultObj = {
      ...sort,
      ...{
        tags,
        limit: isListDirection ? 9 : limit,
        page: isListDirection && metaPageData?.current_page ? metaPageData.current_page + 1 : 1,
      },
    };
    let obj;

    if (type === KbaseDataTypes.all) {
      obj = defaultObj;
    } else {
      obj = { ...defaultObj, organisationId };
    }

    const { data, meta } = await method(obj);
    requestedData = data;

    if (isListDirection) setMetaPageData({ current_page: meta.current_page, last_page: meta.last_page });

    if (variant === KbaseVariety.material) {
      setMaterials(isListDirection ? [...materials, ...requestedData] : requestedData);
    } else {
      setSections(isListDirection ? [...sections, ...requestedData] : requestedData);
    }
  };

  useSsrEffect(async () => {
    await loadData();
  });

  useEffect(() => {
    if (!type) {
      return;
    }

    if (isMounted) {
      (async () => {
        showSpinner();
        await loadData();
        hideSpinner();

        // load all data, temp fix
        // loadData();
      })();
    }
  }, [type, variant, isMounted]);

  if (!sections?.length && !materials.length) {
    return null;
  }

  return (
    <KbaseGroup
      loadData={loadData}
      hasMoreData={metaPageData?.current_page < metaPageData?.last_page}
      materials={materials}
      sections={sections}
      title={
        title !== undefined
          ? title
          : !!tags?.length
          ? `Статьи по теме: ${tags?.join(',')}`
          : type
          ? config[variant][type].title
          : 'База объединения'
      }
      type={type}
      variety={variant}
      direction={direction}
    />
  );
};

export default KbaseGroupContainer;
