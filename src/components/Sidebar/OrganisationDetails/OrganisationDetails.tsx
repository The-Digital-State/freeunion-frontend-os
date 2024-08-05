import React from 'react';
import styles from './OrganisationDetails.module.scss';
import { IOrganisation } from '../../../interfaces/organisation.interface';
import { CustomImage } from '../../../common/CustomImage/CustomImage';

type IOrganisationDetailProps = {
  organisation?: IOrganisation;
  showAllData?: boolean;
};

export function OrganisationDetails({ organisation, showAllData = true }: IOrganisationDetailProps) {
  return (
    organisation && (
      <div className={`${styles.OrganisationDetails} p-right`}>
        {showAllData && (
          <>
            <div className={styles.avatar}>
              <CustomImage
                src={organisation?.avatar}
                alt={organisation?.short_name}
                width={123}
                height={123}
                background="white"
                errorImage="noImage"
              />
            </div>
            <div className={styles.heading}>
              <h3>
                {organisation.type_name} {organisation.name}
              </h3>
            </div>
          </>
        )}
        {!showAllData && <div>{organisation.short_name}</div>}
        <br />
        <div className={styles.description}>
          <p>{organisation.description}</p>
          <br />
        </div>
      </div>
    )
  );
}
