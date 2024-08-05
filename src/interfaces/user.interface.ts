import { IOrganisationShort } from './organisation.interface';

export interface IUser {
  id?: number;
  family: string;
  name: string;
  patronymic: string;
  sex: Sexes;
  birthday: string | Date; // 1950-02-01 // to displayDD-MM-YYYY
  country: string; // BY
  worktype: number;
  requests: number[];
  scope: number;
  scope_name?: string;
  work_place: string;
  member_description?: string;
  work_position: string;
  address: string;
  phone: number; // 375291234567
  email: string;
  login: string;
  password: string;
  about: string;
  position_name?: string;
  public_avatar?: string;
  public_family?: string;
  public_name?: string;
  referal?: {
    // info about inviting person
    id: number;
    public_avatar: string;
    public_family: string;
    public_name: string;
  };
  is_public?: 0 | 1 | 2; //Опционально. Видимость данных: 0 - не видно (по умолчанию), 1 - видно для всех, 2 - видно для организаций
  invite_id?: number;
  invite_code?: string;
  hiddens?: string[];
  last_used_at?: string;
  updated_at?: string;
  administer?: IOrganisationShort[];
  membership?: IOrganisationShort[];
  new_email?: string;
  is_verified?: boolean;
  settings?: {
    [key: string]: any;
  } & {
    lastViewedSuggestions: ISuggestionsSettings[];
    lastViewedOrganisationId: number;
    unionActions: IUnionActions[];
  };
  can_change_public?: boolean;
}

export enum Sexes {
  Men,
  Women,
}

export const sexesList: { id: Sexes; label: string }[] = [
  {
    id: Sexes.Men,
    label: 'Мужской',
  },
  {
    id: Sexes.Women,
    label: 'Женский',
  },
];

export type IInviteInfo = {
  limit: string;
  user: Pick<IUser, 'public_avatar' | 'public_family' | 'public_name'>;
  errors?: string[];
};

export interface ISuggestionsSettings {
  organisationId: number;
  suggestionId: number;
  suggestionCreatedAt: string;
  viewedTime: string;
}

export enum UnionActionsKeys {
  chooseHelpOffers = 'chooseHelpOffers',
  joinChat = 'joinChat',
}

export interface IUnionActions {
  organisationId: number;
  joinChat?: boolean;
  chooseHelpOffers?: boolean;
}
