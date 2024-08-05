import { useEffect, useRef, useState } from 'react';
import styles from './DialogModal.module.scss';
import { useSelector, useDispatch } from '../../../../redux';
import ConversationModalContent from '../ConversationModalContent/ConversationModalContent';
import MessageModalContent from '../MessageModalContent/MessageModalContent';

import { setDialogOptions } from 'shared/slices/chat';
import { ChatModalProps } from 'shared/interfaces/chat';

interface DialogModalProps {
  modalProps: ChatModalProps
}
const defaultCorrections = { top: 0, left: 0 };
const CORRECTION_VALUE = 30;

function DialogModal({ modalProps }: DialogModalProps) {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const { isOpen, left, top, isMessageModal, isMine } = useSelector((state) => state.chat.dialogOptions);
  const closeModal = () => {
    setCorrections(defaultCorrections)
    dispatch(setDialogOptions({ top: '', left: '', isOpen: false }));
  };
  const [corrections, setCorrections] = useState(defaultCorrections)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModal();
      }
    };
   
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const rect = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.right > viewportWidth) {
        setCorrections(value => ({ ...value, left: rect.right - viewportWidth + CORRECTION_VALUE }))
      }
      if (rect.bottom > viewportHeight) {
        setCorrections(value => ({ ...value, top: rect.bottom - viewportHeight + CORRECTION_VALUE }))
      } else if (rect.top < 0) {
        setCorrections(value => ({ ...value, top: rect.top }))
      }
    }
  }, [isOpen, left, top])

  if (!isOpen) return null
  return (
    <div
      className={`${styles.wrapper} ${isMine && isMessageModal ? styles.mine : ''}`}
      ref={ref}
      style={{
        left: left - corrections.left,
        top: top - corrections.top,
      }}
    >
      {isMessageModal ? <MessageModalContent isMine={isMine} modalProps={modalProps} /> : <ConversationModalContent />}
    </div>
  );
}

export default DialogModal;
