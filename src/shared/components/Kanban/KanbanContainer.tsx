import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from '../../../redux';
import { getBoard, getColumn, moveCard, moveCardWithComment, setBoard } from 'shared/slices/tasks';
import { toast } from 'react-toastify';
import { Column, getTask, dragTask } from 'shared/services/tasks.service';

import KanbanColumn from './KanbanColumn/KanbanColumn';
import CommentCardModal from './CommentCardModal/CommentCardModal';
import styles from './KanbanContainer.module.scss';
import formatServerError from 'shared/utils/formatServerError';

const COLUMN_ID_LIST_TASKS = 2;
const COLUMN_ID_NOT_DONE = 4;

const Kanban = ({
  closeModal,
  openModal,
  isOnlyMyCards,
  getOrganizationUsers,
  isAdminApp,
  orgId,
  profile,
  userInOrganization,
}) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  let { organizationId } = useParams<{ organizationId?: string }>();
  if (orgId) {
    organizationId = orgId;
  }
  const fetchTasks = async () => {
    dispatch(getBoard(organizationId, isAdminApp));
  };

  useEffect(() => {
    fetchTasks();

    return () => {
      dispatch(setBoard([]))
    };
  }, []);
  const getCardUsers = async (cardId: string) => {
    try {
      const {
        data: { data },
      } = await getTask(organizationId, cardId);
      return [...data.users, data.user];
    } catch (err) {
      toast.error(formatServerError(err));
      console.error(err);
    }
    return [];
  };

  const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
    try {
      // Dropped outside the column
      if (!destination) {
        return;
      }

      // Card has not been moved
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }
      if (
        Math.abs(Number(source.droppableId) - Number(destination.droppableId)) > 1 &&
        !(Number(source.droppableId) === COLUMN_ID_LIST_TASKS && Number(destination.droppableId) === COLUMN_ID_NOT_DONE)
      ) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        // Moved to the same column on different position
        let rowIndex = tasks.columns[destination.droppableId].cards[destination.index].index;
        if (source.index > destination.index) {
          rowIndex -= 1;
        } else if (destination.index === 0) {
          rowIndex = 1;
        }
        await dragTask(orgId, draggableId, rowIndex);
        dispatch(getColumn(organizationId, destination.droppableId, isAdminApp));
        return;
      } else {
        // Moved to another column
        const users = await getCardUsers(draggableId);
        if (users.filter(({ id }) => id === profile.id).length === 0) {
          return;
        }
        dispatch(moveCard({ source, destination, draggableId, columns: tasks.columns, orgId: organizationId }));
        if (isAdminApp) {
          openModal(
            <CommentCardModal
              onClose={async (comment) => {
                closeModal();
                dispatch(
                  moveCardWithComment({
                    orgId: organizationId,
                    comment,
                    isAdminApp,
                  })
                );
              }}
            />
          );
        } else {
          openModal({
            params: {
              mainContainer: (
                <CommentCardModal
                  onClose={async (comment) => {
                    closeModal();
                    dispatch(
                      moveCardWithComment({
                        orgId: organizationId,
                        comment,
                        isAdminApp,
                      })
                    );
                  }}
                />
              ),
            },
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.wrapper}>
        {tasks.columns.map((column: Column, index) => {
          if (index === 0 && !isAdminApp) return null;
          return (
            <KanbanColumn
              isOnlyMyCards={isOnlyMyCards}
              user={profile}
              userInOrganization={userInOrganization}
              orgId={organizationId}
              isAdminApp={isAdminApp}
              closeModal={closeModal}
              getOrganizationUsers={getOrganizationUsers}
              column={column}
              key={column?.id}
              fetchTasks={fetchTasks}
              openModal={openModal}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
