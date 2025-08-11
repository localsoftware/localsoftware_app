/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const helloworld = /* GraphQL */ `
  query Helloworld($msg: String) {
    helloworld(msg: $msg)
  }
`;
export const getUserIdFromDb = /* GraphQL */ `
  query GetUserIdFromDb {
    getUserIdFromDB
  }
`;
export const queryDataFromDb = /* GraphQL */ `
  query QueryDataFromDb(
    $model: String!
    $method: String!
    $updates: String
    $query: String
  ) {
    queryDataFromDB(
      model: $model
      method: $method
      updates: $updates
      query: $query
    )
  }
`;
export const serveData = /* GraphQL */ `
  query ServeData($type: String!, $payload: String!) {
    serveData(type: $type, payload: $payload)
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getLayer = /* GraphQL */ `
  query GetLayer($id: ID!) {
    getLayer(id: $id) {
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
export const listLayers = /* GraphQL */ `
  query ListLayers(
    $filter: ModelLayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getPkg = /* GraphQL */ `
  query GetPkg($id: ID!) {
    getPkg(id: $id) {
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
export const listPkgs = /* GraphQL */ `
  query ListPkgs(
    $filter: ModelPkgFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPkgs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
