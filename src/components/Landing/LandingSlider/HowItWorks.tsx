import { forwardRef, ForwardedRef, useContext } from 'react';
import { routes } from 'Routes';
import { Slider } from 'common/Slider/Slider';

import styles from '../Landing.module.scss';

import Arrow_sideways from '../../../public/landing_page/arrow1.svg';
import Man_icon from '../../../public/landing_page/man_icon.svg';
import { buttonArray, list, quotes } from './HowItWorksHelpers';
import { Button } from 'shared/components/common/Button/Button';
import { GlobalContext } from 'contexts/GlobalContext';

type LandingSliderProps = {
  setHowChoose: React.Dispatch<React.SetStateAction<'task' | 'decision' | 'tool' | string>>;
  scrollTo: (id: string) => void;
  howChoose: 'task' | 'decision' | 'tool';
  stylesHowSlider: {
    transform: string;
  };
};

const HowItWorks = forwardRef(
  ({ setHowChoose, scrollTo, howChoose, stylesHowSlider }: LandingSliderProps, ref: ForwardedRef<HTMLSelectElement>): JSX.Element => {
    const {
      screen: { innerWidth },
    } = useContext(GlobalContext);

    return (
      <section className={styles.landing_how_it_works} ref={ref}>
        <div className={styles.how_it_works_wrapper}>
          <h2 className={`${styles.title} p-left-xs-only p-right-xs-only`}>Как это работает?</h2>
          <div className={`${styles.innerwrapper_tasks_headers} p-left-xs-only p-right-xs-only`}>
            {buttonArray.map((item, i) => {
              return (
                <>
                  <button
                    className={styles.task}
                    id={item.id}
                    onClick={() => {
                      setHowChoose(item.styles);
                      scrollTo(item.id);
                    }}
                  >
                    <div className={howChoose === item.styles ? styles.innerwrapper_task + ' ' + styles.active : styles.innerwrapper_task}>
                      <img src={item.icon} alt={item.styles} />
                    </div>
                    <p className={styles.title}>{item.text}</p>
                  </button>
                  {i < 2 && <img src={Arrow_sideways} alt="Arrow" className={styles.arrow_sideways} />}
                </>
              );
            })}
          </div>
          <div className={styles.task_bodies_wrapper}>
            <div className={styles.task_bodies} style={stylesHowSlider}>
              <div className={styles.task_body}>
                <h1 className={`${styles.title} p-left-xs-only p-right-xs-only`}>что нам говорят активисты:</h1>
                <div className={styles.innerwrapper_opinions}>
                  <Slider
                    slidesOnPage={innerWidth > 1720 ? 5 : innerWidth > 1430 ? 3 : innerWidth > 1000 ? 2 : innerWidth > 640 ? 1 : 1}
                    controlsHorizontalPosition="left"
                    controlsVerticalPosition="bottom"
                    controlsVerticalOffset={0}
                    controlsHorizontalOffset={0}
                    children={quotes.map((quote) => (
                      <div className={styles.innerwrapper_card} key={quote.id}>
                        <img src={Man_icon} alt="Task" />
                        <p className={styles.title}>{quote.content}</p>
                      </div>
                    ))}
                  />
                </div>
              </div>
              <div className={styles.task_body}>
                <h1 className={styles.title}>самоорганизация:</h1>
                <div className={styles.innerwrapper_organisation}>
                  <div className={styles.organisation_text}>Люди подключаются и делают глобальные вещи, когда</div>
                  <ul className={styles.organisation_ul}>
                    {list.map((item, i) => {
                      return (
                        <li key={i}>
                          <h3>{item.text}</h3>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className={styles.task_body}>
                <h1 className={styles.title}>платформа — FREEUNION.ONLINE</h1>
                <div className={styles.innerwrapper_platform}>
                  <div className={styles.platfotm_withbtn}>
                    <h3>
                      Регистрируйте в сервисе ваше объединение, чтобы безопасно привлекать новых людей и легко вовлекать всех в работу.
                    </h3>
                    <Button to={routes.LOGIN}>ПРИСОЕДИНИТЬСЯ</Button>
                  </div>
                  <span className={styles.platform_span}>
                    мы даём удобный инструмент для совместной работы и гарантируем вашу безопасность и анонимность
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

export default HowItWorks;
