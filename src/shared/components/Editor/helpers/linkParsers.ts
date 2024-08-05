export const youtubeLinkParser = (link: string): string => {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = link.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

export const tiktokLinkParser = (link: string): string => {
  var regExp = /^.*((tiktok.com\/)|(v\/)|(\/u\/\w\/)|(video\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = link.match(regExp);
  return match?.[7] || null;
};
