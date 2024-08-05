import { groupsExtension as extensionModel, groupsUIExtension as extension, REGOV_CREDENTIAL_TYPE_GROUP } from '@owlmeans/regov-ext-groups';

extension.extension = extensionModel;

const credential = extensionModel.schema.credentials[REGOV_CREDENTIAL_TYPE_GROUP];

credential.credentialContext = {
  ...credential.credentialContext,
  interests: {
    '@id': `${credential.contextUrl}#interests`,
    '@type': '@set',
  },
  type_name: 'http://www.w3.org/2001/XMLSchema#string',
  request: 'http://www.w3.org/2001/XMLSchema#string',
};

export const groupsUIExtension = extension;

export const groupsExtension = extensionModel;
