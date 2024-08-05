import { useContext, useEffect } from 'react';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { Task, TaskInfo } from './Task';
import { GlobalContext } from 'contexts/GlobalContext';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { useParams } from 'react-router-dom';
import { getOrgTask } from 'shared/services/tasks.service';
import { useSsrEffect, useSsrState } from '@issr/core';
import styles from '../NewsDetails/NewsDetails.module.scss';

export function TaskContainer() {
  const {
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const { orgId, taskId } = useParams<{ orgId: string; taskId: string }>();

  const [serverError, setServerError] = useSsrState(null);

  const [task, setTask] = useSsrState<TaskInfo>(null);

  const fetchTask = async () => {
    const {
      data: { data },
    } = await getOrgTask(orgId, taskId);
    setTask(data);
  };

  useSsrEffect(async () => {
    try {
      await fetchTask();
    } catch (error) {
      setServerError(formatServerError(error));
    }
  });

  useEffect(() => {
    (async () => {
      try {
        showSpinner();
        await fetchTask();
      } catch (error) {
        toast.error(formatServerError(error));
      } finally {
        hideSpinner();
      }
    })();
  }, []);

  return (
    <SimpleRoutingContainer
      showCloseButton
      logo={{ src: task?.organization?.avatar, alt: task?.organization?.short_name }}
      title={task?.organization?.short_name || task?.organization?.name}
      hideFooter
      showScrollToTopButton
      className={styles.main}
    >
      {!!serverError && <p className="danger">{serverError}</p>}

      <Task task={task} />
    </SimpleRoutingContainer>
  );
}
