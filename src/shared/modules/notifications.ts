const queryString = require('query-string');

export function getNotificationRedirectUrl(search, getUrl) {
  const parsed = queryString.parse(search);
  const { type } = parsed;

  if (!type) {
    return null;
  }

  const data = JSON.parse(parsed.data);
  const url = getUrl(type, data);

  return url;
}
