/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const runPackager = /* GraphQL */ `
  mutation RunPackager(
    $type: String
    $userId: String
    $identityId: String
    $data: String
  ) {
    runPackager(
      type: $type
      userId: $userId
      identityId: $identityId
      data: $data
    )
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createLayer = /* GraphQL */ `
  mutation CreateLayer(
    $input: CreateLayerInput!
    $condition: ModelLayerConditionInput
  ) {
    createLayer(input: $input, condition: $condition) {
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
export const updateLayer = /* GraphQL */ `
  mutation UpdateLayer(
    $input: UpdateLayerInput!
    $condition: ModelLayerConditionInput
  ) {
    updateLayer(input: $input, condition: $condition) {
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
export const deleteLayer = /* GraphQL */ `
  mutation DeleteLayer(
    $input: DeleteLayerInput!
    $condition: ModelLayerConditionInput
  ) {
    deleteLayer(input: $input, condition: $condition) {
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
export const createPkg = /* GraphQL */ `
  mutation CreatePkg(
    $input: CreatePkgInput!
    $condition: ModelPkgConditionInput
  ) {
    createPkg(input: $input, condition: $condition) {
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
export const updatePkg = /* GraphQL */ `
  mutation UpdatePkg(
    $input: UpdatePkgInput!
    $condition: ModelPkgConditionInput
  ) {
    updatePkg(input: $input, condition: $condition) {
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
export const deletePkg = /* GraphQL */ `
  mutation DeletePkg(
    $input: DeletePkgInput!
    $condition: ModelPkgConditionInput
  ) {
    deletePkg(input: $input, condition: $condition) {
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
