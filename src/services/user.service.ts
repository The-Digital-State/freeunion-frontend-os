import { Api, HttpService } from './http.service';
import { ISuggestionsSettings, IUser } from '../interfaces/user.interface';
import { ISuggestion } from 'interfaces/suggestion.interface';
import moment from 'moment';

export type IUpdateAvatar = {
  ok: boolean;
  url?: string;
};

export type IUpdatePublicName = {
  public_family: string;
  public_name: string;
};

export type IGeneratePublicName = {
  public_family: string;
  public_name: string;
  signature: string;
};

export type PublicName = {
  public_family: string;
  public_name: string;
};

export type ISavePublicName = {
  public_family: string;
  public_name: string;
  signature: string;
};

export type IInvitedInfo = {
  referal: Partial<IUser>;
  invited: Partial<IUser>[];
};

export type IUserSettings = Pick<IUser, 'settings'>['settings'];

export class UserService {
  get isLoggedIn(): boolean {
    return !!this.httpService.token;
  }

  private readonly userSettingsKey = 'userSettings';
  private _userSettings: IUserSettings;

  constructor(private httpService: HttpService) {}

  async getUser(): Promise<IUser & { errors?: string[] }> {
    try {
      const result = await this.httpService.axios.get<{ data: IUser }>(Api.USER);

      this._userSettings = result.data.data.settings;
      localStorage.setItem(this.userSettingsKey, JSON.stringify(this._userSettings));

      const { id } = result.data.data;

      window.dataLayer.push({
        userId: id,
      });

      window.OneSignal.push(() => {
        window.OneSignal.setExternalUserId(String(id));
      });

      return result.data.data;
    } catch (e) {
      return e.response;
    }
  }

  async updateAvatar(file: File): Promise<IUpdateAvatar> {
    try {
      const response = await this.httpService.axios.post<IUpdateAvatar>(Api.UPDATE_AVATAR, { image: file });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async generatePublicName(isMale): Promise<IGeneratePublicName> {
    try {
      const response = await this.httpService.axios.post<{
        data: IGeneratePublicName;
      }>(Api.GENERATE_PUBLIC_NAME + `?sex=${isMale ? 0 : 1}`, null);
      return response.data.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async savePublicName(newPublicName: IGeneratePublicName): Promise<{ ok: boolean }> {
    try {
      const response = await this.httpService.axios.post<{
        ok: boolean;
      }>(Api.SAVE_PUBLIC_NAME, newPublicName);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async updatePassword(password: string): Promise<{ ok: boolean }> {
    try {
      const response = await this.httpService.axios.post<{ ok: boolean }>(Api.UPDATE_PASSWORD, { password });
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async updateEmail(email: string): Promise<{ ok: boolean }> {
    const response = await this.httpService.axios.post<{ ok: boolean }>(Api.UPDATE_EMAIL, { email });
    return response.data;
  }
  async cancelChangeEmail(): Promise<{ ok: boolean }> {
    const response = await this.httpService.axios.post<{ ok: boolean }>(Api.CANCEL_CHANGE_EMAIL);
    return response.data;
  }

  async updateUser(user: Partial<IUser>): Promise<{ ok: boolean }> {
    try {
      const response = await this.httpService.axios.post<{ ok: boolean }>(Api.UPDATE_USER, user);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async updateVisibility(options: Pick<IUser, 'is_public' | 'hiddens'>): Promise<{ ok: boolean }> {
    try {
      const response = await this.httpService.axios.post<{ ok: boolean }>(Api.UPDATE_VISIBILITY, options);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async getInvited(): Promise<IInvitedInfo> {
    try {
      const response = await this.httpService.axios.get<{ data: IInvitedInfo }>(Api.INVITED);
      return response.data.data;
    } catch (e) {
      throw new Error(e);
    }
  }

  setUserSettings(settings: Partial<IUserSettings>, updateOnServer: boolean = false) {
    const userSettings = JSON.parse(localStorage.getItem(this.userSettingsKey)) || {};
    Object.assign(userSettings, settings);
    this._userSettings = userSettings;
    localStorage.setItem(this.userSettingsKey, JSON.stringify(userSettings));
    if (updateOnServer) {
      this.updateUserSettings(settings);
    }
  }

  get userSettings(): Partial<IUserSettings> {
    return this._userSettings;
  }

  private async updateUserSettings(settings: Partial<Pick<IUser, 'settings'>['settings']>): Promise<{ ok: boolean }> {
    try {
      const response = await this.httpService.axios.post<{ ok: boolean }>(Api.UPDATE_SETTINGS, settings);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async getPublicName(): Promise<PublicName> {
    try {
      const response = await this.httpService.axios.get(Api.PUBLIC_NAME);
      return response.data.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async setHelpOffers(organizationId: number, offers: number[]): Promise<{ ok: boolean }> {
    const response = await this.httpService.axios.post<{ ok: boolean }>(`me/organization/${organizationId}/help_offers`, {
      help_offers: offers,
    });
    return response.data;
  }

  setLastViewedSuggestion(suggestion: ISuggestion, organisationId: number) {
    const lastViewedSuggestions: ISuggestionsSettings[] = this.userSettings.lastViewedSuggestions || [];
    const lastViewedSuggestion: ISuggestionsSettings =
      lastViewedSuggestions.find((lastViewedSuggestion) => lastViewedSuggestion.organisationId === organisationId) ||
      ({} as ISuggestionsSettings);

    if (
      !lastViewedSuggestion?.suggestionCreatedAt ||
      (moment(suggestion.created_at).isSameOrAfter(lastViewedSuggestion.suggestionCreatedAt) &&
        suggestion.id !== lastViewedSuggestion.suggestionId)
    ) {
      Object.assign(lastViewedSuggestion, {
        suggestionId: suggestion.id,
        viewedTime: moment().utc().format(),
        suggestionCreatedAt: suggestion.created_at,
        organisationId: suggestion.organization_id,
      });

      this.setUserSettings(
        {
          lastViewedSuggestions: [
            ...lastViewedSuggestions.filter((s) => s.organisationId !== lastViewedSuggestion.organisationId),
            lastViewedSuggestion,
          ],
        },
        true
      );
    }
  }

  setLastViewedOrganisation(organisationId: number) {
    this.setUserSettings({ lastOpenedOrganisationId: organisationId }, true);
  }
}
