import { api } from './helper';

export function refreshWSToken() {
  return api().post('auth/ws_refresh');
}
