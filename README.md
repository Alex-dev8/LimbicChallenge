# Getting Started

## Start your Application

### For Android

```bash
yarn install
yarn android
```

### For iOS

```bash
yarn install
cd ios
pod install
cd ..
yarn ios
```

## App architecture
The app is built using the latest version of React Native CLI and TypeScript.
State management is handled by Redux, and networking is done using Axios.
Typically I prefer to use react-query, but since in this project the data is not being fetched and stored using a backend (mock API calls), I opted for a more straight-forward approach, as we do not need to cache the data returned by the API calls.
Redux is handling most of the business logic and the global state of the app, as well as persisting the data so the user can close the app and pick up where they left off.

## Notes
The feature of automatically opening the phone app to call 999 or the Samaritans only works on a real device, not simulators.
