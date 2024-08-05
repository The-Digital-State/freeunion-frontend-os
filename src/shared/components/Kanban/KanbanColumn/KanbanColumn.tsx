import { Droppable, Draggable } from 'react-beautiful-dnd';
import KanbanCardAdd from '../KanbanCardAdd/KanbanCardAdd';
import KanbanCard from '../KanbanCard/KanbanCard';
import styles from './KanbanColumn.module.scss';
import { useSelector } from '../../../../redux';

const KanbanColumn = (props) => {
  const {
    column,
    isOnlyMyCards,
    fetchTasks,
    orgId,
    isAdminApp,
    openModal,
    getOrganizationUsers,
    user,
    closeModal,
    userInOrganization,
  } = props;

  const filteredIds = useSelector((state) => state.tasks.filteredIds);
  const searchQuery = useSelector((state) => state.tasks.searchQuery);

  let cards = column.cards;

  if (isOnlyMyCards) {
    cards = column.cards.filter(
      (card) => card.user.id === user.id || card.users.filter(({ id }) => id === user.id).length > 0
    );
  } else if (filteredIds.length > 0) {
    cards = column.cards.filter(
      (card) => filteredIds.includes(card.user.id) || card.users.filter(({ id }) => filteredIds.includes(id)).length > 0
    );
  }
  if (searchQuery) {
    cards = cards.filter(({ title }) => title && title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div className={styles.KanbanColumn}>
      <div className={styles.KanbanColumnHeader}>
        <span className={styles.header}>{column.name}</span>
        <div style={{ flexGrow: 1 }} />
      </div>
      <hr />
      {column?.id === 1 && isAdminApp && (
        <div className={styles.createTask}>
          <KanbanCardAdd columnId={column?.id} isAdminApp={isAdminApp} />
        </div>
      )}
      <Droppable droppableId={`${column?.id}`} type="card">
        {(provided, snapshot): JSX.Element => (
          <div
            ref={provided.innerRef}
            className={styles.ColumnContainer}
            style={{ backgroundColor: snapshot?.isDraggingOver ? '#828ecc' : '' }}
          >
            {cards.map((card, index) => (
              <Draggable draggableId={`${card.id}`} index={index} key={card.id}>
                {(_provided): JSX.Element => (
                  <KanbanCard
                    getOrganizationUsers={getOrganizationUsers}
                    orgId={orgId}
                    card={card}
                    fetchTasks={fetchTasks}
                    index={index}
                    key={card.id}
                    column={column}
                    ref={_provided.innerRef}
                    openModal={openModal}
                    closeModal={closeModal}
                    isAdminApp={isAdminApp}
                    userInOrganization={userInOrganization}
                    user={user}
                    {..._provided.draggableProps}
                    {..._provided.dragHandleProps}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
