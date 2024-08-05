import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '../../../../redux';
import { setVisiability, moveCard, moveCardWithComment } from 'shared/slices/tasks';
import { CardInfo } from '../../../services/tasks.service';
import { ReactComponent as MenuIcon } from 'shared/public/icons/menu-icon.svg';
import { ReactComponent as TaskSquireIcon } from 'shared/public/icons/task-squire.svg';
import { ReactComponent as UserCircleIcon } from 'shared/public/icons/user-circle.svg';
import { ReactComponent as GalleryIcon } from 'shared/public/icons/gallery.svg';
import { ReactComponent as CircleArrowIcon } from 'shared/public/icons/circle-arrow.svg';
import styles from './CardActions.module.scss';
import CommentCardModal from '../CommentCardModal/CommentCardModal';

interface Props {
  handeleUserModalOpen: () => void;
  card: CardInfo;
  orgId: string;
  closeModal: () => void;
  openModal: (component: object, modalProps?: object) => void;
  isAdminApp: boolean;
}

const CardActions: FC<Props> = ({ handeleUserModalOpen, card, orgId, isAdminApp, closeModal, openModal }) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const dialogRef = useRef(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const dispatch = useDispatch();
  const columns = useSelector((state) => state.tasks.columns);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [open]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(true);
    const rect = ref.current.getBoundingClientRect();
    setPosition({ top: rect.top, left: rect.left - 50 });
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setOpen(false);
  };

  const onSelect = (event: React.MouseEvent<HTMLDivElement>, key) => {
    handleClose(event);
    if (key) {
      dispatch(setVisiability({ key, value: true }));
    }
  };

  const handleMove = async (e) => {
    e.stopPropagation();
    closeModal()
    dispatch(
      moveCard({
        source: { droppableId: `${card.column_id}` },
        destination: { droppableId: `${card.column_id + 1}` },
        draggableId: card.id,
        columns,
        orgId,
      })
    );
    openModal(
      <CommentCardModal
        onClose={async (comment) => {
          closeModal();
          dispatch(
            moveCardWithComment({
              orgId,
              comment,
              isAdminApp
            })
          );
        }}
      />
    );
  };

  return (
    <>
      <button onClick={handleClick} ref={ref} className={styles.button}>
        <MenuIcon />
      </button>
      {open && (
        <div
          className={styles.wrapper}
          style={{
            ...position,
          }}
          ref={dialogRef}
        >
          <div onClick={(e) => onSelect(e, 'checklist')} className={styles.item}>
            <TaskSquireIcon />
            <p>Чеклист</p>
          </div>
          <div
            onClick={(e) => {
              handeleUserModalOpen();
              handleClose(e);
            }}
            className={styles.item}
          >
            <UserCircleIcon />
            <p>Участники</p>
          </div>
          <div className={styles.item} onClick={(e) => onSelect(e, 'image')}>
            <GalleryIcon />
            <p>Изображение</p>
          </div>
          <div className={styles.item} onClick={handleMove}>
            <CircleArrowIcon />
            <p>Переместить</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CardActions;
