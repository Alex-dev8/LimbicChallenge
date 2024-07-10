import {View, StyleSheet, FlatList, KeyboardAvoidingView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/store';
import {globalActions, globalSelectors} from './redux';
import {Message} from '../../app/types';
import DatePicker from 'react-native-date-picker';
import {
  askNotificationPermissions,
  callNumber,
  formatDateDDMMYYY,
} from '../../utilities/utils';
import MessageBubble from '../../components/MessageBubble';
import ChoiceSelector from '../../components/ChoiceSelector';
import CustomTextInput from '../../components/CustomTextInput';

const ChatScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(globalSelectors.user);
  const currentQuestion = useAppSelector(globalSelectors.currentQuestion);
  const messages = useAppSelector(globalSelectors.messages);

  const flatlistRef = useRef<FlatList<Message>>(null);

  const [text, setText] = useState<string>('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      dispatch(globalActions.resetAll());
      dispatch(globalActions.startNewChat());
    }
    setInitialLoading(false);
  }, [user, dispatch]);

  useEffect(() => {
    currentQuestion?.type === 'skip' &&
      dispatch(globalActions.loadNextQuestion());
  }, [currentQuestion, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      if (flatlistRef.current) {
        flatlistRef.current.scrollToOffset({
          offset: messages.length * 100,
          animated: true,
        });
      }
    }, 250);
  }, [messages]);

  const clearText = () => {
    setText('');
  };

  const submitAnswer = async (value: any) => {
    if (currentQuestion?.type === 'contact' && value.value === 2) {
      const permission = await askNotificationPermissions();
      await dispatch(globalActions.updatePermissionStatus(permission));
    }

    if (currentQuestion?.type === 'multi-emergency' && value.value !== 2) {
      callNumber(value.value);
      return;
    }

    if (currentQuestion?.id === 1) {
      await dispatch(globalActions.saveUser(value));
    }

    await dispatch(globalActions.submitAnswer(value));
    if (currentQuestion?.type === 'fork' && value.value === 0) {
      return;
    }
    dispatch(globalActions.loadNextQuestion(value));
  };

  const sendDate = (pickedDate: Date) => {
    setOpenDatePicker(false);
    setDate(pickedDate);
    const birthday = formatDateDDMMYYY(pickedDate);
    submitAnswer(birthday);
  };

  const _renderFooter = () => {
    return (
      <ChoiceSelector
        onSubmitAnswer={submitAnswer}
        onSetOpenDatePicker={() => setOpenDatePicker(true)}
      />
    );
  };

  if (initialLoading) {
    return;
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <View style={styles.container}>
        <DatePicker
          modal
          open={openDatePicker}
          date={date}
          onConfirm={d => {
            sendDate(d);
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
          mode="date"
        />
        <FlatList
          ref={flatlistRef}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          data={messages}
          contentContainerStyle={{gap: 20}}
          renderItem={({item}) => <MessageBubble item={item} />}
          ListFooterComponent={_renderFooter}
          ListFooterComponentStyle={styles.multiChoiceContainer}
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
        />
      </View>
      {currentQuestion?.type.includes('userInput') && (
        <CustomTextInput
          keyboardType={
            currentQuestion.type === 'userInput-text' ? 'default' : 'phone-pad'
          }
          text={text}
          onChange={t => setText(t)}
          onSubmit={() => submitAnswer(text)}
          clearText={clearText}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  multiChoiceContainer: {
    borderRadius: 20,
    alignItems: 'flex-end',
    gap: 10,
  },
});

export default ChatScreen;
