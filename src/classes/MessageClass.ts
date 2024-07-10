import {Message} from '../app/types';
import uuid from 'react-native-uuid';

export class MessageClass implements Message {
  id: string;
  text: string;
  user: string | null;
  value: string | number | null;

  constructor(
    text: string,
    user: string | null,
    value: string | number | null,
  ) {
    this.id = uuid.v4().toString();
    this.text = text;
    this.user = user;
    this.value = value;
  }
}
