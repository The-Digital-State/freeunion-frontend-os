import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { Button } from '../../shared/components/common/Button/Button';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { GlobalContext } from '../../contexts/GlobalContext';
import { GlobalDataContext } from '../../contexts/GlobalDataContext';
import { Footer } from '../Footer/Footer';
import styles from './InviteColleague.module.scss';
import { routes } from 'Routes';

export function InviteColleague() {
  const {
    services: { inviteLinksService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const { selectedOrganisation } = useContext(GlobalDataContext);

  const [linkWasGenerated, setLinkWasGeneratedStatus] = useState<boolean>(false);
  const [linkWasCopied, setLinkWasCopiedStatus] = useState<boolean>(false);
  const [inviteUrl, setInviteUrl] = useState<string>();
  const [isLimitExceeded] = useState<boolean>(false);

  // const isMember = selectedOrganisation && !!user.membership.find((o) => o.id === selectedOrganisation.id);

  const showCopyLinkButton = !!navigator?.clipboard?.writeText;

  const onGenerateLink = async () => {
    try {
      showSpinner();
      const result = await inviteLinksService.createInviteLink(selectedOrganisation?.id);
      // if (result.invites === 0) {
      //   setIsLimitExceededStatus(true);
      //   hideSpinner();
      //   return;
      // }

      const { id, code } = result;

      const link = inviteLinksService.generateInviteLink(id, code);
      setInviteUrl(link);

      if (!linkWasGenerated) {
        setLinkWasGeneratedStatus(true);
      }
    } catch (error) {
      toast.error(formatServerError(error));
    } finally {
      hideSpinner();
    }
  };

  const onCopyLink = async (link) => {
    await navigator?.clipboard?.writeText(
      'Приглашение действительно 24 часа. \nПри переходе из Беларуси включите VPN! \n Ссылка является одноразовой \n' + link
    );
    setLinkWasCopiedStatus(true);
  };

  return (
    <SimpleRoutingContainer
      showCloseButton
      hideFooter
      title="Отправьте ссылку-приглашение человеку, которому вы доверяете"
      logo={{
        src: selectedOrganisation?.avatar,
        alt: selectedOrganisation?.name,
      }}
    >
      <div className={styles.InviteColleague}>
        {selectedOrganisation && (
          <p className={styles.inviteOrganisation}>
            Ссылка будет сгенерирована с приглашением в организацию:{' '}
            <Link to={routes.union.getLink(selectedOrganisation.id)}>{selectedOrganisation?.name}</Link>
          </p>
        )}

        <div className={styles.content}>
          {isLimitExceeded && (
            <p>
              Вам доступно два приглашения в сутки.
              <br />
              Ваш лимит ссылок на сегодня исчерпан, попробуйте завтра.
            </p>
          )}

          {!isLimitExceeded &&
            (linkWasGenerated ? (
              <div className={styles.linkCopied}>
                <br />
                <div className={styles.info}>
                  <h3>Приглашение действительно 24 часа. Вам доступно два приглашения в сутки.</h3>
                </div>
                <br />
                <div className={styles.link}>
                  <span className="highlight" data-cy="invite-url">
                    {inviteUrl}
                  </span>
                </div>
                <br />
                <div>{linkWasCopied && <span>Ссылка-приглашение успешно скопирована в буфер обмена.</span>}</div>
              </div>
            ) : (
              <>
                <div className={`${styles.card} p`}>
                  <div>
                    <div className={styles.icon}>
                      <Icon iconName="bell" width={31} height={34} />
                    </div>
                    <div className={styles.info}>
                      <h3>
                        На странице “Безопасность” этот человек будет отмечен как ваше доверенное лицо. Вам доступно два приглашения в
                        сутки, администратор может пригласить на платформу (в объединение) до 10 человек в сутки. Каждая ссылка одноразовая!
                      </h3>
                    </div>
                  </div>
                  <div>
                    <div className={styles.icon}>
                      <Icon iconName="group" width={53} height={38} />
                    </div>
                    <div className={styles.info}>
                      <h3>
                        на платформу попадают лишь доверенные люди - те, за кого поручился кто-то. если вдруг внутри оказывается нехороший
                        человек, можно отследить, кто пригласил его в систему и увидеть целую ветку неблагонадежных людей.
                      </h3>
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>
        <div className={styles.actions}>
          <Footer>
            {linkWasGenerated ? (
              <>
                {showCopyLinkButton && (
                  <Button
                    color={!linkWasCopied ? 'primary' : 'light'}
                    icon="group"
                    onClick={onCopyLink.bind(null, inviteUrl)}
                    dataCy="copy-link"
                  >
                    Скопировать ссылку
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button dataCy="generate-link" icon="group" onClick={onGenerateLink} disabled={isLimitExceeded}>
                  Генерировать ссылку
                </Button>
              </>
            )}
          </Footer>
        </div>
      </div>
    </SimpleRoutingContainer>
  );
}
