import { Api, HttpService } from './http.service';
import { IUser } from '../interfaces/user.interface';
import { IInviteLink } from '../interfaces/invite-link.interface';

export class InviteLinksService {
  constructor(private httpService: HttpService) {}

  async getCurrentLink(): Promise<IInviteLink> {
    try {
      const response = await this.httpService.axios.get<{ data: IInviteLink }>(Api.CURRENT_LINK);
      return response.data.data;
    } catch (e) {
      throw e;
    }
  }

  async getInviteLinks(): Promise<IInviteLink[]> {
    try {
      const response = await this.httpService.axios.get<{
        data: IInviteLink[];
      }>(Api.INVITE_LINKS);
      return response.data.data;
    } catch (e) {
      if (e.response.status < 500) {
        return e.response.data;
      }
    }
  }

  async getInviteLinkById(id: string | number): Promise<IInviteLink> {
    try {
      const response = await this.httpService.axios.get(Api.INVITE_LINKS + '/' + id);
      return response.data.data;
    } catch (e) {
      if (e.response.status < 500) {
        return e.response.data;
      }
    }
  }

  async createInviteLink(organizationId?: number): Promise<IInviteLink> {
    try {
      const response = await this.httpService.axios.post('/invite_link', { organization: organizationId });

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'user',
          action: 'generateInviteLink',
        },
      });

      return response.data.data;
    } catch (e) {
      throw e.response.data;
    }
  }

  async updateInviteLink(id: string, options: { invites: number; limit: string }): Promise<{ data: IInviteLink }> {
    try {
      const response = await this.httpService.axios.put(`${Api.INVITE_LINKS}/${id}`, options);
      return response.data;
    } catch (e) {
      if (e.response.status < 500) {
        return e.response.data;
      }
    }
  }

  async deleteInviteLink(id: string): Promise<{ ok: boolean }> {
    try {
      const response = await this.httpService.axios.delete(`${Api.INVITE_LINKS}/${id}`);
      return response.data as { ok: boolean };
    } catch (e) {
      if (e.response.status < 500) {
        return e.response.data;
      }
    }
  }

  async updateCode(id: string): Promise<any> {
    try {
      const response = await this.httpService.axios.put(`${Api.INVITE_LINKS}/${id}/update_code`);
      return response.data as { ok: boolean };
    } catch (e) {
      if (e.response.status < 500) {
        return e.response.data as { errors: { [key in keyof IUser]: string } };
      }
    }
  }

  generateInviteLink(invite_id: string | number, invite_code: string) {
    const params = new URLSearchParams({
      invite_id: invite_id.toString(),
      invite_code,
    });

    return `${this.httpService.BASE_URL}?${params.toString()}`;
  }

  async verifyInviteCode(invite_id: string | number, invite_code: string): Promise<boolean> {
    const inviteLink = await this.getInviteLinkById(invite_id);

    return inviteLink && inviteLink.code === invite_code;
  }
}
