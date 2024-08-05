import { useRef } from 'react';
import type { FC } from 'react';
import Section from '../Section/Section';
import { addImage, removeImage } from 'shared/services/tasks.service';
import { useDispatch } from '../../../../redux';
import { setCardData } from 'shared/slices/tasks';
import { toast } from 'react-toastify';
import styles from './ImageSection.module.scss';
import buttonStyles from 'shared/components/common/Button/Button.module.scss';
import formatServerError from 'shared/utils/formatServerError';

interface Props {
  cardId: string;
  getCardData: () => void;
  images: { id: string; image: string }[];
  orgId: string;
}

const ImageSection: FC<Props> = (props) => {
  const { cardId, images, getCardData, orgId } = props;
  const hiddenFileInput = useRef(null);

  const dispatch = useDispatch();
  const handleFileInput = async (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = async () => {
      try {
        const {
          data: {
            data: { image: newImage },
          },
        } = await addImage(orgId, cardId, reader.result);
        dispatch(setCardData({ key: 'image', value: newImage }));
        getCardData();
      } catch (error) {
        toast.error(formatServerError(error));
        console.error(error);
      }
    };
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await removeImage(orgId, cardId, imageId);
      getCardData();
    } catch (error) {
      toast.error(formatServerError(error));
      console.error(error);
    }
  };

  return (
    <>
      <input type="file" ref={hiddenFileInput} onChange={handleFileInput} style={{ display: 'none' }} />
      <Section
        title="Изображение"
        actions={
          <button onClick={handleClick} className={buttonStyles.textButton}>
            Добавить
          </button>
        }
      >
        {images.length > 0 && (
          <div className={styles.wrapper}>
            {images.map((img) => (
              <div key={img.id} className={styles.content}>
                <img src={img.image} width="200px" height={'150px'} alt={img.id} />
                <div className={styles.buttonWrapper}>
                  <button className={buttonStyles.textButton} onClick={() => handleDeleteImage(img.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
};

export default ImageSection;
