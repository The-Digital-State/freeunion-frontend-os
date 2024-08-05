import React, { useContext, useEffect } from 'react';
import styles from './GlobalModal.module.scss';
import { GlobalContext } from '../../contexts/GlobalContext';
import { CloseButton } from 'common/CloseButton/CloseButton';

export function GlobalModal() {
  const {
    globalModalOptions: {
      params: { mainContainer },
    },
    closeModal,
  } = useContext(GlobalContext);

  const handleKeyUp = (event) => {
    if (event.keyCode === 27) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyUp, false);
    return () => {
      document.removeEventListener('keydown', handleKeyUp, false);
    };
  }, []);
  return (
    <>
      <div className={styles.background}></div>
      <div className={styles.GlobalModal} onKeyUp={handleKeyUp}>
        <main className="p">
          <CloseButton onClick={closeModal} className={styles.close} size="medium" />
          {mainContainer}
        </main>

        {/*<Topbar leftContainer={topbarLeftContainer} rightContainer={topbarRightContainer}/>*/}
        {/*<div className={styles.main}>{mainContainer}</div>*/}
        {/*<Footer>*/}
        {/*    <div className='p-md-right p-lg-right p-xl-right p-xxl-right' style={{width: '20rem'}}>*/}
        {/*        <Button icon='arrowLeft' iconPosition='left' onClick={closeModal}>Закрыть</Button>*/}
        {/*    </div>*/}
        {/*</Footer>*/}
      </div>
    </>
  );
}
