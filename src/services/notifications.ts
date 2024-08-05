import { httpService } from 'services';

export function getNotifications() {
  return httpService.axios.get('/me/notifications', {
    params: {
      status: 0,
    },
  });
}

export function getNotification(id) {
  return httpService.axios.get(`/me/notifications/${id}`);
}
