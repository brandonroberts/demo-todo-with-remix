import { Appwrite } from 'appwrite';

let api = {
  sdk: null,

  configure(endpoint: string, projectId: string) {
    if (api.sdk) {
      (api.sdk as Appwrite).setEndpoint(endpoint);
      (api.sdk as Appwrite).setProject(projectId);
      return api.sdk;
    }

    return api.sdk as unknown as Appwrite;
  },

  provider: () => {
    if (api.sdk) {
      return api.sdk;
    }
    let appwrite = new Appwrite();
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
