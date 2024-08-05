import { GeneralImagesType } from 'interfaces/generalImage.interface';
import { httpService } from 'services';

export const addGeneralImage = async (image: string | ArrayBuffer): Promise<GeneralImagesType[]> => {
  const response = await httpService.axios.post(`/upload`, { image });
  return response.data.data;
};
