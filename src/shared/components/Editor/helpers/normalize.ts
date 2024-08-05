export const normalizeContent = (content: string): string => {
  const container = document.createElement('div');
  container.innerHTML = content;

  // removing all inline styles
  const styledElements = container.querySelectorAll('[style]');
  styledElements.forEach((el) => el.removeAttribute('style'));

  // removing all empty lines at the end of the content
  const children = container.childNodes;
  for (let index = children.length - 1; index >= 0; index--) {
    const child = children[index] as Element;
    if (child?.innerHTML === '<br>') {
      container.removeChild(child);
      continue;
    }
    break;
  }

  return container.innerHTML;
};
