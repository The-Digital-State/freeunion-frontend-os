import { useEffect } from 'react';

const CONTAINER_ID = 'commento';
const SCRIPT_ID = 'commento-script';
const COMMENTO_URL = '/libs/commento/commento.js';
const COMMENTO_CSS = '/libs/commento/commento.css';

interface DataAttributes {
  [key: string]: string | boolean | undefined;
}

const insertScript = (src: string, id: string, parentElement: HTMLElement, dataAttributes: DataAttributes) => {
  const script = window.document.createElement('script');
  script.async = true;
  script.src = src;
  script.id = id;

  Object.entries(dataAttributes).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    script.setAttribute(`data-${key}`, value.toString());
  });

  parentElement.appendChild(script);
};

const removeScript = (id: string, parentElement: HTMLElement) => {
  const script = window.document.getElementById(id);
  if (script) {
    parentElement.removeChild(script);
  }
};

const handleCommentNew = (pageId: string) => {
  window.dataLayer.push({
    event: 'event',
    eventProps: {
      category: 'comments',
      action: 'create',
      value: pageId,
    },
  });
};

const handleCommentEdit = (pageId: string) => {
  window.dataLayer.push({
    event: 'event',
    eventProps: {
      category: 'comments',
      action: 'edit',
      value: pageId,
    },
  });
};

const Commento = ({ id, autoInit, hideDeleted, pageId }: { id: string; autoInit?: boolean; hideDeleted?: boolean; pageId?: string }) => {
  useEffect(() => {
    if (!window) {
      return;
    }
    const document = window.document;
    const commento = document.getElementById('commento');
    if (commento) {
      insertScript(COMMENTO_URL, SCRIPT_ID, document.body, {
        'css-override': COMMENTO_CSS,
        'auto-init': autoInit,
        'no-fonts': true,
        'hide-deleted': hideDeleted,
        'page-id': pageId,
        'login-available': !!localStorage.getItem('token'),
      });
      (commento as any).onCommentNew = handleCommentNew;
      (commento as any).onCommentEdit = handleCommentEdit;
    }
    return () => removeScript(SCRIPT_ID, document.body);
  }, [id]);

  return <div key={id} id={CONTAINER_ID} />;
};

export default Commento;
