import { OrganizationShort } from './organization';

export interface UserShort {
  id?: number;
  position_name?: string;
  public_avatar?: string;
  public_family?: string;
  public_name?: string;
  membership?: OrganizationShort[];
}
