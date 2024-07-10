import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Linking, Platform} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';

export const formatDateDDMMYYY = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const formattedDateString = `${day}-${month}-${year}`;
  return formattedDateString;
};

export const askNotificationPermissions = async () => {
  if (Platform.OS === 'ios') {
    const permission = await PushNotificationIOS.requestPermissions();
    return permission;
  }

  if (Platform.OS === 'android') {
    try {
      const permission = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      return permission;
    } catch (err) {
      console.error(err);
    }
  }
};

export const callNumber = (number: number) => {
  Linking.openURL(`tel:${number}`);
};
