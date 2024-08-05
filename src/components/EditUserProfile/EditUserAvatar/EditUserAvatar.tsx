import React, { useContext, useState } from 'react';
import styles from './EditUserAvatar.module.scss';
import { CustomImage } from '../../../common/CustomImage/CustomImage';
import { Button } from '../../../shared/components/common/Button/Button';
import { InputFile } from '../../../common/InputFile/InputFile';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { GlobalDataContext } from '../../../contexts/GlobalDataContext';

type IEditUserAvatar = {
  disabled?: boolean;
};

export function EditUserAvatar({ disabled = false }: IEditUserAvatar) {
  const {
    services: { userService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const { user, setUser } = useContext(GlobalDataContext);

  const [newAvatar, setNewAvatar] = useState<string | ArrayBuffer>(null);
  const [loadingAvatarError, setLoadingAvatarError] = useState<string>(null);

  const onFileChange = (files: File[]) => {
    const fileReader = new FileReader();
    const fileTypes = ['jpg', 'jpeg', 'png', 'webp', 'apng', 'bmp'];

    if (!files?.length) {
      return;
    }

    if (!files[0].type.includes('image') || !fileTypes.some((type) => files[0].type.includes(type))) {
      setLoadingAvatarError('Некорректный формат файла');
      return;
    }

    fileReader.onloadend = () => {
      setNewAvatar(fileReader.result);
    };
    fileReader.onerror = () => {
      setLoadingAvatarError('Ошибка загрузки файла');
    };
    fileReader.onabort = () => {
      setLoadingAvatarError('Ошибка загрузки файла');
    };

    fileReader.readAsDataURL(files[0]);
    setLoadingAvatarError(null);

    setTimeout(() => {
      const el = document.getElementById('confirm-updating-avatar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 700);
  };

  const onUpdateAvatar = async (file: File) => {
    try {
      showSpinner();
      const result = await userService.updateAvatar(file);
      if (result.ok) {
        setUser({ ...user, public_avatar: result.url });
        setNewAvatar(null);
      }
    } finally {
      hideSpinner();
    }
  };

  return (
    <div className={styles.EditUserAvatar}>
      <div className={styles.imageContainer}>
        <div className={styles.profileImage}>
          <InputFile name="loadFile" onChange={onFileChange} disabled={disabled}>
            <CustomImage
              src={newAvatar ? newAvatar : user?.public_avatar}
              alt="Avatar"
              rounded={false}
              background="white"
              width={190}
              height={190}
            >
              +
            </CustomImage>
          </InputFile>
        </div>
      </div>
      <div className={styles.imageDescription}>
        <h3>аватар</h3>
        <span>Выберите фото с хорошим содержанием, чтобы не попасть в блокировку платформы</span>
      </div>
      <div className={styles.loadImage}>
        {newAvatar ? (
          <div id="confirm-updating-avatar" className={`${styles.confirm} form-group`}>
            <Button color="light" onClick={() => setNewAvatar(null)}>
              Отменить
            </Button>
            <Button onClick={onUpdateAvatar.bind(null, newAvatar)}>Сохранить</Button>
          </div>
        ) : (
          <>
            <span className="highlight">{loadingAvatarError}</span>
            <InputFile name="loadFile" onChange={onFileChange} disabled={disabled} />
          </>
        )}
      </div>
    </div>
  );
}
