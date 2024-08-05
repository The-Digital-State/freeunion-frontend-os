import { Api, HttpService } from './http.service';
import { IInviteInfo, IUser } from '../interfaces/user.interface';
import { IInviteParams } from '../interfaces/invite-params.interface';
import sockets from 'shared/modules/sockets';

export class AuthService {
  constructor(private httpService: HttpService) {}

  async register(user: IUser): Promise<any> {
    try {
      const response = await this.httpService.axios.post(Api.REGISTER, user);

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'account',
          action: 'send_registration_form',
        },
      });

      return response.data as { ok: boolean };
    } catch (e) {
      if (e.response.status < 500) {
        return e.response.data as { errors: { [key in keyof IUser]: string } };
      }
    }
  }

  async resendEmail(email: string, newEmail?: string): Promise<{ ok: string; errors?: string[] }> {
    try {
      const result = await this.httpService.axios.post<{ ok: string }>(Api.RESEND_EMAIL, { email, new_email: newEmail });
      return result.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async login({
    email,
    password,
    device_name = 'browser',
    twoFA,
  }: {
    email: string;
    password: string;
    device_name?: string;
    twoFA?: {
      method: string;
      password: string;
    };
  }): Promise<{ token?: string; need_2fa: string[]; errors?: string[] }> {
    try {
      const result = await this.httpService.axios.post<{ token: string; need_2fa: string[]; notificationToken: string }>(Api.LOGIN, {
        email,
        password,
        device_name,
        '2fa': twoFA,
      });

      if (result.data.token) {
        this.authenticate(result.data);
      }

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'account',
          action: 'login',
        },
      });

      return result.data;
    } catch (e) {
      // @ts-ignore
      return e.response.data as { errors: string[] };
    }
  }

  authenticate(data: { token: string; notificationToken: string }) {
    this.httpService.token = data.token;
    localStorage.setItem('notificationToken', data.notificationToken);
  }

  async logout() {
    const result = await this.httpService.axios.post(Api.LOGOUT, null);
    this.httpService.clearToken();

    sockets.disconnect();

    window.dataLayer.push({
      userId: null,
    });

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'account',
        action: 'logout',
      },
    });

    window.OneSignal.push(function () {
      window.OneSignal.removeExternalUserId();
    });

    return result;
  }

  async getInviteInfo(id: number, code: string): Promise<IInviteInfo> {
    try {
      const result = await this.httpService.axios.get<{ data: IInviteInfo }>(Api.INVITE_INFO, {
        params: {
          id,
          code,
        },
      });
      return result.data.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async getInviteDetails(id: number, code: string): Promise<IInviteInfo> {
    try {
      const result = await this.httpService.axios.get<{ data: IInviteInfo }>('/invite_link', {
        params: {
          id,
          code,
        },
      });
      return result.data.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async verifyEmail(id: string, hash: string): Promise<{ ok: boolean }> {
    try {
      const result = await this.httpService.axios.post<{ ok: boolean }>(`${Api.VERIFY_EMAIL}/${id}/${hash}`);

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'account',
          action: 'confirm_registration_email',
        },
      });

      return result.data;
    } catch (e) {
      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'account',
          action: 'confirm_registration_email_error',
        },
      });

      return e.response.data;
    }
  }

  async forgetPassword(email: string): Promise<{ ok: boolean; errors?: string[] }> {
    try {
      const result = await this.httpService.axios.post<{ ok: boolean; errors?: string[] }>(Api.FORGET_PASSWORD, { email });

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'account',
          action: 'send_reset_password',
        },
      });

      return result.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async resetPassword(email: string, token: string): Promise<{ ok: boolean; password: string; errors?: string[] }> {
    try {
      const result = await this.httpService.axios.post<{ ok: boolean; password: string; errors?: string[] }>(
        `${Api.RESET_PASSWORD}/${email}/${token}`,
        null
      );
      return result.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async register2fa(): Promise<{ ok: boolean; qrcode: string; secret: string; errors?: string[] }> {
    try {
      const result = await this.httpService.axios.post<{ ok: boolean; qrcode: string; secret: string; errors?: string[] }>(
        `${Api.REGISTER_2FA}`,
        null
      );
      return result.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async unregister2fa(): Promise<{ ok: boolean; password: string; errors?: string[] }> {
    try {
      const result = await this.httpService.axios.post<{ ok: boolean; password: string; errors?: string[] }>(`${Api.UNREGISTER_2FA}`, null);
      return result.data;
    } catch (e) {
      return e.response.data;
    }
  }

  async enable2fa(password): Promise<{ ok: boolean; otp_passwords: string[]; errors?: string[] }> {
    try {
      const result = await this.httpService.axios.post<{ ok: boolean; otp_passwords: string[]; errors?: string[] }>(`${Api.ENABLE_2FA}`, {
        password,
      });
      return result.data;
    } catch (e) {
      return e.response.data;
    }
  }

  private _registrationUserData: IUser & { _accept: boolean; mailing: boolean; _confirm_password?: string } = {
    id: 0,
    public_avatar: '',
    public_family: '',
    public_name: '',
    about: '',
    address: '',
    birthday: '',
    country: '',
    email: '',
    family: '',
    login: '',
    name: '',
    password: '',
    patronymic: '',
    phone: undefined,
    scope: null,
    sex: undefined,
    work_place: '',
    requests: [],
    work_position: '',
    worktype: null,
    _accept: false,
    mailing: false,
    invite_code: undefined,
    invite_id: undefined,
    is_public: 0,
    _confirm_password: '',
  };
  set registrationUserData(value: Partial<IUser & { _accept: boolean; mailing: boolean; _confirm_password?: string }>) {
    Object.assign(this._registrationUserData, value);
  }

  get registrationUserData(): Partial<IUser & { _accept: boolean; mailing: boolean; _confirm_password?: string }> {
    return this._registrationUserData;
  }

  get inviteParams(): IInviteParams {
    return JSON.parse(localStorage.getItem('inviteParams'));
  }

  set inviteParams(params: IInviteParams) {
    if (params) {
      localStorage.setItem('inviteParams', JSON.stringify(params));
      return;
    }
    localStorage.removeItem('inviteParams');
  }
}
