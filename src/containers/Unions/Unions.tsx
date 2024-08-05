import { useContext, useState, useEffect } from 'react';
import { Button } from 'shared/components/common/Button/Button';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { IOrganisationShort } from 'interfaces/organisation.interface';
import { routes } from 'Routes';
import { Input } from 'shared/components/common/Input/Input';
import styles from './Unions.module.scss';
import { GlobalContext } from 'contexts/GlobalContext';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { useSsrEffect, useSsrState } from '@issr/core';
import { Select } from 'shared/components/common/Select/Select';
import { dictionariesService } from 'services';
import { IOrganisationTypes } from 'interfaces';
import { Spinner } from 'common/Spinner/Spinner';
import AllianceInfoShort from 'containers/Alliance/AllianceInfoShort/AllianceInfoShort';
import InfiniteScrollList from 'components/InfiniteScrollList/InfiniteScrollList';

interface IFilters {
  search?: string;
  organizationTypes?: number[];
}

const DEFAULT_FILTERS: IFilters = {
  search: '',
  organizationTypes: [],
};

function Unions() {
  const { unionEnterRequests, user } = useContext(GlobalDataContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [organisations, setOrganizations] = useSsrState<IOrganisationShort[]>([]);
  const [metaPageData, setMetaPageData] = useState<{ last_page: number; current_page: number }>();
  const [searchOrganizationTitle, setSearchOrganizationTitle] = useState<string>('');
  const [organizationTypes, setOrganizationTypes] = useState<IOrganisationTypes[]>([]);
  const [filters, setFilters] = useState<IFilters>({
    search: '',
    organizationTypes: [],
  });
  const {
    services: { organisationsService },
  } = useContext(GlobalContext);

  useEffect(() => {
    getOrganizations({});
    getOrganizationsTypes();
  }, []);

  useSsrEffect(async () => {
    try {
      await getOrganizations({});
      await getOrganizationsTypes();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (user) {
      unionEnterRequests.getUnionEnterRequests();
    }
  }, []);

  useEffect(() => {
    getOrganizations({});
  }, [filters]);

  async function getOrganizationsTypes() {
    try {
      setIsLoading(true);
      const organizationTypes = await dictionariesService.getOrganisationTypes();
      setOrganizationTypes(organizationTypes);
    } catch (error) {
      toast.error(formatServerError(error));
    }

    setIsLoading(false);
  }

  async function getOrganizations({ infinityFetch, reset }: { infinityFetch?: boolean; reset?: boolean }) {
    try {
      if (reset) {
        setSearchOrganizationTitle('');
        setFilters(DEFAULT_FILTERS);
      } else {
        setSearchOrganizationTitle(filters.search);
      }
      if (!infinityFetch) {
        setIsLoading(true);
      }
      const { data: requestedOrganizations, meta } = await organisationsService.getOrganisations({
        name: !reset ? filters.search : '',
        page: !infinityFetch ? 1 : metaPageData.current_page + 1,
        type_id: !reset ? filters.organizationTypes : [],
      });
      setMetaPageData({ current_page: meta.current_page, last_page: meta.last_page });
      setOrganizations(infinityFetch ? [...organisations, ...requestedOrganizations] : requestedOrganizations);
    } catch (error) {
      toast.error(formatServerError(error));
    } finally {
      if (!infinityFetch) {
        setIsLoading(false);
      }
    }
  }

  function changeFilters(value, name) {
    setFilters({
      ...filters,
      [name]: value,
    });
  }

  return (
    <div>
      <Helmet>
        <title>Объединения</title>
      </Helmet>
      <div className={styles.selectWrap}></div>

      {/* <div className={style.selectWrap}>
          <Select
            options={selectCountry.map((item) => item)}
            value={selectCountry.map((item) => item.name)}
            label="Регион"
            description="Выберите регион"
            labelKey="name"
            multiselect={true}
            onSelect={handleSelect}
          />
        </div>
        <div className={style.selectWrap}>
          <Select
            options={areaInterest.map((item) => item)}
            value={areaInterest.map((item) => item.name)}
            label="Сфера интересов"
            description="Выберите сферу интересов"
            labelKey="name"
            multiselect={true}
            onSelect={handleSelect}
          />
        </div>
        <div className={style.selectWrap}>
          <Select
            options={formUnion.map((item) => item)}
            value={formUnion.map((item) => item.name)}
            label="Форма объединения"
            description="Выберите форму объединения"
            labelKey="name"
            multiselect={true}
            onSelect={handleSelect}
          />
        </div> */}
      <div className={styles.searchWrapper}>
        <Input
          name="search"
          valueChange={(value) => {
            changeFilters(value, 'search');
          }}
          className={styles.searchInput}
          value={filters.search}
          placeholder="Поиск..."
        />
        <Select
          name="organizationTypes"
          options={organizationTypes.map((item) => item)}
          className={styles.removeBtn}
          value={filters.organizationTypes.map((item) => item)}
          label="Форма объединения"
          description="Выберите форму объединения"
          labelKey="name"
          multiselect={true}
          onSelect={changeFilters}
        />
        <Button
          color="light"
          onClick={() => getOrganizations({ reset: true })}
          disabled={!searchOrganizationTitle.length && !filters.organizationTypes.length}
          type="reset"
          className={!searchOrganizationTitle.length && !filters.organizationTypes.length ? styles.removeBtn : ''}
        >
          Сброс
        </Button>
      </div>
      {!!searchOrganizationTitle && <h3 className={styles.searchOrganizationTitle}>Поиск по "{searchOrganizationTitle}"</h3>}
      {!!user && (
        <div className={styles.wrapperCreateBtn}>
          <Button to={routes.CREATE_UNION} dataCy="create-union" className={styles.createBtn}>
            <div>
              Создать <label className={styles.removeLabel}>объединение</label>
            </div>
          </Button>
        </div>
      )}
      {isLoading ? (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      ) : (
        <InfiniteScrollList
          data={organisations}
          next={() => getOrganizations({ infinityFetch: true })}
          hasMore={metaPageData?.current_page < metaPageData?.last_page}
          listContent={
            <div>
              {organisations.map((organisation, index) => {
                // @ts-ignore
                return <AllianceInfoShort key={organisation.id} organisation={organisation} index={index + 1} />;
              })}
            </div>
          }
          endMessage="Больше организаций нет"
          dontFindData="Объединений не найдено"
        />
      )}
    </div>
  );
}

export default Unions;
