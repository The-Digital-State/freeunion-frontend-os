export class ScrollService {
  scrollNext(
    containerClassName: string,
    scrollItemClassName: string,
    scrollCount: number = 1,
    direction: 'horizontal' | 'vertical' = 'horizontal'
  ): { isLast: boolean } {
    const container = document.getElementsByClassName(containerClassName)[0] as HTMLDivElement;
    const items = Array.from(document.getElementsByClassName(scrollItemClassName)) as HTMLDivElement[];

    const index = items.findIndex((item) => {
      if (direction === 'horizontal') {
        return item.offsetLeft + item.scrollWidth > container.scrollLeft;
      }
      return item.offsetTop - container.offsetTop + item.scrollHeight > container.scrollTop + container.offsetHeight;
    });

    if (index > -1) {
      const indexWithOffset = index + scrollCount - 1 >= items.length - 1 ? items.length - 1 : index + scrollCount - 1;
      container.scrollTo({
        top: items[indexWithOffset].offsetTop - container.clientHeight,
        behavior: 'smooth',
      });

      return { isLast: index === items.length - 1 };
    }
    return null;
  }

  scrollPrev(
    containerClassName: string,
    scrollItemClassName: string,
    scrollCount: number = 1,
    direction: 'horizontal' | 'vertical' = 'horizontal'
  ): { isLast: boolean } {
    const container = document.getElementsByClassName(containerClassName)[0] as HTMLDivElement;
    const items: HTMLDivElement[] = Array.from(document.getElementsByClassName(scrollItemClassName)) as HTMLDivElement[];

    const index = items.reverse().findIndex((item) => {
      if (direction === 'horizontal') {
        return item.offsetLeft < container.scrollLeft;
      }
      return item.offsetTop - container.offsetTop < container.scrollTop;
    });

    if (index > -1) {
      const indexWithOffset = index + scrollCount - 1 >= items.length - 1 ? items.length - 1 : index + scrollCount - 1;

      container.scrollTo({
        top: items[indexWithOffset].offsetTop - container.offsetTop,
        behavior: 'smooth',
      });
    }
    return null;
  }

  isScrollable(scrollContainer: HTMLElement): boolean {
    if (scrollContainer) {
      const { scrollHeight, clientHeight } = scrollContainer;
      return scrollHeight > clientHeight;
    }
  }

  checkIfScrollIsAvailable = (
    scrollHeight: number,
    scrollTop: number,
    clientHeight: number
  ): { disableNext: boolean; disablePrev: boolean } => {
    const scrollState = { disableNext: false, disablePrev: false };

    if (scrollTop <= 1) {
      scrollState.disablePrev = true;
    }
    if (clientHeight + scrollTop >= scrollHeight - 1) {
      scrollState.disableNext = true;
    }

    return scrollState;
  };
}
