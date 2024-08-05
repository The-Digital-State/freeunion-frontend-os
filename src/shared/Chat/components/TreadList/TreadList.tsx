import { useRef } from 'react';
import styles from './TreadList.module.scss';
import { getThreads, sendMessage, setIsSelectingMessagesMode } from 'shared/slices/chat';
import { useDispatch, useSelector } from '../../../../redux';
import { CustomImage } from '../CustomImage/CustomImage';

function TreadList({ closeModal }: any) {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.chat.threads);
  const selectedMessages = useSelector((state) => state.chat.selectedMessages);
  const messages = useSelector((state) => state.chat.messages);

  const handleClick = async (key) => {
    const body = selectedMessages.map((id) => messages.find(({ id: mesId }) => mesId === id)?.content).join(', ');
    dispatch(sendMessage(key, body, 'text'));
    dispatch(getThreads());
    dispatch(setIsSelectingMessagesMode(false));
    closeModal();
  };
  return (
    <div>
      <h3>Все участники</h3>
      <div className={`${styles.wrapper}`} ref={ref}>
        {
          <ul>
            {threads.map(({ id, name, avatar }) => {
              return (
                <li key={id}
                  onClick={() => {
                    handleClick(id);
                  }}
                >
                  <CustomImage rounded={true} src={avatar}
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <h5>
                      <strong>{name}</strong>
                    </h5>
                  </div>
                </li>
              );
            })}
          </ul>
        }
      </div>
    </div>
  );
}

export default TreadList;
