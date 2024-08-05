import { IOrganisationShort } from './organisation.interface';
export interface ISuggestion {
  id: number;
  organization_id: number;
  user_id: 6;
  count: number;
  description: string;
  my_vote: boolean;
  owner: boolean;
  title: string;
  created_at: Date;
  updated_at: Date;
  organization: IOrganisationShort;
  images: { uuid: string; url: string }[] | any[];
  my_reaction?: SuggestionVotesVariant;
  reactions: any;
  user: {
    id: number;
    public_avatar: string;
    public_family: string;
    public_name: string;
  };
  solution?: string;
  goal?: string;
  _urgency?: boolean;
  urgency?: string;
  _budget?: boolean;
  budget?: string;
  _legal_aid?: boolean;
  legal_aid?: string;
  _rights_violation?: boolean;
  rights_violation?: string;
  comments_count?: number;
  is_closed?: boolean;
}

export enum SuggestionVotesVariant {
  thumbs_up = 'thumbs_up',
  thumbs_down = 'thumbs_down',
  neutral_face = 'neutral_face',
  deleteReaction = -1,
}
