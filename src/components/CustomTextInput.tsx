import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardType,
} from 'react-native';
import React, {FC} from 'react';

interface TextInputProps {
  keyboardType: KeyboardType;
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  clearText: () => void;
}

const CustomTextInput: FC<TextInputProps> = ({
  keyboardType,
  text,
  onChange,
  onSubmit,
  clearText,
}) => {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Write here..."
        onChangeText={(t: string) => onChange(t)}
        value={text}
        keyboardType={keyboardType}
      />
      <TouchableOpacity
        onPress={() => {
          onSubmit();
          clearText();
        }}
        disabled={text.length === 0}>
        <Text style={styles.sendButton}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    height: 40,
    backgroundColor: '#D3D3D3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sendButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default CustomTextInput;
