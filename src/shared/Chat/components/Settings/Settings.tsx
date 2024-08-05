import styles from './Settings.module.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from '../../../../redux';
import { ReactComponent as BackIcon } from '../../../icons/arrow-square-down.svg';
import { Radio } from 'shared/components/common/Radio/Radio';
import OrganizationList from './List';
import * as chatService from 'shared/services/chat.service';
import { toast } from 'react-toastify';
import { Button } from 'shared/components/common/Button/Button';
import { setUserData } from 'shared/slices/chat';
import isEqual from 'lodash/isEqual';

function Settings({ setIsSettingModalOpened }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.chat.user);
  const isAdmin = useSelector((state) => !!state.chat.organizationId);
  const { settings } = user || {};
  const [value, setValue] = useState<string | number>(settings?.chats?.mode || 1);
  const [values, setValues] = useState(settings?.chats?.list || []);
  const getSettings = () => {
    const settings = [
      {
        id: 1,
        label: 'Принимать от всех',
      },
      {
        id: 2,
        label: 'Только от участников объединения',
        components: <OrganizationList values={values} setValues={setValues} />
      },
    ];
    if (!isAdmin) {
      settings.push({
        id: 3,
        label: 'От администратора моего объединения',
        components: <OrganizationList values={values} setValues={setValues} />
      })
    }
    settings.push({
      id: 4,
      label: 'Не принимать ни от кого',
    })
    return settings
  }
  const options = getSettings();
  const saveSettings = () => {
    chatService.updateSettings(value, values)
    dispatch(setUserData({ ...user, settings: { ...settings, chats: { mode: value, list: values } } }))
    setIsSettingModalOpened(false)
    toast('Настройки обновленны');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.ChatSidebarContainer}>
        <div className={styles.ChatSidebarHeader}>
          <h3>Настройки</h3>

          <button className={styles.BackIcon} onClick={() => {
            setIsSettingModalOpened(false)
          }}>
            <BackIcon />
          </button>
        </div>
        <Radio
          options={options}
          autoFocus
          className={styles.RadioWrapper}
          name="reason"
          value={value}
          valueChange={(value, name) => {
            setValue(value)
            setValues([])
          }}
        />
      </div>
      <Button
        primary
        onClick={saveSettings}
        className={styles.saveButton}
        disabled={settings?.chats?.mode === value && isEqual(settings?.chats?.list, values)}
      >
        Сохранить
      </Button>
    </div>
  );
}

export default Settings;
