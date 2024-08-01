import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SInfo from 'react-native-sensitive-info';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function AttendanceHistoryPage () {
  const navigation = useNavigation();
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      console.log('fetch attendance effect called');
      try {
        const studentId = await AsyncStorage.getItem('studentId');
        console.log('Retrieved studentId:', studentId);
        if (!studentId) {
          Alert.alert('Error', 'Your session has expired!');
          navigation.replace('Login');
          return;
        }

        const token = await SInfo.getItem('authToken', {
          sharedPreferencesName: 'mySharedPrefs',
          keychainService: 'myKeychain',
        });
        console.log('Retrieved token:', token);

        if (!token) {
          console.error('Token not found');
          navigation.replace('Login');
          return;
        }

        const response = await axios.post('/student/attendance-history', {
          studentId
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API response:', response);

        if (response.status === 200) {
          setAttendanceHistory(response.data);
          console.log("attended data", response.data);
        } else {
          setError('Unexpected error occurred. Please try again.');
        }

      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.error;
  
          if (status === 400 || status === 404 || status === 500) {
            Alert.alert('Error', message);
          } else if (status === 401) {
            navigation.replace('Login');
          } else { Alert.alert('Error', 'An unexpected error occurred!'); }
      
        } else {
          console.log(error)
          Alert.alert('Error', 'An unknown error occurred!');
        }


      }
    };

    fetchAttendanceHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[1].substring(0, 5);
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance History</Text>
      {attendanceHistory.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Icon name="history" size={50} color="#555" />
          <Text style={styles.noDataText}>You have no recorded attendance yet</Text>
        </View>
      ) : (
        <FlatList
          data={attendanceHistory.reverse()}
          renderItem={({ item }) => (
            <View key={item._id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.className}>{item.className}</Text>
                <Text style={[styles.status, {color: item.status === 'Present' ? 'green' : 'red'}]}>{item.status}</Text>
              </View>
              <Text style={styles.date}>{formatDate(item.date)} at {formatTime(item.time)}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingTop: 10,
    paddingBottom: 10,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
});

export default AttendanceHistoryPage;
