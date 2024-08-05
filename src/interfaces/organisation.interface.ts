import { ExternalChat } from 'shared/interfaces/externalChats';
import { Socials } from 'shared/interfaces/organization';

export interface IOrganisationShort {
  id: number;
  avatar?: string;
  name: string;
  short_name: string;
  description?: string;
  request_type: RequestTypes;
  children: number[];
  parents: number[];
  type_id: number;
  public_status?: number;
  type_name: string;
  position_name?: string;
  points?: number;
}

export enum Hiddens {
  tasks = 'tasks',
  members = 'members',
}

export interface IOrganisation {
  errors: string[];
  id: number;
  address: string;
  avatar: string;
  children: number[];
  description: string;
  email: string;
  hiddens: Hiddens[];
  interests: IOrganisationInterest[];
  members_count: number;
  chats: ExternalChat[];
  members_new_count: number;
  name: string;
  owner_id: number;
  owner: {
    id: number;
    public_avatar: string;
    public_family: string;
    public_name: string;
  };
  parents: number[];
  phone: string;
  public_status: number;
  registration: RegistrationTypesEnum;
  request_type: RequestTypes;
  scopes: IOrganisationScope[];
  short_name: string;
  site: string;
  status: string;
  is_verified: boolean;
  social: {
    type: Socials;
    value: string | null;
  }[];
  type_id: number;
  type_name: string;
  updated_at: string;
  created_at: string;
  desk_tasks_count?: number;
  news_count?: number;
  suggestions_count?: number;
}

export enum EnterOrganizationStatuses {
  pending = 0,
  approved = 1,
  rejected = 2,
  active = 10,
}

export interface IOrganizationEnterRequest {
  status: EnterOrganizationStatuses;
  request: string;
}

export interface IOrganisationInterest {
  id: number;
  name: string;
  pivot?: {
    organization_id: number;
    interest_scope_id: number;
  };
}

/**
 * Статус регистрации организации: 0 - нет регистрации, 1 - есть регистрация, 2 - в процессе получения
 **/
export enum RegistrationTypesEnum {
  NotRegistered,
  Registered,
  InProcess,
}

export enum RegistrationTypesNamesEnum {
  NotRegistered = 'Нет регистрации',
  Registered = 'Официально зарегистрирована',
  InProcess = 'В процессе регистрации',
}

/**
 * Форма вступления:
 * 0 - сразу,
 * 1 - требуется подтверждение,
 * 2 - требуется заявление,
 * 3 - требуется заявление + отправка по почте
 **/
export enum RequestTypes {
  Immediately,
  ConfirmationRequired,
  ApplicationRequired,
  ApplicationAndMailingRequired,
}

export interface IOrganisationScope {
  id: number;
  name: string;
  pivot: {
    organization_id: number;
    activity_scope_id: number;
  };
}

export interface IOrganisationHierarchyItem {
  avatar: string;
  children: number[];
  id: number;
  name: string;
  parents: number[];
  request_type: RequestTypes;
  short_name: string;
  type_id: number;
  type_name: string;
}

export type UnionRequest = {
  comment?: string;
  created_at: Date;
  id: number;
  organization_id: number;
  status: number;
  status_text: string;
  updated_at: Date;
};
