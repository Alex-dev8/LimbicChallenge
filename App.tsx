import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import ChatScreen from './src/screens/Chat/ChatScreen';

import {Provider} from 'react-redux';
import store, {persistor} from './src/app/store';
import {PersistGate} from 'redux-persist/integration/react';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaView style={backgroundStyle}>
          <ChatScreen />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

export default App;
