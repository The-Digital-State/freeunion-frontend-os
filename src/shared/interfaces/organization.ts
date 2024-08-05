export interface OrganizationShort {
  avatar: string;
  id: number;
  name: string;
  short_name: string;
  type_id: number;
  type_name: string;
}

export enum Socials {
  telegram = 'telegram',
  youtube = 'youtube',
  instagram = 'instagram',
  facebook = 'facebook',
  vk = 'vk',
  tiktok = 'tiktok',
  ok = 'ok',
  other = 'other',
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
