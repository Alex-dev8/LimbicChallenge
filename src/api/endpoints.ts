import config from './config';

export default {
  fetchQuestion: (id: number) => {
    return config.get<{args: {id: string}}>(`/get?id=${id}`);
  },

  saveAnswer: (params: any) => {
    return config.post('/post', params);
  },

  saveUser: (params: any) => {
    return config.post('/post', params);
  },

  deleteUser: (params: any) => {
    return config.delete('/delete', params);
  },

  savePhoneNumber: (params: any) => {
    return config.post('/post', params);
  },

  saveBirthday: (params: any) => {
    return config.post('/post', params);
  },

  saveContactPreferences: (params: any) => {
    return config.post('/post', params);
  },
};
