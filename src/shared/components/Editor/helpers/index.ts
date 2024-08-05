import { Quill } from 'react-quill';
import get from 'lodash/get';
import { linkStrategyService } from './linkStrategy';

//TODO: split up into separate files
export const isEmptyLineByIndex = (editor: Quill, index: number): boolean => {
  const [block] = editor.getLine(index);
  const line = get(block, 'domNode.outerHTML', '');
  return !line.replace(/<(.|\n)*?>/g, '').length && !line.includes('<img') && !line.includes('<iframe');
};

export const addLinkPlaceholderToLine = (editor: Quill, index: number) => {
  console.log('qweqwe');
  const [block] = editor.getLine(index);
  if (block) {
    block.domNode.dataset.placeholder = 'Вставьте вашу ссылку';
  }
};

export const removeLinkPlaceholderToLine = (editor: Quill, index: number) => {
  const [block] = editor.getLine(index);
  if (block) {
    block.domNode.removeAttribute('data-placeholder');
  }
};

export const insertLink = (editor: Quill, link: string, position: number) => {
  const linkData = linkStrategyService.parseLink(link);
  const insertLinkStrategy = linkStrategyService.getStrategy(linkData.sourceType);

  insertLinkStrategy(editor, linkData, position);
};

export const insertImage = (editor: Quill, url: string): void => {
  const cursorPosition = editor.getSelection()?.index ?? 1;
  editor.insertText(cursorPosition, '\n');
  editor.insertEmbed(cursorPosition, 'image', url);
};
