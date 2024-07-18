// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import SInfo from 'react-native-sensitive-info';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage


function LoginPage () {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add a loading state
  const [error, setError] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleLogin = async () => {
    setLoading(true); 
    setButtonDisabled(true)
    setError('');

    try {
      const response = await axios.post("/student/sign-in", {
        email,
        password,
      });
      // Handle successful login (e.g., save token, navigate to dashboard)
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        const { token, firstName, lastName, studentId, matricNumber } = response.data;

        // Store the token using react-native-sensitive-info
        await SInfo.setItem('authToken', token, {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });

        // Store additional user details using AsyncStorage
        await AsyncStorage.multiSet([
          ['firstName', firstName],
          ['lastName', lastName],
          ['studentId', studentId],
          ['matricNumber', matricNumber],
        ]);

        navigation.navigate("HomeTabs");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.log("Error signing", error.response.data.error)
          setError(error.response.data.error);
        } else if (error.response.status === 404) {
          console.log("Error signing", error.response.data.error)
          setError(error.response.data.error);
        } else if (error.response.status === 401) {
          console.log("Error signing", error.response.data.error)
          setError(error.response.data.error);
        } else if (error.response.status === 403) {
          console.log("Error signing", error.response.data.error)
          setError(error.response.data.error);
        } else if (error.response.status === 500) {
          console.log("Error signing", error.response.data.error)
          setError(error.response.data.error);
        } 
        else { setError("Unexpected error.") }
        
      }  else {
        // Handle other errors
        console.log("An Unexpected Error:", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
      
    } finally {
      setLoading(false); // Set loading to false when the request is complete
      setButtonDisabled(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUpPage');
  };

  const openWebVersion = () => {
    Linking.openURL(process.env.TEACHER_WEB_LOGIN_URL); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="grey"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCompleteType="password"
        textContentType="password"
        required
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} 
        onPress={handleLogin} disabled={buttonDisabled}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.note}>
        Note: This login is for students only. Teachers should use the{' '}
        <Text style={styles.link} onPress={openWebVersion}>
          web version
        </Text>.
      </Text>
    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signUpButton: {
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  note: {
    marginTop: 20,
    color: '#777',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  link: {
    color: 'tomato',
    textDecorationLine: 'none',
  },
});

export default LoginPage;