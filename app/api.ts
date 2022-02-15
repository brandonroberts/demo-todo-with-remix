import { Appwrite } from 'appwrite';

let api = {
  sdk: null,

  provider: () => {
    if (api.sdk) {
      return api.sdk;
    }
    let appwrite = new Appwrite();
    appwrite.setEndpoint(process.env.APPWRITE_ENDPOINT as string);
    appwrite.setProject(process.env.APPWRITE_PROJECT_ID as string);
    api.sdk = appwrite as any;
    return appwrite;
  },

  createAccount: (email: string, password: string, name: string) => {
    return api.provider().account.create(email, password, name);
  },

  getAccount: () => {
    return api.provider().account.get();
  },

  createSession: (email: string, password: string) => {
    return api.provider().account.createSession(email, password);
  },

  deleteCurrentSession: () => {
    return api.provider().account.deleteSession('current');
  },

  createDocument: (collectionId: string, data: any, read: string[], write: string[]) => {
    return api
      .provider()
      .database.createDocument(collectionId, data, read, write);
  },

  listDocuments: (collectionId: string) => {
    return api.provider().database.listDocuments(collectionId);
  },

  updateDocument: (collectionId: string, documentId: string, data: any, read: string[], write: string[]) => {
    return api
      .provider()
      .database.updateDocument(collectionId, documentId, data, read, write);
  },

  deleteDocument: (collectionId: string, documentId: string) => {
    return api.provider().database.deleteDocument(collectionId, documentId);
  },
};

export default api;
