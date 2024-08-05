import { useRef } from 'react';

import { ReactComponent as LinkIcon } from '../../../icons/attach.svg';
import { ReactComponent as AddImageIcon } from '../../../icons/add-image.svg';

import styles from './SideToolbar.module.scss';

export function SideToolbar({ top, onAddImage, onAddLink }) {
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className={styles['side-toolbar']} style={{ top: top - 2 }}>
      <button className={styles['side-toolbar-btn']} onClick={onAddLink}>
        <LinkIcon />
      </button>
      <input type="file" ref={hiddenFileInput} onChange={onAddImage} style={{ display: 'none' }} />
      <button className={styles['side-toolbar-btn']} onClick={handleClick}>
        <AddImageIcon />
      </button>
    </div>
  );
}
