import { Appwrite } from 'appwrite';

let appwrite = new Appwrite();
let api = {
  sdk: appwrite,

  provider: (configure = true) => {
    if (configure) {
      api.sdk.setEndpoint(process.env.APPWRITE_ENDPOINT as string);
      api.sdk.setProject(process.env.APPWRITE_PROJECT_ID as string);
    }

    return api.sdk;
  },

  createAccount: (email: string, password: string, name: string) => {
    return api.provider(false).account.create('unique()', email, password, name);
  },

  getAccount: () => {
    return api.provider(false).account.get();
  },

  createJWT: async() => {
    return (await api.provider(false).account.createJWT()).jwt;
  },

  setJWT: (jwt: string) => {
    api.provider().setJWT(jwt.toString())
  },

  createSession: (email: string, password: string) => {
    return api.provider(false).account.createSession(email, password);
  },

  deleteCurrentSession: () => {
    return api.provider(false).account.deleteSession('current');
  },

  createDocument: (
    collectionId: string,
    data: any,
    read: string[],
    write: string[]
  ) => {
    return api
      .provider()
      .database.createDocument(collectionId, 'unique()', data, read, write);
  },

  listDocuments: (collectionId: string) => {
    return api.provider().database.listDocuments(collectionId);
  },

  updateDocument: (
    collectionId: string,
    documentId: string,
    data: any,
    read: string[],
    write: string[]
  ) => {
    return api
      .provider()
      .database.updateDocument(collectionId, documentId, data, read, write);
  },

  deleteDocument: (collectionId: string, documentId: string) => {
    return api.provider().database.deleteDocument(collectionId, documentId);
  },
};

export default api;
