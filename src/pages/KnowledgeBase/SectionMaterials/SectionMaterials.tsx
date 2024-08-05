import styles from './SectionMaterials.module.scss';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { getSectionMaterials } from 'services/knowledge-base';
import MaterialCard from '../MaterialCard/MaterialCard';
import { KbaseMaterialFront } from 'shared/interfaces/kbase';
import { useSsrEffect, useSsrState } from '@issr/core';

const SectionMaterials = () => {
  const { organizationId, sectionId } = useParams<{ organizationId: string; sectionId: string }>();
  const [materials, setMaterials] = useSsrState<KbaseMaterialFront[]>([]);
  const [serverError, setServerError] = useSsrState(null);

  async function loadMaterials() {
    if (!!organizationId && !!sectionId) {
      const response = await getSectionMaterials(+organizationId, +sectionId);
      setMaterials(response);
    }
  }

  useSsrEffect(async () => {
    try {
      await loadMaterials();
    } catch (error) {
      console.log(formatServerError(error));
      setServerError(formatServerError(error));
    }
  });

  useEffect(() => {
    (async () => {
      try {
        await loadMaterials();
      } catch (e) {
        toast.error(formatServerError(e));
      }
    })();
  }, [organizationId, sectionId]);

  if (serverError) {
    return <div>{serverError}</div>;
  }

  if (!materials.length) return null;

  return (
    <div className={styles.wrapper}>
      <h2>Раздел: {materials[0].section.name}</h2>
      <div className={styles.materials}>
        {materials.map((material) => {
          return <MaterialCard material={material} />;
        })}
      </div>
    </div>
  );
};

export default SectionMaterials;
