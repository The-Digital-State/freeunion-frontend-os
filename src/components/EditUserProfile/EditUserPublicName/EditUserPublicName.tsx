import { useContext, useEffect, useState } from 'react';

import { InputWithButton } from 'common/InputWithButton/InputWithButton';
import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { IGeneratePublicName } from 'services/user.service';
import { IInputProps, Input } from 'shared/components/common/Input/Input';
import Toggle from 'common/Toggle/Toggle';

import styles from './EditUserPublicName.module.scss';

type IEditUserPublicNameProps = {
  disabled?: boolean;
  setGeneratedNewPublicName?: (generatedNewPublicName: IGeneratePublicName) => void;
};

export function EditUserPublicName({ disabled = false, setGeneratedNewPublicName }: IEditUserPublicNameProps) {
  const {
    services: { userService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const { user } = useContext(GlobalDataContext);
  const { can_change_public = false } = user || {};
  const [publicName, setPublicName] = useState<string>('');
  const [isPublicNameMale, setIsPublicNameMale] = useState(!user?.sex);

  useEffect(() => {
    (async () => {
      const publicData = await userService.getPublicName();
      setPublicName(publicData.public_family + ' ' + publicData.public_name);
    })();
  }, []);

  const generatePublicName = async () => {
    if (disabled) {
      return;
    }

    showSpinner();

    const generatedNewPublicName = await userService.generatePublicName(isPublicNameMale);
    setGeneratedNewPublicName && setGeneratedNewPublicName(generatedNewPublicName);
    const { public_family, public_name } = generatedNewPublicName;
    setPublicName(`${public_family} ${public_name}`);

    hideSpinner();
  };

  const inputProps: IInputProps = {
    name: 'publicName',
    value: publicName,
    valueChange: setPublicName,
    bgColor: 'white',
    disabled: true,
  };

  return (
    <div className={styles.EditUserPublicName}>
      <h3>публичное имя</h3>
      <p>
        У вас есть множество попыток генерирования имени, но как только вы нажмете кнопку "Сохранить изменения", вы не сможете поменять имя.
      </p>

      <div>
        {can_change_public ? (
          <>
            <Toggle choice={['жен', 'муж']} checked={isPublicNameMale} valueChange={setIsPublicNameMale} title="Пол имени" />
            <InputWithButton
              inputProps={inputProps}
              buttonProps={{
                children: 'генерировать',
                onClick: generatePublicName,
              }}
            />
          </>
        ) : (
          <Input {...inputProps} />
        )}
      </div>
    </div>
  );
}
