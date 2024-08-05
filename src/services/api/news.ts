import { httpService } from 'services';

// temp file to connect with shared. need to combine news api
export async function uploadImage(orgId: string, image: string | ArrayBuffer): Promise<any> {
  return await httpService.axios.post(`/organizations/${orgId}/news/upload`, { image });
}
