// StudentSignUp.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function SignUpPage () {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [loading, setLoading] = useState(false); // Add a loading state
  const [error, setError] = useState(''); 
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !matricNumber) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return console.log("password less than 8");
    }
    console.log('all data', firstName, lastName, email, password, matricNumber);
    setLoading(true); // Set loading to true before making the request
    setButtonDisabled(true);
    
    try {
      const response = await axios.post('/student/sign-up', {
        firstName,
        lastName,
        email,
        password,
        matricNumber
      });

      if (response.status === 201) {
        console.log("Account created", response.data);
        navigation.navigate("Login"); // Correct navigation method
      }
    
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.log("Error signing", error.response.data.error);
          setError(error.response.data.error);
        } else if (error.response.status === 401) {
          console.log("Error signing", error.response.data.error);
          setError(error.response.data.error);
        } else if (error.response.status === 500) {
          console.log("Error signing", error.response.data.error);
          setError(error.response.data.error);
        } else { setError('An error occurred. Please check your network connection and try again.'); }
      } else { setError('An error occurred. Please check your network connection and try again.'); }
    } finally {
      setLoading(false); // Set loading to false when the request is complete
      setButtonDisabled(false);
    }
  };


  const openWebVersion = () => {
    Linking.openURL(process.env.TEACHER_WEB_SIGN_UP_URL); // Replace with the actual URL
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="First name"
        placeholderTextColor="grey"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last name"
        placeholderTextColor="grey"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="grey"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Matric number"
        placeholderTextColor="grey"
        value={matricNumber}
        onChangeText={setMatricNumber}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} 
        onPress={handleSignUp} disabled={buttonDisabled}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.note}>
        Note: This sign-up is for students only. Teachers should use the {' '}
        <Text style={styles.link} onPress={openWebVersion}>
          web version
        </Text>.
      </Text>
      <View style={styles.loginContainer}>
        <Text style={styles.note}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.greenText}>Log in</Text>
        </TouchableOpacity>
      </View>
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
    height: 42,
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
    height: 42,
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
  note: {
    marginTop: 20,
    color: '#777',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  greenText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    paddingTop: 19,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignUpPage;
