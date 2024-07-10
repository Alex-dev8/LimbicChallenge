import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React, {FC} from 'react';
import {Message} from '../app/types';

interface MessageBubbleProps {
  item: Message;
}

const MessageBubble: FC<MessageBubbleProps> = ({item}) => {
  const userResponse = item.user;
  return (
    <View
      style={[
        styles.messageView,
        {
          alignSelf: userResponse ? 'flex-end' : 'flex-start',
          backgroundColor: userResponse ? 'blue' : '#D3D3D3',
        },
      ]}
      key={item.id}>
      <Text
        style={[styles.messageText, {color: userResponse ? 'white' : 'black'}]}>
        {item.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageView: {
    maxWidth: Dimensions.get('screen').width / 1.5,
    backgroundColor: 'green',
    padding: 10,
    minHeight: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default MessageBubble;
