import { GroupSubject } from '@owlmeans/regov-ext-groups';

export type OrganizationSubject = GroupSubject & {
  interests?: string[];
  type_name?: string;
  request?: string;
};
