/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String!) {
    onCreateUser(owner: $owner) {
      id
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String!) {
    onUpdateUser(owner: $owner) {
      id
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String!) {
    onDeleteUser(owner: $owner) {
      id
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateLayer = /* GraphQL */ `
  subscription OnCreateLayer($owner: String!) {
    onCreateLayer(owner: $owner) {
      id
      userId
      fileId
      zipfile
      name
      desc
      bbox
      progress
      state
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateLayer = /* GraphQL */ `
  subscription OnUpdateLayer($owner: String!) {
    onUpdateLayer(owner: $owner) {
      id
      userId
      fileId
      zipfile
      name
      desc
      bbox
      progress
      state
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteLayer = /* GraphQL */ `
  subscription OnDeleteLayer($owner: String!) {
    onDeleteLayer(owner: $owner) {
      id
      userId
      fileId
      zipfile
      name
      desc
      bbox
      progress
      state
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreatePkg = /* GraphQL */ `
  subscription OnCreatePkg($owner: String!) {
    onCreatePkg(owner: $owner) {
      id
      userId
      fileId
      siteLayerId
      siteFileId
      layerIds
      layerFileIds
      name
      bbox
      radius
      radiusUnit
      progress
      state
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdatePkg = /* GraphQL */ `
  subscription OnUpdatePkg($owner: String!) {
    onUpdatePkg(owner: $owner) {
      id
      userId
      fileId
      siteLayerId
      siteFileId
      layerIds
      layerFileIds
      name
      bbox
      radius
      radiusUnit
      progress
      state
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeletePkg = /* GraphQL */ `
  subscription OnDeletePkg($owner: String!) {
    onDeletePkg(owner: $owner) {
      id
      userId
      fileId
      siteLayerId
      siteFileId
      layerIds
      layerFileIds
      name
      bbox
      radius
      radiusUnit
      progress
      state
      createdAt
      updatedAt
      owner
    }
  }
`;
