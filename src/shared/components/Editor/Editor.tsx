import { useEffect, useRef, useState } from 'react';
import styles from './Editor.module.scss';
import { toast } from 'react-toastify';
import { get, last } from 'lodash';
import { useParams } from 'react-router';
// @ts-ignore
import { uploadImage } from 'services/api/news';
// TODO: lib styles move somewhere
import 'react-quill/dist/quill.bubble.css';
import { SideToolbar } from './SideToolbar/SideToolbar';
import {
  addLinkPlaceholderToLine,
  removeLinkPlaceholderToLine,
  isEmptyLineByIndex,
  insertLink,
  insertImage,
} from './helpers';

type EditorProps = {
  title: string;
  content: string;
  onChange: (type: 'title' | 'content', title: string) => void;
};

let ReactQuill;
let block;

export default function Editor({ title, content, onChange }: EditorProps) {
  const [sideBarTop, setSideBarTop] = useState(0);
  const [showSideToolbar, setShowSideToolbar] = useState(false);
  const [showSideBarPlaceholder, setShowSideBarPlaceholder] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const contentRef = useRef(null);
  const { organizationId } = useParams<{ organizationId?: string; newsId?: string }>();

  useEffect(() => {
    // not working with SSR
    // https://github.com/zenoamaro/react-quill/issues/389
    ReactQuill = require('react-quill');
    setForceUpdate(Math.random());
    if (!block) {
      require('./block');
    }
  }, []);

  useEffect(() => {
    document.querySelector('.ql-tooltip-editor input')?.setAttribute('data-link', 'http://...');
  }, [forceUpdate]);

  const handleShowSideToolbar = (unprivilegedEditor, range) => {
    setShowSideBarPlaceholder(false);
    if (range) {
      const { editor } = contentRef.current;
      if (isEmptyLineByIndex(editor, range.index)) {
        const { top } = unprivilegedEditor.getBounds(range.index);
        setSideBarTop(top);
        setShowSideToolbar(true);
      } else {
        setShowSideToolbar(false);
      }
    }
  };

  const handleChangeContent = (content, _delta, _source, unprivilegedEditor) => {
    onChange('content', content);

    const range = unprivilegedEditor.getSelection();
    handleShowSideToolbar(unprivilegedEditor, range);

    if (showSideBarPlaceholder) {
      setShowSideBarPlaceholder(false);
    }
  };

  const handleChangeSelection = (range, _source, unprivilegedEditor) => {
    handleShowSideToolbar(unprivilegedEditor, range);
  };

  const handleAddImage = (e) => {
    setShowSideToolbar(false);

    const fileReader = new FileReader();
    const { editor } = contentRef?.current;
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = async () => {
      try {
        contentRef?.current?.focus();
        //startLoading
        const {
          data: { url },
        } = await uploadImage(organizationId, fileReader.result);
        insertImage(editor, url);
        setShowSideToolbar(false);
        //finishLoading
      } catch (error) {
        toast.error('Что-то пошло не так!');
        console.error(error);
      }
    };
  };

  const handleAddLink = () => {
    setShowSideToolbar(false);
    const { editor } = contentRef?.current;
    editor.root.classList.remove('ql-blank');

    const position = editor.getSelection().index;
    addLinkPlaceholderToLine(editor, position);
    contentRef?.current?.focus();

    editor.once('text-change', (delta) => {
      removeLinkPlaceholderToLine(editor, position);

      const value = get(last(delta.ops), 'insert', '');
      editor.history.undo();
      insertLink(editor, value, position);
    });

    editor.once('selection-change', () => {
      removeLinkPlaceholderToLine(editor, position);
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const { index } = contentRef.current.getEditorSelection();
      const [block] = contentRef.current.editor.getLine(index);

      block.domNode.scrollIntoView({ block: 'center' });
    }
  };

  const modules = {
    toolbar: [['bold', 'italic', 'link', { header: 1 }, { header: 2 }, 'blockquote']],
  };
  if (!ReactQuill) {
    return <div></div>;
  }
  return (
    <div className={styles['content-editor']}>
      <textarea
        className={styles['title-input']}
        placeholder="Заголовок"
        value={title}
        onChange={(e) => {
          onChange('title', e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();

            contentRef?.current?.focus();
          }
        }}
      />
      <div className={styles['editor-container']}>
        {showSideToolbar && <SideToolbar top={sideBarTop} onAddImage={handleAddImage} onAddLink={handleAddLink} />}
        <ReactQuill
          className={styles['editor']}
          ref={contentRef}
          theme="bubble"
          placeholder="Ваша история"
          value={content}
          onChangeSelection={handleChangeSelection}
          onChange={handleChangeContent}
          onBlur={() => setShowSideToolbar(false)}
          onKeyDown={handleKeyDown}
          modules={modules}
        />
      </div>
    </div>
  );
}
