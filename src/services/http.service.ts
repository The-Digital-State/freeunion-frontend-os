import axios, { AxiosInstance } from 'axios';
import { isSSR } from 'utils/isSSR';
const { REACT_APP_BASE_URL, REACT_APP_API_URL } = process.env;

export enum Api {
  //Auth
  REGISTER = '/auth/register',
  RESEND_EMAIL = '/auth/resend',
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  USER = '/auth/user',
  INVITE_INFO = '/auth/invite',
  VERIFY_EMAIL = '/auth/verify_email',
  FORGET_PASSWORD = '/auth/forgot',
  RESET_PASSWORD = '/auth/reset_password',
  REGISTER_2FA = '/me/register_totp',
  UNREGISTER_2FA = '/me/unregister_totp',
  ENABLE_2FA = '/me/enable_totp',
  COMMENTO_SSO = '/auth/sso/commento',

  //User
  UPDATE_USER = '/me/update',
  UPDATE_PASSWORD = '/me/update_password',
  UPDATE_EMAIL = '/me/update_email',
  CANCEL_CHANGE_EMAIL = '/me/update_email/cancel',
  GENERATE_PUBLIC_NAME = '/me/new_name',
  SAVE_PUBLIC_NAME = '/me/save_name',
  UPDATE_AVATAR = '/me/update_avatar',
  UPDATE_VISIBILITY = '/me/change_visibility',
  INVITED = '/me/invited',
  UPDATE_SETTINGS = '/me/settings',
  PUBLIC_NAME = '/me/get_name',

  //Dictionaries
  COUNTRIES = '/dictionaries/countries',
  ACTIVITY_SCOPES = '/dictionaries/activity_scopes',
  SEARCH_PLACE = '/dictionaries/search_place',
  HELP_OFFERS = '/dictionaries/help_offers',
  ORGANISATION_TYPES = '/dictionaries/organization_types',
  INTEREST_SCOPES = '/dictionaries/interest_scopes',

  //Invite links
  CURRENT_LINK = '/invite_links/current',
  INVITE_LINKS = '/invite_links',

  // organisations
  ORGANISATIONS = '/organizations',
  ORGANIZATION = '/me/organization',
  ORGANIZATION_MEMBERS = '/admin_org',

  // suggestions
  SUGGESTIONS = '/suggestions',

  //NEWS
  NEWS = '/news',

  POLLS = '/me/organization',
}

export class HttpService {
  readonly API_URL = REACT_APP_API_URL;
  readonly BASE_URL = REACT_APP_BASE_URL;
  private readonly tokenKey = 'token';

  axios: AxiosInstance = null;

  constructor() {
    this.axios = axios.create({
      baseURL: this.API_URL,
      headers: {
        authorization: this.token ? `Bearer ${this.token}` : '',
      },
    });

    this.axios.interceptors.response.use(undefined, (err) => {
      const status = err?.response?.status;
      if (status === 401) {
        this.clearToken();
        // TODO: redirect to login if route require auth
        // window.history.pushState(undefined, '', routes.LOGIN);
      }

      throw err;
    });
  }

  set token(value: string) {
    this.axios.defaults.headers.authorization = `Bearer ${value}`;
    localStorage.setItem(this.tokenKey, value);
  }
  // eslint-disable-next-line getter-return
  get token() {
    if (!isSSR()) {
      return localStorage.getItem(this.tokenKey);
    }
  }

  clearToken() {
    this.axios.defaults.headers.authorization = null;
    localStorage.removeItem(this.tokenKey);
  }
}
