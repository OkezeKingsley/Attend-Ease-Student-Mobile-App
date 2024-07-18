import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

function AlreadyMarkedPage ({ route }) {
  const navigation = useNavigation();
  const { message } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim]);

  const goBackFunction = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Already Marked!</Text>
      <Text style={styles.subHeaderText}>{message}</Text>
      <View style={styles.animationContainer}>
        <Animated.View style={[styles.circle, { opacity: opacityAnim }]}>
          <Animated.View style={[styles.checkMark, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.checkMarkText}>✓</Text>
          </Animated.View>
        </Animated.View>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={goBackFunction}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFA726',
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    color: '#555',
    marginBottom: 20,
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    fontSize: 48,
    color: '#FFA726',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 60,
    backgroundColor: '#FFA726',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default AlreadyMarkedPage;
