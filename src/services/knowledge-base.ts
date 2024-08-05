import { httpService } from 'services';
import { KbaseMaterialFront, KbaseSection } from 'shared/interfaces/kbase';
import { Api } from './http.service';
import { RequestMeta } from 'interfaces/request-meta.interface';

type IGetOrganizationMaterials = {
  organisationId: number;
  section?: number;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  sortBy?: string;
};

type IGetMaterials = {
  section?: number;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  tags?: string[];
  sortBy?: string;
};

export const getOrganizationSections = async (organisationId: number): Promise<{ data: KbaseSection[]; meta: RequestMeta }> => {
  const response = await httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/kbase/sections`);
  return { data: response.data.data, meta: response.data.meta };
};

export const getSections = async (): Promise<{ data: KbaseSection[]; meta: RequestMeta }> => {
  const response = await httpService.axios.get(`/kbase/sections`);
  return { data: response.data.data, meta: response.data.meta };
};

export const getSectionMaterials = async (organisationId: number, sectionId: number): Promise<KbaseMaterialFront[]> => {
  const response = await httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/kbase/sections/${sectionId}`);
  return response.data.data;
};

export const getOrganizationMaterials = async ({
  organisationId,
  section,
  page,
  limit,
  sortBy,
  sortDirection = 'desc',
}: IGetOrganizationMaterials): Promise<{ data: KbaseMaterialFront[]; meta: RequestMeta }> => {
  const response = await httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/kbase/materials`, {
    params: { section, page, limit, sortDirection, sortBy },
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const getMaterials = async ({
  section,
  page,
  limit,
  sortDirection = 'desc',
  tags,
  sortBy,
}: IGetMaterials): Promise<{ data: KbaseMaterialFront[]; meta: RequestMeta }> => {
  const response = await httpService.axios.get(`/kbase/materials`, {
    params: { section, page, limit, sortDirection, tags, sortBy },
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const getMaterial = async (organisationId: number, materialId: number): Promise<KbaseMaterialFront> => {
  const response = await httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/kbase/materials/${materialId}`);
  return response.data.data;
};
