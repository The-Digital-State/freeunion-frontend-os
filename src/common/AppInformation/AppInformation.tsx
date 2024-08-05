import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const config = require('../../../package.json');

export function AppInformation() {
  const [secondLogo, setSecondLogo] = useState(false);

  useEffect(() => {
    const inverval = setInterval(() => {
      setSecondLogo(!secondLogo);
    }, 1000 * 5);

    return () => {
      clearInterval(inverval);
    };
  }, [secondLogo]);

  return (
    <>
      <Helmet>
        <link rel="icon" href={`./images/logo/${!secondLogo ? 'vio' : 'red'}.png`} />
      </Helmet>

      <pre style={{ display: 'none' }}>version: {config.version}</pre>
    </>
  );
}
