import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { AutoSizeTextArea } from '../../components/common/AutoSizeTextArea/AutoSizeTextArea';

import { sendMessage } from 'shared/slices/chat';
import { useDispatch, useSelector } from '../../../redux';

import { ReactComponent as GalleryIcon } from '../../icons/galleryAdd.svg';
import { ReactComponent as FileIcon } from '../../icons/file.svg';
import { ReactComponent as DeleteIcon } from '../../icons/delete.svg';
import { ReactComponent as SendIcon } from '../../icons/send.svg';
import { ReactComponent as EmojiIcon } from '../../icons/emoji.svg';

import styles from './ChartMessageAdd.module.scss';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { CHAT_INPUT_ID } from '../../interfaces/chat';
import classNames from 'classnames';

const emojiTranslations = {
  search: 'Поиск',
  clear: 'Очистить', // Accessible label on "clear" button
  notfound: 'Не найдены',
  skintext: 'Выберити скин',
  categories: {
    search: 'Поиск',
    recent: 'Недавно использованы',
    smileys: 'Smileys & Emotion',
    people: 'Люди',
    nature: 'Природа',
    foods: 'Еда и напитки',
    activity: 'Активность',
    places: 'Путешесвия',
    objects: 'Обьекты',
    symbols: 'Символы',
    flags: 'Флаги',
    custom: '',
  },
  categorieslabel: 'Emoji категории', // Accessible title for the list of categories
};

const ChatMessageAdd: FC = () => {
  const dispatch = useDispatch();
  const activeThreadId = useSelector((state) => state.chat.activeThreadId);
  const isReply = useSelector((state) => state.chat.isReply);

  const selectedMessage = useSelector((state) => {
    if (state.chat.selectedMessageId) {
      return state.chat.messages.filter(({ id }) => id === state.chat.selectedMessageId)[0];
    } else {
      return null;
    }
  });
  const threads = useSelector((state) => state.chat.threads);
  const [thread] = (threads || []).filter(({ id }) => activeThreadId === id);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const emojiRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [body, setBody] = useState<string>('');
  const [file, setFile] = useState<any>(null);
  const [fileLink, setFileLink] = useState<string>('');
  const [image, setImage] = useState<any>(null);

  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showEmoji]);

  const focusOnInput = () => {
    const elem = document.getElementById(CHAT_INPUT_ID);
    if (elem) {
      elem.focus();
    }
  };
  useEffect(() => {
    setBody('');
    resetFile();
    focusOnInput();
  }, [activeThreadId]);

  useEffect(() => {
    document.addEventListener('keypress', onEnterClick, true);
    return () => {
      document.removeEventListener('keypress', onEnterClick, true);
    };
  }, []);
  const onEnterClick = (event) => {
    const keyName = event.key;
    if (keyName === 'Enter') {
      document.getElementById('send-message-button')?.click();
    }
  };
  const handleAttachImage = (): void => {
    imageInputRef.current.click();
  };

  const handleAttachFile = (): void => {
    fileInputRef.current.click();
  };

  const handleChange = (value): void => {
    if (value.trim().length === 0) {
      setBody('');
    } else {
      setBody(value);
    }
  };

  const handleSend = async () => {
    if (!body && !file && !image) {
      return;
    }
    let content = body;
    let type = 'text';
    if (!isReply) {
      if (file) {
        content = file;
        type = 'file';
      } else if (image) {
        content = image;
        type = 'image';
      }
    }
    setBody('');
    resetFile();
    await dispatch(sendMessage(activeThreadId, content, type));
  };

  const addEmoji = (e) => {
    setBody(`${body}${e.native}`);
    setShowEmoji(false);
    focusOnInput();
  };

  const resetFile = () => {
    setFile(null);
    setImage(null);
    setFileLink('');
    URL.revokeObjectURL(fileLink);
  };

  const handleImgUpload = async (file) => {
    if (file) {
      setFile(null);
    }
    setFileLink(URL.createObjectURL(file));
    setImage(file);
    setBody('');
  };
  return (
    <div className={styles.wrapper}>
      {!!fileLink && !isReply && (
        <div className={styles.fileLink}>
          <a target="_blank" href={fileLink} rel="noreferrer">
            {file?.name || image?.name || 'Файл'}
          </a>
          <DeleteIcon onClick={resetFile} />
        </div>
      )}
      {isReply && <div className={styles.fileLink}>{selectedMessage?.content}</div>}
      <div className={styles.InputWrapper} ref={inputRef}>
        <div className={styles.icons}>
          {!isReply && (
            <button onClick={handleAttachImage} className={styles.FileIcon}>
              <GalleryIcon />
            </button>
          )}
          {!isReply && (
            <button onClick={handleAttachFile} className={styles.FileIcon}>
              <FileIcon />
            </button>
          )}
        </div>
        <AutoSizeTextArea
          name={CHAT_INPUT_ID}
          disabled={!!fileLink || thread?.is_blocked}
          valueChange={handleChange}
          placeholder="Введите сообщение"
          value={body}
          className={classNames(styles.TextareaContent)}
          onPaste={(event) => {
            if (event.clipboardData.files.length) {
              handleImgUpload(event.clipboardData.files[0]);
            }
          }}
        />
        <div className={styles.icons}>
          <button
            disabled={(!body && !fileLink) || thread?.is_blocked}
            onClick={handleSend}
            id="send-message-button"
            className={styles.FileIcon}
          >
            <SendIcon />
          </button>

          <button onClick={() => setShowEmoji(!showEmoji)} className={styles.FileIcon}>
            <EmojiIcon />
          </button>
        </div>
        {showEmoji && (
          <div ref={emojiRef} className={styles.emojiWrapper}>
            <Picker onSelect={addEmoji} i18n={emojiTranslations} />
          </div>
        )}
      </div>

      <input
        hidden
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImgUpload(e.target.files[0])}
      />
      <input
        hidden
        ref={fileInputRef}
        type="file"
        onChange={async (e) => {
          if (image) {
            setImage(null);
          }
          setFileLink(URL.createObjectURL(e.target.files[0]));
          setFile(e.target.files[0]);
          setBody('');
        }}
      />
    </div>
  );
};

export default ChatMessageAdd;
