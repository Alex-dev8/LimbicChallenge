import {
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import {RootState, Thunk} from '../../app/store';
import {GlobalState, Question, Message} from '../../app/types';

import {
  createUser,
  deleteUser,
  fetchQuestionById,
  saveAnswer,
  saveBirthday,
  saveContactPreferences,
  savePhoneNumber,
} from '../../api/api';
import {MessageClass} from '../../classes/MessageClass';
import {Alert, Platform} from 'react-native';

const initialState: GlobalState = {
  user: null,
  currentQuestion: null,
  messages: [],
  answersGiven: [],
  pushNotifications: false,
  loading: false,
};

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
      const message = new MessageClass(
        action.payload.text.replaceAll('{name}', state.user || ''),
        null,
        null,
      );
      state.messages = [...state.messages, message];
    },
    setNewMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },
    setGivenAnswers: (state, action: PayloadAction<number>) => {
      state.answersGiven = [...state.answersGiven, action.payload];
    },
    setPushNotifications: (state, action: PayloadAction<boolean>) => {
      state.pushNotifications = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    reset: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.user = null;
        state.currentQuestion = null;
        state.messages = [];
        state.answersGiven = [];
      }
    },
  },
});

export const {
  setUser,
  setCurrentQuestion,
  setNewMessage,
  setGivenAnswers,
  setPushNotifications,
  setLoading,
  reset,
} = slice.actions;

// THUNKS

const saveUser =
  (user: string): Thunk =>
  async (dispatch: Dispatch) => {
    try {
      await createUser(user);
      dispatch(setUser(user));
    } catch (err) {
      console.error(err);
      Alert.alert('Oops!', 'An error has occured');
    }
  };

const resetAll = (): Thunk => (dispatch: Dispatch) => {
  dispatch(reset(true));
};

const startNewChat = (): Thunk => async (dispatch: Dispatch) => {
  try {
    const res = await fetchQuestionById(1);
    if (res) {
      dispatch(setCurrentQuestion(res));
      dispatch(setLoading(false));
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Oops!', 'An error has occured');
  }
};

const submitAnswer =
  (answer: any): Thunk =>
  async (dispatch: Dispatch, getState) => {
    const currentState = getState();
    const question = currentState.global.currentQuestion;
    dispatch(setLoading(true));

    // RESET AND RESTART
    if (question?.type === 'fork' && answer.value === 0) {
      try {
        await deleteUser(currentState.global.user || '');
        dispatch(reset(true));
        return;
      } catch (err) {
        console.error(err);
      }
    }

    if (question?.type === 'userInput-numbers') {
      const numbString = answer.toString();
      try {
        await savePhoneNumber(numbString);
        const newMessage = new MessageClass(
          answer,
          currentState.global.user,
          null,
        );
        dispatch(setNewMessage(newMessage));
        return;
      } catch (err) {
        console.error(err);
      }
    }

    if (question?.type === 'date') {
      try {
        await saveBirthday(answer);
        const newMessage = new MessageClass(
          answer,
          currentState.global.user,
          null,
        );
        dispatch(setNewMessage(newMessage));
        return;
      } catch (err) {
        console.error(err);
        Alert.alert('Oops!', 'An error has occured');
      }
    }

    // SAVE CONTACT CHOICES
    if (question?.type === 'contact') {
      try {
        await saveContactPreferences(
          answer.text,
          currentState.global.pushNotifications,
        );
        const newMessage = new MessageClass(
          answer.text,
          currentState.global.user,
          null,
        );
        dispatch(setNewMessage(newMessage));
        return;
      } catch (err) {
        console.error(err);
        Alert.alert('Oops!', 'An error has occured');
      }
    }

    if (question) {
      const msgText = typeof answer === 'string' ? answer : answer.text;
      const newMessage = new MessageClass(
        msgText,
        currentState.global.user,
        null,
      );
      dispatch(setNewMessage(newMessage));
      if (question.choices.length > 3) {
        try {
          await saveAnswer(question.id, answer.value);
          dispatch(setGivenAnswers(answer.value));
        } catch (err) {
          console.error(err);
          Alert.alert('Oops!', 'An error has occured');
        }
      }
    }
  };

const loadNextQuestion =
  (value?: any): Thunk =>
  async (dispatch: Dispatch, getState) => {
    const currentState = getState();
    let nextQuestionId = currentState.global.currentQuestion?.next;

    if (typeof nextQuestionId !== 'number') {
      nextQuestionId = nextQuestionId[value.value];
    }

    try {
      const nextQuestion = await fetchQuestionById(nextQuestionId);
      if (nextQuestion?.type === 'multi-end') {
        const hasValueGreaterThanZero = currentState.global.answersGiven.some(
          val => val > 0,
        );
        if (hasValueGreaterThanZero) {
          dispatch(setCurrentQuestion(nextQuestion));
        } else {
          const nq = await fetchQuestionById(nextQuestion?.next);
          nq && dispatch(setCurrentQuestion(nq));
        }
        dispatch(setLoading(false));
        return;
      }
      if (nextQuestion) {
        dispatch(setCurrentQuestion(nextQuestion));
        dispatch(setLoading(false));
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Oops!', 'An error has occured');
    }
  };

const updatePermissionStatus =
  (status: any): Thunk =>
  (dispatch: Dispatch) => {
    let boolStatus = false;
    if (Platform.OS === 'ios') {
      if (status.authorizationStatus > 0) {
        boolStatus = true;
      }
    }

    if (Platform.OS === 'android') {
      if (status.authorizationStatus === 'granted') {
        boolStatus = true;
      }
    }

    dispatch(setPushNotifications(boolStatus));
  };

// SELECTORS

const globalSelector = (state: RootState) => state.global;

const globalSelectors = {
  user: createSelector(globalSelector, global => global.user),
  currentQuestion: createSelector(
    globalSelector,
    global => global.currentQuestion,
  ),
  messages: createSelector(globalSelector, global => global.messages),
  loading: createSelector(globalSelector, global => global.loading),
};

export default slice.reducer;
export {globalSelectors};
export const globalActions = {
  saveUser,
  resetAll,
  startNewChat,
  submitAnswer,
  loadNextQuestion,
  updatePermissionStatus,
};
