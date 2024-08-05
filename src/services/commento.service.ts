import { Api } from './http.service';
import { httpService } from 'services';
import { ICommentoAuth, ICommentoCount } from '../interfaces/commento.interface';

export const authenticate = async (commentoToken: string, commentoHmac: string): Promise<ICommentoAuth> => {
  const params = {
    token: commentoToken,
    hmac: commentoHmac,
  };
  const result = await httpService.axios.get<ICommentoAuth>(Api.COMMENTO_SSO, { params });
  return result?.data;
};

export const callback = async (url: string): Promise<void> => {
  await httpService.axios.get<void>(url);
};

export const getCommentsCount = async (paths: string[]) => {
  const domain = window.location.host;
  const body = { domain, paths };
  const url = 'https://commento.io/api/comment/count';
  const response = await httpService.axios.post<ICommentoCount>(url, body);
  return response.data.commentCounts;
};
