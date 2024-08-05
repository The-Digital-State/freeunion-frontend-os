import { FC, useState, useEffect } from 'react';
import KanbanChecklist from '../Checklist/KanbanChecklist';
import ImageSection from '../ImageSection/ImageSection';
import KanbanComment from '../Comment/Comment';

import CardActions from '../Card/CardActions';
import KanbanCommentAdd from '../KanbanCommentAdd/KanbanCommentAdd';
import { CardInfo, getTask } from 'shared/services/tasks.service';
import { useDispatch, useSelector } from '../../../../redux';

import Section from '../Section/Section';
import UsersSection from '../Users/UsersSection';
import UsersModal from '../Users/UsersModal/UsersModal';
import { getAllComments, setCardData, setAllCardData, setVisiability, setHideModalActions, resetCardData } from 'shared/slices/tasks';
import 'react-quill/dist/quill.bubble.css';

import { toast } from 'react-toastify';
import { Input } from 'shared/components/common/Input/Input';
import styles from './KanbanCardModal.module.scss';
import { attachUsers } from 'shared/services/tasks.service';
import { UserShort } from 'shared/interfaces/user';
import { OrganizationShort } from 'shared/interfaces/organization';
import formatServerError from 'shared/utils/formatServerError';

interface Props {
  card: CardInfo;
  openModal: (component: object, modalProps: object) => void;
  closeModal: () => void;
  getOrganizationUsers: (value: { organizationId?: string }) => Promise<{ data: OrganizationShort[] }>;
  orgId?: string;
  isAdminApp: boolean;
}
let ReactQuill;

const KanbanCardModal: FC<Props> = (props) => {
  const { card, getOrganizationUsers, isAdminApp, orgId, closeModal, openModal } = props;
  const dispatch = useDispatch();

  const comments = useSelector((state) => state.tasks.comments);
  const cardData = useSelector((state) => state.tasks.cardData);
  const visiability = useSelector((state) => state.tasks.visiability);
  const [isUsersModalOpened, setIsUserModalOpened] = useState(false);
  const { name, image, description } = cardData;
  const [users, setUsers] = useState(card.users || []);
  const [images, setImages] = useState(card.images || []);

  useEffect(() => {
    // not working with SSR
    // https://github.com/zenoamaro/react-quill/issues/389
    ReactQuill = require('react-quill');
  }, []);
  const handeleUserModalOpen = (): void => {
    setIsUserModalOpened(true);
    dispatch(setHideModalActions(true));
  };

  const onUsersSubmit = async (users) => {
    try {
      dispatch(setHideModalActions(false));
      const {
        data: { data },
      } = await attachUsers(orgId, card.id, users);
      setIsUserModalOpened(false);
      setUsers(data?.users);
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  const getCardData = async () => {
    try {
      const {
        data: { data },
      } = await getTask(orgId, card.id);
      setUsers(data.users);
      setImages(data.images);
    } catch (err) {
      toast.error(formatServerError(err.response.data.errors));
      console.dir(err);
    }
  };

  const onUsersDetach = (users: UserShort[]) => setUsers(users);

  useEffect(() => {
    if (orgId) {
      getCardData();
      dispatch(getAllComments(orgId, card.id));

      dispatch(
        setAllCardData({
          ...card,
          name: card.title,
          checklist: !!card.checklist
            ? Object.keys(card.checklist).map((key, index) => ({
                name: key,
                id: index,
                state: card.checklist[key],
              }))
            : [],
        })
      );
      dispatch(setVisiability({ key: 'image', value: !!card.image }));
      dispatch(
        setVisiability({
          key: 'checklist',
          value: card.checklist && Object.keys(card.checklist).length > 0,
        })
      );
    }
    return () => {
      dispatch(resetCardData())
    }
  }, [dispatch, orgId, card]);

  return !isUsersModalOpened ? (
    <>
      <div className={styles.header}>
        <Input
          value={name}
          placeholder="Заголовок"
          valueChange={(value) => dispatch(setCardData({ key: 'name', value }))}
          className={styles.inputWrapper}
        />
        <CardActions
          openModal={openModal}
          handeleUserModalOpen={handeleUserModalOpen}
          card={card}
          orgId={orgId}
          closeModal={closeModal}
          isAdminApp={isAdminApp}
        />
      </div>
      {image && (
        <img
          src={image}
          width="100%"
          height="100%"
          className={styles.section}
          style={{ borderRadius: '14px' }}
          alt="logo"
        />
      )}
      <div className={styles.editor}>
        {ReactQuill && (
          <ReactQuill
            onChange={(value) => {
              dispatch(setCardData({ key: 'description', value }));
            }}
            value={description}
            placeholder="Описание задачи"
          />
        )}
      </div>
      <UsersSection orgId={orgId} users={users} cardId={card.id} onUsersDetach={onUsersDetach} />
      {visiability.checklist && <KanbanChecklist card={card} />}
      {visiability.image && <ImageSection orgId={orgId} cardId={card.id} getCardData={getCardData} images={images} />}
      <Section title="Комментарии">
        <KanbanCommentAdd orgId={orgId} cardId={card.id} />
        {comments.length > 0 &&
          comments.map((comment, index) => (
            <KanbanComment
              createdAt={comment.created_at}
              key={comment.id}
              message={comment.comment}
              member={comment.user_id}
              cardId={card.id}
              commentId={comment.id}
              orgId={orgId}
            />
          ))}
      </Section>
    </>
  ) : (
    <UsersModal users={users} getOrganizationUsers={getOrganizationUsers} onUsersSubmit={onUsersSubmit} />
  );
};

export default KanbanCardModal;
