import { httpService } from 'services';

// this is not true, it is only fix problem with import
export async function uploadImageMaterial(orgId: string, image: string | ArrayBuffer): Promise<any> {
  return await httpService.axios.post(`/organizations/${orgId}/news/upload`, { image });
}
