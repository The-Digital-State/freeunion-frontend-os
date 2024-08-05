import { Quill } from 'react-quill';
import { LinkData, LinkType } from './helpers/linkStrategy';

const BlockEmbed = Quill.import('blots/block/embed');

class VideoBlot extends BlockEmbed {
  static blotName = 'embedVideo';
  static tagName = 'figure';

  static create(value: LinkData) {
    let node = super.create(value);
    node.classList.add('video-container');
    node.style.margin = '0';

    const wrapper = document.createElement('div');
    wrapper.classList.add('video-wrapper');

    const video = document.createElement('iframe');
    video.setAttribute('src', value.link);
    video.classList.add('ql-video', 'content-video', value.sourceType);
    video.setAttribute('allowfullscreen', 'true');
    video.setAttribute('frameBorder', '0');
    if (value.sourceType === LinkType.TIKTOK) {
      video.style.width = '560px';
      video.style.height = '560px';
      video.style.margin = '0 auto';
    }
    wrapper.appendChild(video);
    node.appendChild(wrapper);

    return node;
  }

  static value(node): LinkData {
    const videoEl = node.querySelector('.content-video');
    const link = videoEl.getAttribute('src');
    if (videoEl.classList.contains(LinkType.TIKTOK)) {
      return {
        sourceType: LinkType.TIKTOK,
        link,
      };
    }
    if (videoEl.classList.contains(LinkType.YOUTUBE)) {
      return {
        sourceType: LinkType.YOUTUBE,
        link,
      };
    }
    return null;
  }
}

Quill.register('blots/block/embedVideo', VideoBlot);
