import { Button } from 'shared/components/common/Button/Button';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { useContext, useEffect, useState } from 'react';
import Editor from 'shared/components/Editor/Editor';
import styles from './NewsSuggest.module.scss';
import { suggestNews } from 'services/news';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { routes } from 'Routes';
import { GlobalContext } from 'contexts/GlobalContext';
import { IOrganisation } from 'interfaces/organisation.interface';

function NewsSuggest() {
  const [editorState, setEditorState] = useState({
    title: '',
    content: '',
  });

  const { title, content } = editorState;

  const {
    services: { organisationsService },
  } = useContext(GlobalContext);

  const [org, setOrg] = useState<IOrganisation>();

  const { organizationId } = useParams<{ organizationId: string }>();

  useEffect(() => {
    (async () => {
      try {
        const org = await organisationsService.getOrganisationById(+organizationId);
        setOrg(org);
      } catch (error) {
        toast(formatServerError(error));
      }
    })();
  }, [organizationId]);

  const history = useHistory();

  return (
    <SimpleRoutingContainer
      showCloseButton
      className={styles.wrapper}
      logo={{ src: org?.avatar, href: routes.union.getLink(organizationId), alt: org?.name }}
    >
      <Editor
        title={title}
        content={content}
        onChange={(type, value) => {
          setEditorState({ ...editorState, [type]: value });
        }}
      />

      <Button
        onClick={async () => {
          try {
            await suggestNews(organizationId, { title, content });

            window.dataLayer.push({
              event: 'event',
              eventProps: {
                category: 'news',
                action: 'suggest',
              },
            });

            toast('Ваша новость отправлена администраторам объединения');
            history.push(routes.union.getLink(organizationId));
          } catch (error) {
            toast.error(formatServerError(error));
          }
        }}
      >
        Отправить редактору организации
      </Button>
    </SimpleRoutingContainer>
  );
}

export default NewsSuggest;
