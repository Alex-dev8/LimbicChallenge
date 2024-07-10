import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {useAppSelector} from '../app/store';
import {globalSelectors} from '../screens/Chat/redux';
import {Choice} from '../app/types';

interface ChoiceSelectorProps {
  onSubmitAnswer: (item: Choice) => void;
  onSetOpenDatePicker: () => void;
}

const ChoiceSelector: FC<ChoiceSelectorProps> = ({
  onSubmitAnswer,
  onSetOpenDatePicker,
}) => {
  const loading = useAppSelector(globalSelectors.loading);
  const currentQuestion = useAppSelector(globalSelectors.currentQuestion);

  if (loading) {
    return;
  }
  if (currentQuestion?.choices.length) {
    return (
      <>
        {currentQuestion.choices.map(item => (
          <TouchableOpacity
            key={item.text}
            style={styles.choiceButton}
            onPress={() => {
              onSubmitAnswer(item);
            }}>
            <Text style={styles.choiceText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </>
    );
  }

  if (currentQuestion?.type === 'date') {
    return (
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => onSetOpenDatePicker()}>
        <Text style={styles.datePickerButtonText}>Pick date</Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  choiceButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceText: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 16,
  },
  datePickerButton: {
    height: 50,
    backgroundColor: 'green',
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  datePickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChoiceSelector;
