import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/routes/AppNavigator.tsx';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
};

export default App;
