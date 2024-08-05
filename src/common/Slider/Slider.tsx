import React, { useEffect, useRef, useState } from 'react';
import style from './Slider.module.scss';
import ArrowButton, { ArrowDirection } from 'common/ArrowButton/ArrowButton';
import { Link } from 'react-router-dom';
import { routes } from 'Routes';

type ISliderProps = {
  slidesOnPage?: number;
  children: any;
  controlsVerticalOffset?: number;
  controlsHorizontalOffset?: number;
  showScroll?: boolean;
  controlsHorizontalPosition?: 'right' | 'left';
  controlsVerticalPosition?: 'top' | 'bottom';
  rows?: 1 | 2;
  orgId?: number;
};

export function Slider({
  children,
  slidesOnPage = 2,
  controlsVerticalOffset = 20,
  controlsHorizontalOffset = 20,
  showScroll = false,
  controlsHorizontalPosition = 'right',
  controlsVerticalPosition = 'top',
  rows = 1,
  orgId,
}: ISliderProps) {
  const width = 100 / slidesOnPage;

  const [currentIndex, setCurrentIndex] = useState(0);
  const maxScrollWidth = useRef(0);
  const carousel = useRef(null);

  const isDisabled = (direction) => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }
    if (direction === 'next' && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * ((currentIndex + (slidesOnPage - slidesOnPage === 1 ? 0 : 1)) / slidesOnPage) >
        maxScrollWidth.current
      );
    }

    return false;
  };

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (carousel.current !== null && (carousel.current.offsetWidth * currentIndex) / slidesOnPage <= maxScrollWidth.current) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = (carousel.current.offsetWidth * currentIndex) / slidesOnPage;
    }
  }, [currentIndex, slidesOnPage]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current ? carousel.current.scrollWidth - carousel.current.offsetWidth : 0;
  }, [slidesOnPage, rows, children]);

  const renderTwoRowsSlide = () => {
    let step = 2;
    return children.map((child, index) => {
      if (index % step !== 0) {
        return null;
      } else {
        return (
          <Slide key={index} width={width + '%'}>
            {children[index + 1] ? (
              <div className={style.twoStepWrapper}>{children[index + 1]}</div>
            ) : orgId && children.length > 13 ? (
              <div className={style.readMoreWrapper}>
                <Link to={routes.unionNews.getLink(orgId)} className={style.readMore}>
                  Читать больше
                </Link>
              </div>
            ) : null}
            <div className={style.twoStepWrapper}>{child}</div>
          </Slide>
        );
      }
    });
  };

  return (
    <div className={`${style.Slider}`}>
      <div ref={carousel} className={`${style.container} ${showScroll ? undefined : style.noScroll}`}>
        {rows === 1 || children.length === 1
          ? children.map((child, index) => (
              <Slide key={index} width={width + '%'}>
                {child}
              </Slide>
            ))
          : renderTwoRowsSlide()}
      </div>

      <div
        className={style.controls}
        style={{
          [controlsVerticalPosition]: 0,
          [controlsHorizontalPosition]: 0,
          transform: `translate(${controlsHorizontalOffset}px, ${controlsVerticalOffset}px)`,
        }}
      >
        {slidesOnPage < children.length && rows < children.length && (
          <>
            <ArrowButton arrowDirection={ArrowDirection.back} onClick={movePrev} disable={isDisabled('prev')} />
            <ArrowButton arrowDirection={ArrowDirection.next} onClick={moveNext} disable={isDisabled('next')} />
          </>
        )}
      </div>
    </div>
  );
}

type ISlideProps = {
  children: any;
  width: string;
};

function Slide({ children, width }: ISlideProps) {
  return (
    <div
      className={style.Slide}
      style={{
        flex: `0 0 ${width}`,
        overflow: 'visible',
        flexDirection: 'column-reverse',
      }}
    >
      {children}
    </div>
  );
}
