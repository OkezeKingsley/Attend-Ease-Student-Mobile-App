import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SInfo from 'react-native-sensitive-info';

function ProfilePage () {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('Loading...');
  const [lastName, setLastName] = useState('Loading...');
  const [matricNumber, setMatricNumber] = useState('Loading...');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedMatriculationId = await AsyncStorage.getItem('matricNumber');

        setFirstName(storedFirstName || 'Not found');
        setLastName(storedLastName || 'Not found');
        setMatricNumber(storedMatriculationId || 'Not found');
      } catch (error) {
        console.log('Error fetching profile data:', error);
        setFirstName('Not found');
        setLastName('Not found');
        setMatricNumber('Not found');
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    setButtonDisabled(true);

    try { 
      await SInfo.deleteItem('authToken', {
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain',
      });
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Error', 'There was an error logging out. Please try again.');
    } finally {
      setButtonDisabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.value}>{firstName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.value}>{lastName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Matriculation Number:</Text>
          <Text style={styles.value}>{matricNumber}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} 
        onPress={handleLogout}
        disabled={buttonDisabled}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  value: {
    fontSize: 18,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: 'tomato',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfilePage;

