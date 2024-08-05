export interface IInviteLink {
  id: number;
  code: string;
  invites: number;
  limit: string; // "2021-05-24T13:04:17.000000Z"
  created_at: string;
  updated_at: string;
  user_id: number;
  expired: boolean;
}
