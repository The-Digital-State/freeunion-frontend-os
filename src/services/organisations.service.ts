import { RequestMeta } from 'interfaces/request-meta.interface';
import { IHelpOffer } from 'interfaces/help-offer.interface';
import { Api, HttpService } from './http.service';
import { IUser } from '../interfaces/user.interface';
import { IOrganisation, IOrganizationEnterRequest, IOrganisationHierarchyItem, UnionRequest } from '../interfaces/organisation.interface';
import { INewsDetails } from 'shared/interfaces/news';
import { AxiosResponse } from 'axios';

export class OrganisationsService {
  constructor(private httpService: HttpService) {}

  async getOrganisations({
    name,
    page = 1,
    limit = 15,
    type_id,
  }: {
    name?: string;
    page?: number;
    limit?: number;
    type_id?: number[];
  }): Promise<{ data: IOrganisation[]; meta: RequestMeta }> {
    let filterTypeId;

    if (type_id?.length) {
      filterTypeId = `in,${type_id.join(',')}`;
    }

    const response = await this.httpService.axios.get<{
      data: IOrganisation[];
      meta: RequestMeta;
    }>(Api.ORGANISATIONS, { params: { name: name ? `lk,${name}` : undefined, page, limit, type_id: filterTypeId } });

    return response.data;
  }

  async getOrganisationById(id: number): Promise<IOrganisation> {
    try {
      const response = await this.httpService.axios.get<{
        data: IOrganisation;
      }>(`${Api.ORGANISATIONS}/${id}`);
      return response.data.data;
    } catch (e) {
      throw e.response;
    }
  }

  async getOrganisationHierarchy(id: number): Promise<IOrganisationHierarchyItem[]> {
    try {
      const response = await this.httpService.axios.get<{
        data: IOrganisation[];
      }>(`${Api.ORGANISATIONS}/${id}/hierarchy`);
      return response.data.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async createOrganisation(organisation: IOrganisation): Promise<IOrganisation> {
    try {
      const response = await this.httpService.axios.post<{
        data: IOrganisation;
      }>(Api.ORGANIZATION, organisation);

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'union',
          action: 'success_registration',
          value: response.data.data.id,
        },
      });

      return response.data.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async enterOrganisation(organisationId: number): Promise<{ ok: boolean }> {
    const response = await this.httpService.axios.post<{ ok: boolean }>(`${Api.ORGANIZATION}/${organisationId}/enter`, null);
    return response.data;
  }

  async getOrganizationEnterRequestById(id: number): Promise<IOrganizationEnterRequest> {
    const response = await this.httpService.axios.get<{
      data: IOrganizationEnterRequest;
    }>(`${Api.ORGANIZATION}/${id}/status`);
    return response.data.data;
  }

  async getChat(orgId, chatId): Promise<{ link: string }> {
    try {
      const response = await this.httpService.axios.get<{
        link: string;
      }>(`/organizations/${orgId}/get_chat/${chatId}`);
      return response.data;
    } catch (e) {
      throw e.response.data;
    }
  }

  async cancelUnionRequest(id: number): Promise<IOrganizationEnterRequest> {
    try {
      const response = await this.httpService.axios.post<{
        data: IOrganizationEnterRequest;
      }>(`${Api.ORGANIZATION}/${id}/cancel`);
      return response.data.data;
    } catch (e) {
      throw e.response.data;
    }
  }

  async getHelpOffers(id: number): Promise<IHelpOffer[]> {
    try {
      const response = await this.httpService.axios.get<{ data: IHelpOffer[] }>(`${Api.ORGANIZATION}/${id}/help_offers`);
      return response.data.data;
    } catch (e) {
      throw e.response.data;
    }
  }

  async leaveOrganisation(organisationId: number, message: string): Promise<{ ok: boolean }> {
    try {
      const response = await this.httpService.axios.post<{ ok: boolean }>(`${Api.ORGANIZATION}/${organisationId}/leave`, {
        message,
      });
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async getOrganisationMembers(organisationId: number, page: number = 1, limit: number = 15): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await this.httpService.axios.get<{ data: IUser[] }>(`${Api.ORGANISATIONS}/${organisationId}/members?${params}`, null);
    return response.data.data;
  }

  async getUnionRequests(): Promise<UnionRequest[]> {
    const response = await this.httpService.axios.get<{ data: UnionRequest[] }>(`/me/enter_requests`, null);
    return response.data.data;
  }

  async getOrganisationOneNews({
    organisationId,
    newsId,
    organization_id,
    sortBy,
    sortDirection = 'desc',
    featured,
    tags,
  }: {
    organisationId: number;
    newsId: number;
    organization_id?: number;
    sortBy?: string;
    sortDirection?: string;
    featured?: number;
    tags?: string[];
  }): Promise<AxiosResponse<{ data: INewsDetails }>> {
    const response = await this.httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/news/${newsId}`, {
      params: { organization_id, sortBy, sortDirection, featured, tags },
    });
    return response;
  }

  async errorNews(newsId: number, type: number, message: string): Promise<any> {
    try {
      const response = await this.httpService.axios.post(`${Api.NEWS}/${newsId}/abuse`, {
        type_id: type,
        message: message,
      });

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'news',
          action: 'abuse',
        },
      });

      return response.data.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async updateOrganisationInterests(organisationId: number, interests: string[]): Promise<IOrganisation> {
    try {
      const response = await this.httpService.axios.post<{ data: IOrganisation }>(
        `${Api.ORGANIZATION_MEMBERS}/${organisationId}/interests`,
        {
          scopes: interests,
        }
      );
      return response.data.data;
    } catch (e) {
      return e.response.data;
    }
  }
}
