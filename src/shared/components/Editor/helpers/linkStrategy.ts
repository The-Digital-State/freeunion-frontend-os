import { Quill } from 'react-quill';
import { tiktokLinkParser, youtubeLinkParser } from './linkParsers';

export enum LinkType {
  DEFAULT = 'default',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube',
  IS_NOT_LINK = 'isNotLink',
}
export type LinkData = {
  sourceType: LinkType;
  link: string;
};
type LinkStrategy = (editor: Quill, linkData: LinkData, position: number) => void;

class LinkStrategyService {
  private defaultStategy: LinkStrategy = (editor, { link }, position) => {
    editor.insertText(position, '\n');
    editor.clipboard.dangerouslyPasteHTML(
      position,
      `<a href="${link}" target="_blank" ref="noopener noreferrer">${link}</a>`
    );
  };

  private embedVideoStrategy: LinkStrategy = (editor, linkData, position) => {
    editor.insertText(position, '\n');
    editor.insertEmbed(position, 'embedVideo', linkData);
  };

  private isNotLinkStrategy: LinkStrategy = (editor, { link }, position) => {
    editor.insertText(position, link);
  };

  private isValidHttpLink = (string: string): string => {
    let url: URL;
    try {
      url = new URL(string);
    } catch (_) {
      return null;
    }
    return url.href;
  };
  public getStrategy = (type: LinkType): LinkStrategy => {
    switch (type) {
      case LinkType.DEFAULT:
        return this.defaultStategy;
      case LinkType.TIKTOK:
      case LinkType.YOUTUBE:
        return this.embedVideoStrategy;
      case LinkType.IS_NOT_LINK:
        return this.isNotLinkStrategy;
      default:
        return this.isNotLinkStrategy;
    }
  };

  public parseLink = (link: string): LinkData => {
    const parsedLink = this.isValidHttpLink(link);
    if (parsedLink) {
      const youtubeId = youtubeLinkParser(link);
      const tiktokId = tiktokLinkParser(link);
      if (youtubeId) {
        return {
          sourceType: LinkType.YOUTUBE,
          link: `https://www.youtube.com/embed/${youtubeId}`,
        };
      }
      if (tiktokId) {
        return {
          sourceType: LinkType.TIKTOK,
          link: `https://www.tiktok.com/embed/v2/${tiktokId}`,
        };
      }
      return {
        sourceType: LinkType.DEFAULT,
        link: parsedLink,
      };
    }
    return {
      sourceType: LinkType.IS_NOT_LINK,
      link,
    };
  };
}

export const linkStrategyService = new LinkStrategyService();
