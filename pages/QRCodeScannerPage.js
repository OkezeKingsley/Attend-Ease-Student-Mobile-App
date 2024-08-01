import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SInfo from 'react-native-sensitive-info';
import axios from 'axios';

function QRCodeScannerPage () {
  const navigation = useNavigation();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [data, setData] = useState("showData");
  const [cameraType, setCameraType] = useState("back");
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const [isEmulator, setIsEmulator] = useState(false);
  const [rectangleContainerBorderColor, setRectangleContainerBorderColor] = useState("tomato");

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need your permission to use your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasCameraPermission(true);
        console.log('You can use the camera');
      } else {
        setHasCameraPermission(false);
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
    }

    DeviceInfo.isEmulator().then((result) => {
      setIsEmulator(result);
      if (result) {
        setCameraType("front");
      } else {
        setCameraType("back");
      }
    });

    console.log('data is', data);
  }, []);

  const toggleFlash = () => {
    setFlashMode(
      flashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.torch
        : RNCamera.Constants.FlashMode.off
    );
  };

  const switchCamera = () => {
    if (!isEmulator) {
      setCameraType(
        cameraType === "back"
          ? "front"
          : "back"
      );
    } else {
      Alert.alert("Camera Switch Disabled", "Switching the camera is disabled on an emulator.");
    }
  };

  const sendAttendanceData = async (data) => {

    try {
      const token = await SInfo.getItem('authToken', {
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain',
      });


      const studentId = await AsyncStorage.getItem('studentId');
  
      if (!token || !studentId) {
        navigation.replace('Login');
        return;
      }

      const response = await axios.post(
        '/student/mark-attendance',
        {
          classSessionId: data, // assuming QR code contains classSessionId
          studentId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        navigation.navigate('SuccessPage', { message: response.data.message });
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.error;
  
        if (status === 400 || status === 404 || status === 403 || status === 500) {
          navigation.navigate('FailurePage', { message: errorMessage });
        } else if (status === 401) {
          navigation.replace('Login');
        } else if (status === 409) {
          navigation.navigate('AlreadyMarkedPage', { message: errorMessage });
        } else {
          navigation.navigate('FailurePage', { message: "An unexpected error occurred" });
        }
      } else {
        navigation.navigate('FailurePage', { message: "An unknown error occurred!" });
      }
    } finally { 
      //change the rectangle border to tomato irrespective of the resposne
      setRectangleContainerBorderColor("tomato");
     }
  };

  const handleScanSuccess = (e) => {
    console.log('QR code scanned:', e);
    setData(e.data);
    // Alert.alert('Scan successful', `Data: ${e.data}`);
    console.log('Scanned data:', e.data);
    sendAttendanceData(e.data);
    setRectangleContainerBorderColor("#4CAF50");
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleFlash}>
          <Icon name={flashMode === RNCamera.Constants.FlashMode.off ? 'flash-off' : 'flash'} size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Attend Ease</Text>
        <TouchableOpacity onPress={switchCamera}>
          <Icon name="camera-reverse" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {hasCameraPermission ? (
        <View style={styles.scannerContainer}>
          <QRCodeScanner
            onRead={handleScanSuccess}
            flashMode={flashMode}
            reactivate={true}
            reactivateTimeout={5000}
            cameraType={cameraType}
            showMarker={true}
            customMarker={
              <View style={styles.customMarkerContainer}>
                <View style={styles.rectangleContainer}>
                  <View style={[{borderColor: rectangleContainerBorderColor}, styles.topLeft]} />
                  <View style={[{borderColor: rectangleContainerBorderColor}, styles.topRight]} />
                  <View style={[{borderColor: rectangleContainerBorderColor}, styles.bottomLeft]} />
                  <View style={[{borderColor: rectangleContainerBorderColor}, styles.bottomRight]} />
                </View>
              </View>
            }
            containerStyle={styles.qrContainer}
            cameraStyle={styles.cameraStyle}
          />
        </View>
      ) : (
        <View style={styles.noCameraContainer}>
          <Text style={styles.noCameraText}>No access to camera granted</Text>
        </View>
      )}
    </View>
  );

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  cameraStyle: {
    flex: 1,
    width: '100%',
  },
  noCameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCameraText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  customMarkerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangleContainer: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    position: 'relative',
  },
  topLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    // borderColor: 'tomato',
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    // borderColor: 'tomato',
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    // borderColor: 'tomato',
  },
  bottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    // borderColor: 'tomato',
  },
});



export default QRCodeScannerPage;
