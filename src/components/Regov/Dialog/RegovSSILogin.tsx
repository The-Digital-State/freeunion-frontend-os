import React, { FunctionComponent, Suspense } from 'react';
import { RegovSSILoginProps } from './types';

const RegovSSILogin: FunctionComponent<RegovSSILoginProps> = React.lazy(() => import('./SSILogin'));

export const openRegovSSILoginBuilder = (props: RegovSSILoginProps) => () => {
  props.openModal({
    params: {
      mainContainer: (
        <Suspense fallback={<div>Загружается. Ждите...</div>}>
          <RegovSSILogin {...props} />
        </Suspense>
      ),
    },
  });
};
