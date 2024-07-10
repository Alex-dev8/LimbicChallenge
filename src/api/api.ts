import {data} from '../mock/data';
import {Question} from '../app/types';
import endpoints from './endpoints';

// GET request to fetch question by id
export const fetchQuestionById = async (
  id: number,
): Promise<Question | undefined> => {
  try {
    const response = await endpoints.fetchQuestion(id);
    const question = data.find(
      q => q.id === parseInt(response.data.args.id, 10),
    ) as Question | undefined;
    return question;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

// POST
export const saveAnswer = async (
  questionId: number,
  answer: any,
): Promise<any> => {
  try {
    const res = await endpoints.saveAnswer({questionId, answer});
    return res;
  } catch (err) {
    console.error(err);
    throw new Error('Error saving answer');
  }
};

// SAVE USER
export const createUser = async (user: string): Promise<any> => {
  try {
    const res = await endpoints.saveUser(user);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error('Error creating user');
  }
};

// DELETE USER
export const deleteUser = async (user: string): Promise<any> => {
  try {
    const res = await endpoints.deleteUser({
      data: {user},
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error('Error deleting user');
  }
};

// SAVE PHONE NUMBER
export const savePhoneNumber = async (number: string): Promise<any> => {
  try {
    const res = await endpoints.savePhoneNumber(number);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error('Error saving phone number');
  }
};

// SAVE BIRTHDAY
export const saveBirthday = async (birthday: string): Promise<any> => {
  try {
    const res = await endpoints.saveBirthday(birthday);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error('Error saving birthday');
  }
};

// SAVE CONTACT PREFERENCES
export const saveContactPreferences = async (
  contactType: string,
  permission: boolean,
): Promise<any> => {
  try {
    const res = await endpoints.saveContactPreferences({
      contactType,
      permission,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error('Error saving contact preferences');
  }
};
