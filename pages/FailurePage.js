import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

function FailurePage ({ route }) {
  const { message } = route.params;
  const navigation = useNavigation();
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
      <Text style={styles.headerText}>Error!</Text>
      <Text style={styles.subHeaderText}>
        {message}
      </Text>
      <View style={styles.animationContainer}>
        <Animated.View style={[styles.circle, { opacity: opacityAnim }]}>
          <Animated.View style={[styles.crossMark, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.crossMarkText}>✗</Text>
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
    color: '#D32F2F',
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
    borderColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossMark: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossMarkText: {
    fontSize: 48,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 60,
    backgroundColor: '#D32F2F',
    borderRadius: 5,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default FailurePage;
