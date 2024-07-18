// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeTabs from './HomeTabs';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import FailurePage from './pages/FailurePage';
import axios from 'axios';
import SuccessPage from './pages/SuccessPage';
import AlreadyMarkedPage from './pages/AlreadyMarkedPage';
import SInfo from 'react-native-sensitive-info';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

axios.defaults.baseURL = process.env.SERVER_URL;

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  const startApp = () => {
    setTimeout(async ( ) => {
      try {
        const token = await SInfo.getItem('authToken', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });

        if (!token) {
          setInitialRoute('Login');
        } else {
          setInitialRoute('HomeTabs');
        }
      } catch (error) {
        setInitialRoute('Login');
      }
    }, 1500);
  }

  useEffect(() => {
    startApp();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.openingText}>Attend Ease</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="SignUpPage" component={SignUpPage} />
        <Stack.Screen name="SuccessPage" component={SuccessPage} />
        <Stack.Screen name="FailurePage" component={FailurePage} />
        <Stack.Screen name="AlreadyMarkedPage" component={AlreadyMarkedPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato'
  },
  openingText: {
    color: "white",
    fontSize: 25,
    fontWeight: 'bold',
  }
});

export default App;








