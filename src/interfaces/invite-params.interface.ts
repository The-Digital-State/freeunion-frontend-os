export interface IInviteParams {
  invite_id: number;
  invite_code: string;
  u: number;
  o: number;
  invitationType: InvitationTypeEnum;
}

export enum InvitationTypeEnum {
  PERSONAL = 'personal',
  TO_ORGANISATION = 'toOrganisation',
}
