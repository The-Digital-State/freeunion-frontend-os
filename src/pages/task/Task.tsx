import { useContext } from 'react';
// import { toast } from 'react-toastify';
// import { format } from 'date-fns';
// import ru from 'date-fns/locale/ru';

import { GlobalContext } from 'contexts/GlobalContext';
import { Checkbox } from 'shared/components/common/Checkbox/Checkbox';
import { CustomImage } from 'common/CustomImage/CustomImage';
import { StepsProgressBar } from 'common/StepsProgressBar/StepsProgressBar';
// import { Button } from 'shared/components/common/Button/Button';
import { Helmet } from 'react-helmet';
import cn from 'classnames';

import styles from './Task.module.scss';
import { UserShort } from 'shared/interfaces/user';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';
import { IOrganisationShort } from 'interfaces/organisation.interface';
import CreaterBlock from 'common/CreaterBlock/CreaterBlock';
import generalStyles from '../NewsDetails/NewsDetails.module.scss';
import { Slider } from 'common/Slider/Slider';
import { Link } from 'react-router-dom';
import { routes } from 'Routes';
import Comments from 'shared/components/Comments/Comments';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

export type TaskInfo = {
  title: string;
  image?: string;
  description: string;
  created_at: Date;
  users: UserShort[];
  user: UserShort;
  checklist: any;
  organization?: IOrganisationShort;
  images?: { image: string; id: number }[];
  suggestion_id?: number;
  id: number;
};

type Props = {
  task: TaskInfo;
};

export function Task({ task }: Props) {
  const { openModal } = useContext(GlobalContext);
  const { user } = useContext(GlobalDataContext);

  if (!task || !task.created_at) {
    // TODO: loading state
    return null;
  }

  const checklistKeys = Object.keys(task.checklist || {});
  const checkedItemsCount = Object.values(task.checklist || {})?.filter((val) => !!val).length;

  return (
    <>
      <Helmet>
        <title>{task.title}</title>
        <meta name="og:title" content={task.title} />

        <meta name="description" content={task.description || task.title} />
        <meta name="og:image" content={task.image || process.env.REACT_APP_BASE_URL + '/' + require('../../public/logo.jpg').default} />
      </Helmet>

      {/* <div className={styles.TaskScreenDescription}>
          <div>
            <span>Автор:</span>
            <CustomImage src={task.user?.public_avatar || ''} alt="Avatar" width={37.5} height={37.5} />
            {`${task.user.public_family} ${task.user.public_name}`}
          </div>
          <div>
            <span>Дата:</span>
            {`${task.created_at && format(new Date(task.created_at), "dd MMMM yyyy 'в' HH:mm", { locale: ru })}`}
          </div>
          <div className={styles.actionButton}>
            <Button
              type="submit"
              icon="link"
              className={styles.linkButton}
              onClick={() => {
                navigator.clipboard.writeText(`${window.location}`);
                toast('Ссылка скопирована в буфер обмена');

                window.dataLayer.push({
                  event: 'event',
                  eventProps: {
                    category: 'task',
                    action: 'share',
                    label: 'details-page',
                  },
                });
              }}
            >
              ПОДЕЛИТЬСЯ
            </Button>
          </div>
        </div> */}

      <div className={generalStyles.wrapper}>
        <div className={generalStyles.titleWrapper}>
          <h2 className={generalStyles.title}>{task.title}</h2>
          <div
            className={cn(styles.wrapperSectionTitle, {
              [styles.withoutSuggestion]: !task.suggestion_id,
            })}
          >
            {!!task.suggestion_id && (
              <>
                <Link to={routes.suggestion.getLink(task.organization.id, task.suggestion_id)}>Предложение</Link>
                <span></span>
              </>
            )}
            <p className={generalStyles.sectionTitle}>Задача</p>
          </div>
        </div>
        <div className={generalStyles.createrWrapper}>
          <CreaterBlock user={task.user} published_at={task.created_at} />
        </div>
        <div className={generalStyles.contentWrapper}>
          {task.description ? (
            <div
              className={generalStyles.content}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(task.description, {
                  allowedTags: allowedTagsSynitizer,
                }),
              }}
            />
          ) : (
            <p>Описания нет</p>
          )}
          {!!task.images.length && (
            <Slider
              slidesOnPage={1}
              controlsVerticalOffset={0}
              controlsHorizontalOffset={0}
              children={task.images.map((image) => (
                <div className={styles.imageWrapper}>
                  <img
                    src={image.image}
                    alt={task.title}
                    onClick={(e) =>
                      openModal({
                        params: {
                          mainContainer: <img src={image.image} alt={task.title} />,
                        },
                      })
                    }
                  />
                </div>
              ))}
            />
          )}
          {task.users?.length > 0 && (
            <div className={styles.section}>
              <p>Участники:</p>
              <div className={styles.avatarGroup}>
                {task.users.map((user) => {
                  const userName = `${user.public_name} ${user.public_family}`;
                  return (
                    <>
                      <div className={styles.avatar} data-tip data-for={`userTaskTooltip${user.id}`}>
                        <CustomImage src={user?.public_avatar || ''} alt={userName} width={37.5} height={37.5} />
                      </div>
                      <Tooltip title={userName} id={`userTaskTooltip${user.id}`} />
                    </>
                  );
                })}
              </div>
            </div>
          )}
          {checklistKeys.length > 0 && (
            <div className={styles.section}>
              <p>Чеклист:</p>
              <div className={styles.progressBar}>
                <StepsProgressBar stepNumber={checkedItemsCount} stepsCount={checklistKeys.length} />
              </div>
              <div className={styles.checkboxesGroup}>
                {checklistKeys.map((item) => (
                  <Checkbox type="small" isDark value={!!task.checklist[item]} name={item} label={item} valueChange={() => {}} />
                ))}
              </div>
            </div>
          )}
          <div className={styles.section}>
            <Comments name="desk_tasks" user={user} essenceId={task.id} />
          </div>
        </div>
      </div>
    </>
  );
}
