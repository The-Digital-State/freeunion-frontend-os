import {
  buildWalletWrapper,
  EXTENSION_TRIGGER_INIT_SENSETIVE,
  InitSensetiveEventParams,
  nodeCryptoHelper,
  Credential,
  DIDDocument,
  singleValue,
  VALIDATION_KIND_OFFER,
  REGISTRY_TYPE_CLAIMS,
  REGISTRY_SECTION_OWN,
  REGISTRY_TYPE_CREDENTIALS,
  REGISTRY_TYPE_IDENTITIES,
  addToValue,
  REGISTRY_SECTION_PEER,
} from '@owlmeans/regov-ssi-core';
import {
  GroupSubject,
  REGOV_GROUP_OFFER_TYPE,
  REGOV_GROUP_CHAINED_TYPE,
  REGOV_GROUP_LIMITED_TYPE,
  REGOV_CREDENTIAL_TYPE_GROUP,
  REGOV_GROUP_ROOT_TYPE,
} from '@owlmeans/regov-ext-groups';
import { regovExtensionRegistry, regovConfig } from './config';

import util from 'util';
import { REGOV_CLAIM_TYPE, REGOV_CREDENTIAL_TYPE_MEMBERSHIP, REGOV_OFFER_TYPE } from '@owlmeans/regov-ext-groups';
util.inspect.defaultOptions.depth = 8;

(async () => {
  const aliceWallet = await buildWalletWrapper(
    { crypto: nodeCryptoHelper, extensions: regovExtensionRegistry.registry },
    '11111111',
    { alias: 'alice', name: 'Alice' },
    {
      prefix: regovConfig.DID_PREFIX,
      defaultSchema: regovConfig.baseSchemaUrl,
      didSchemaPath: regovConfig.DID_SCHEMA_PATH,
    }
  );

  await regovExtensionRegistry.triggerEvent<InitSensetiveEventParams>(aliceWallet, EXTENSION_TRIGGER_INIT_SENSETIVE, {
    extensions: regovExtensionRegistry.registry,
  });

  const ext = regovExtensionRegistry.getExtension(REGOV_CREDENTIAL_TYPE_GROUP);
  const factory = ext.extension.getFactory(REGOV_CREDENTIAL_TYPE_GROUP);
  const unsignedGroup = (await factory.build(aliceWallet, {
    extensions: regovExtensionRegistry.registry,
    subjectData: {},
    depth: 2,
    chainedType: REGOV_GROUP_ROOT_TYPE,
  })) as Credential<GroupSubject>;

  const claim = await factory.claim(aliceWallet, {
    unsignedClaim: JSON.parse(JSON.stringify(unsignedGroup)),
  });

  aliceWallet.getRegistry(REGISTRY_TYPE_CLAIMS).addCredential(claim);

  const offer = await factory.offer(aliceWallet, {
    claim,
    credential: singleValue(claim.verifiableCredential),
    holder: claim.verifiableCredential[0].issuer as DIDDocument,
    offerType: REGOV_GROUP_OFFER_TYPE,
    subject: unsignedGroup.credentialSubject,
    id: claim.id,
    challenge: claim.proof.challenge,
    domain: claim.proof.domain,
    cryptoKey: await aliceWallet.keys.getCryptoKey(),
  });

  const rootGroup = singleValue(offer.verifiableCredential);

  const result = await factory.validate(aliceWallet, {
    presentation: offer,
    credential: rootGroup,
    extensions: regovExtensionRegistry.registry,
    kind: VALIDATION_KIND_OFFER,
  });

  if (!result.valid || !result.trusted) {
    throw 'Invalid root group offer';
  }

  aliceWallet.getRegistry(REGISTRY_TYPE_CLAIMS).removeCredential(claim);

  aliceWallet.getRegistry(REGISTRY_TYPE_CREDENTIALS).addCredential(rootGroup, REGISTRY_SECTION_OWN);

  console.log(`Added root group ${rootGroup.id} to Alice wallet`);

  const membershipFactory = ext.extension.getFactory(REGOV_CREDENTIAL_TYPE_MEMBERSHIP);
  const unsignedMembership = await membershipFactory.build(aliceWallet, {
    extensions: regovExtensionRegistry?.registry,
    subjectData: { groupId: rootGroup.id },
  });

  unsignedMembership.evidence = addToValue(unsignedMembership.evidence, rootGroup);

  const rootMembershipClaim = await membershipFactory.claim(aliceWallet, { unsignedClaim: unsignedMembership });
  aliceWallet.getRegistry(REGISTRY_TYPE_CLAIMS).addCredential(rootMembershipClaim);

  const rootMembershipOffer = await membershipFactory.offer(aliceWallet, {
    claim: rootMembershipClaim,
    credential: singleValue(rootMembershipClaim.verifiableCredential),
    holder: singleValue(rootMembershipClaim.verifiableCredential).issuer as DIDDocument,
    cryptoKey: await aliceWallet.keys.getCryptoKey(),
    claimType: REGOV_CLAIM_TYPE,
    offerType: REGOV_OFFER_TYPE,
    subject: unsignedMembership.credentialSubject,
    id: rootMembershipClaim.id as string,
    challenge: rootMembershipClaim.proof.challenge || '',
    domain: rootMembershipClaim.proof.domain || '',
  });

  const rootMembership = singleValue(rootMembershipOffer.verifiableCredential);

  const rootMembershipResult = await membershipFactory.validate(aliceWallet, {
    presentation: rootMembershipOffer,
    credential: rootMembership,
    extensions: regovExtensionRegistry.registry,
    kind: VALIDATION_KIND_OFFER,
  });

  if (!rootMembershipResult.valid || !rootMembershipResult.trusted) {
    throw 'Invalid root membership offer';
  }

  aliceWallet.getRegistry(REGISTRY_TYPE_CLAIMS).removeCredential(rootMembershipClaim);
  aliceWallet.getRegistry(REGISTRY_TYPE_IDENTITIES).addCredential(rootMembership, REGISTRY_SECTION_OWN);

  console.log(`Root group membership ${rootMembership.id} added to Alice wallet`);

  const bobWallet = await buildWalletWrapper(
    { crypto: nodeCryptoHelper, extensions: regovExtensionRegistry.registry },
    '11111111',
    { alias: 'bob', name: 'Bob' },
    {
      prefix: regovConfig.DID_PREFIX,
      defaultSchema: regovConfig.baseSchemaUrl,
      didSchemaPath: regovConfig.DID_SCHEMA_PATH,
    }
  );

  await regovExtensionRegistry.triggerEvent<InitSensetiveEventParams>(bobWallet, EXTENSION_TRIGGER_INIT_SENSETIVE, {
    extensions: regovExtensionRegistry.registry,
  });

  bobWallet.getRegistry(REGISTRY_TYPE_IDENTITIES).addCredential(rootGroup, REGISTRY_SECTION_PEER);

  const unsignedChainedGroup = (await factory.build(bobWallet, {
    extensions: regovExtensionRegistry.registry,
    subjectData: {},
    depth: 1,
    chainedType: REGOV_GROUP_CHAINED_TYPE,
  })) as Credential<GroupSubject>;

  const chainedClaim = await factory.claim(bobWallet, {
    unsignedClaim: JSON.parse(JSON.stringify(unsignedChainedGroup)),
  });

  bobWallet.getRegistry(REGISTRY_TYPE_CLAIMS).addCredential(chainedClaim);

  const unsingedChainedGroupClaim = JSON.parse(JSON.stringify(singleValue(chainedClaim.verifiableCredential)));

  unsingedChainedGroupClaim.evidence = rootMembership;

  const chainedOffer = await factory.offer(aliceWallet, {
    claim: chainedClaim,
    credential: unsingedChainedGroupClaim,
    holder: singleValue(chainedClaim.verifiableCredential).issuer as DIDDocument,
    offerType: REGOV_GROUP_OFFER_TYPE,
    subject: unsignedChainedGroup.credentialSubject,
    id: chainedClaim.id,
    challenge: chainedClaim.proof.challenge,
    domain: chainedClaim.proof.domain,
    cryptoKey: await aliceWallet.keys.getCryptoKey(),
  });

  const chainedGroup = singleValue(chainedOffer.verifiableCredential);

  const chainedResult = await factory.validate(bobWallet, {
    presentation: chainedOffer,
    credential: chainedGroup,
    extensions: regovExtensionRegistry.registry,
    kind: VALIDATION_KIND_OFFER,
  });

  if (!chainedResult.valid || !chainedResult.trusted) {
    throw 'Invalid chained group offer';
  }

  bobWallet.getRegistry(REGISTRY_TYPE_CLAIMS).removeCredential(chainedClaim);

  bobWallet.getRegistry(REGISTRY_TYPE_CREDENTIALS).addCredential(chainedGroup, REGISTRY_SECTION_OWN);

  console.log(`Added chained group ${chainedGroup.id} to Bob wallet`);

  const unsignedChainedMembership = await membershipFactory.build(bobWallet, {
    extensions: regovExtensionRegistry?.registry,
    subjectData: { groupId: chainedGroup.id },
  });

  unsignedChainedMembership.evidence = addToValue(unsignedChainedMembership.evidence, chainedGroup);

  const chainedMembershipClaim = await membershipFactory.claim(bobWallet, {
    unsignedClaim: unsignedChainedMembership,
  });
  bobWallet.getRegistry(REGISTRY_TYPE_CLAIMS).addCredential(chainedMembershipClaim);

  const chainedMembershipOffer = await membershipFactory.offer(bobWallet, {
    claim: chainedMembershipClaim,
    credential: singleValue(chainedMembershipClaim.verifiableCredential),
    holder: singleValue(chainedMembershipClaim.verifiableCredential).issuer as DIDDocument,
    cryptoKey: await bobWallet.keys.getCryptoKey(),
    claimType: REGOV_CLAIM_TYPE,
    offerType: REGOV_OFFER_TYPE,
    subject: unsignedChainedMembership.credentialSubject,
    id: chainedMembershipClaim.id as string,
    challenge: chainedMembershipClaim.proof.challenge || '',
    domain: chainedMembershipClaim.proof.domain || '',
  });

  const chainedMembership = singleValue(chainedMembershipOffer.verifiableCredential);

  const chainedMembershipResult = await membershipFactory.validate(bobWallet, {
    presentation: chainedMembershipOffer,
    credential: chainedMembership,
    extensions: regovExtensionRegistry.registry,
    kind: VALIDATION_KIND_OFFER,
  });

  if (!chainedMembershipResult.valid || !chainedMembershipResult.trusted) {
    throw 'Invalid chained membership offer';
  }

  aliceWallet.getRegistry(REGISTRY_TYPE_CLAIMS).removeCredential(chainedMembershipClaim);
  aliceWallet.getRegistry(REGISTRY_TYPE_IDENTITIES).addCredential(chainedMembership, REGISTRY_SECTION_OWN);

  console.log(`Chained group membership ${chainedMembership.id} added to Bob wallet`);

  const charlyWallet = await buildWalletWrapper(
    { crypto: nodeCryptoHelper, extensions: regovExtensionRegistry.registry },
    '11111111',
    { alias: 'charly', name: 'Charly' },
    {
      prefix: regovConfig.DID_PREFIX,
      defaultSchema: regovConfig.baseSchemaUrl,
      didSchemaPath: regovConfig.DID_SCHEMA_PATH,
    }
  );

  await regovExtensionRegistry.triggerEvent<InitSensetiveEventParams>(charlyWallet, EXTENSION_TRIGGER_INIT_SENSETIVE, {
    extensions: regovExtensionRegistry.registry,
  });

  charlyWallet.getRegistry(REGISTRY_TYPE_IDENTITIES).addCredential(rootGroup, REGISTRY_SECTION_PEER);

  const unsignedLimitedGroup = (await factory.build(charlyWallet, {
    extensions: regovExtensionRegistry.registry,
    subjectData: {},
    chainedType: REGOV_GROUP_LIMITED_TYPE,
  })) as Credential<GroupSubject>;

  const limitedClaim = await factory.claim(charlyWallet, {
    unsignedClaim: JSON.parse(JSON.stringify(unsignedLimitedGroup)),
  });

  charlyWallet.getRegistry(REGISTRY_TYPE_CLAIMS).addCredential(limitedClaim);

  const unsingedLimitedGroupClaim = JSON.parse(JSON.stringify(singleValue(limitedClaim.verifiableCredential)));

  unsingedLimitedGroupClaim.evidence = chainedMembership;

  const limitedOffer = await factory.offer(bobWallet, {
    claim: limitedClaim,
    credential: unsingedLimitedGroupClaim,
    holder: singleValue(limitedClaim.verifiableCredential).issuer as DIDDocument,
    offerType: REGOV_GROUP_OFFER_TYPE,
    subject: unsignedLimitedGroup.credentialSubject,
    id: limitedClaim.id,
    challenge: limitedClaim.proof.challenge,
    domain: limitedClaim.proof.domain,
    cryptoKey: await bobWallet.keys.getCryptoKey(),
  });

  const limitedGroup = singleValue(limitedOffer.verifiableCredential);

  const limitedResult = await factory.validate(charlyWallet, {
    presentation: limitedOffer,
    credential: limitedGroup,
    extensions: regovExtensionRegistry.registry,
    kind: VALIDATION_KIND_OFFER,
  });

  if (!limitedResult.valid || !limitedResult.trusted) {
    throw 'Invalid limited group offer';
  }

  bobWallet.getRegistry(REGISTRY_TYPE_CLAIMS).removeCredential(limitedClaim);

  bobWallet.getRegistry(REGISTRY_TYPE_CREDENTIALS).addCredential(limitedGroup, REGISTRY_SECTION_OWN);

  console.log(`Added limited group ${limitedGroup.id} to Charly's wallet`);

  const unsignedLimitedMembership = await membershipFactory.build(charlyWallet, {
    extensions: regovExtensionRegistry?.registry,
    subjectData: { groupId: limitedGroup.id },
  });

  unsignedLimitedMembership.evidence = addToValue(unsignedLimitedMembership.evidence, limitedGroup);

  const limitedMembershipClaim = await membershipFactory.claim(charlyWallet, {
    unsignedClaim: unsignedLimitedMembership,
  });
  charlyWallet.getRegistry(REGISTRY_TYPE_CLAIMS).addCredential(limitedMembershipClaim);

  const limitedMembershipOffer = await membershipFactory.offer(charlyWallet, {
    claim: limitedMembershipClaim,
    credential: singleValue(limitedMembershipClaim.verifiableCredential),
    holder: singleValue(limitedMembershipClaim.verifiableCredential).issuer as DIDDocument,
    cryptoKey: await charlyWallet.keys.getCryptoKey(),
    claimType: REGOV_CLAIM_TYPE,
    offerType: REGOV_OFFER_TYPE,
    subject: unsignedLimitedMembership.credentialSubject,
    id: limitedMembershipClaim.id as string,
    challenge: limitedMembershipClaim.proof.challenge || '',
    domain: limitedMembershipClaim.proof.domain || '',
  });

  const limitedMembership = singleValue(limitedMembershipOffer.verifiableCredential);

  const limitedMembershipResult = await membershipFactory.validate(charlyWallet, {
    presentation: limitedMembershipOffer,
    credential: limitedMembership,
    extensions: regovExtensionRegistry.registry,
    kind: VALIDATION_KIND_OFFER,
  });

  if (!limitedMembershipResult.valid || !limitedMembershipResult.trusted) {
    throw 'Invalid limited membership offer';
  }

  charlyWallet.getRegistry(REGISTRY_TYPE_CLAIMS).removeCredential(limitedMembershipClaim);
  charlyWallet.getRegistry(REGISTRY_TYPE_IDENTITIES).addCredential(limitedMembership, REGISTRY_SECTION_OWN);

  console.log(`Limited group membership ${limitedMembership.id} added to Charly's wallet`);

  const danWallet = await buildWalletWrapper(
    { crypto: nodeCryptoHelper, extensions: regovExtensionRegistry.registry },
    '11111111',
    { alias: 'dan', name: 'Dan' },
    {
      prefix: regovConfig.DID_PREFIX,
      defaultSchema: regovConfig.baseSchemaUrl,
      didSchemaPath: regovConfig.DID_SCHEMA_PATH,
    }
  );

  await regovExtensionRegistry.triggerEvent<InitSensetiveEventParams>(danWallet, EXTENSION_TRIGGER_INIT_SENSETIVE, {
    extensions: regovExtensionRegistry.registry,
  });

  danWallet.getRegistry(REGISTRY_TYPE_IDENTITIES).addCredential(rootGroup, REGISTRY_SECTION_PEER);

  const unsignedDanMembership = await membershipFactory.build(danWallet, {
    extensions: regovExtensionRegistry?.registry,
    subjectData: { groupId: limitedGroup.id },
  });

  unsignedDanMembership.evidence = addToValue(unsignedDanMembership.evidence, limitedGroup);

  const danMembershipClaim = await membershipFactory.claim(danWallet, {
    unsignedClaim: unsignedDanMembership,
  });
  danWallet.getRegistry(REGISTRY_TYPE_CLAIMS).addCredential(danMembershipClaim);

  const danMembershipOffer = await membershipFactory.offer(charlyWallet, {
    claim: danMembershipClaim,
    credential: singleValue(danMembershipClaim.verifiableCredential),
    holder: singleValue(danMembershipClaim.verifiableCredential).issuer as DIDDocument,
    cryptoKey: await charlyWallet.keys.getCryptoKey(),
    claimType: REGOV_CLAIM_TYPE,
    offerType: REGOV_OFFER_TYPE,
    subject: unsignedDanMembership.credentialSubject,
    id: danMembershipClaim.id as string,
    challenge: danMembershipClaim.proof.challenge || '',
    domain: danMembershipClaim.proof.domain || '',
  });

  const danMembership = singleValue(danMembershipOffer.verifiableCredential);

  const danMembershipResult = await membershipFactory.validate(danWallet, {
    presentation: danMembershipOffer,
    credential: danMembership,
    extensions: regovExtensionRegistry.registry,
    kind: VALIDATION_KIND_OFFER,
  });

  if (!danMembershipResult.valid || !danMembershipResult.trusted) {
    throw 'Invalid Dan membership offer';
  }

  charlyWallet.getRegistry(REGISTRY_TYPE_CLAIMS).removeCredential(danMembershipClaim);
  charlyWallet.getRegistry(REGISTRY_TYPE_IDENTITIES).addCredential(danMembership, REGISTRY_SECTION_OWN);

  console.log(`Limited group membership ${danMembership.id} added to Dan's wallet`);
})();
