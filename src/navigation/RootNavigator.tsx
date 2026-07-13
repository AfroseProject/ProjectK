import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { LoginScreen } from '../screens/LoginScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { RoleSelectionScreen } from '../screens/RoleSelectionScreen';

import { ListingWizardScreen } from '../screens/ListingWizardScreen';
import { DiscoveryFeedScreen } from '../screens/DiscoveryFeedScreen';
import { ContactEnquiryScreen } from '../screens/ContactEnquiryScreen';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }: any) => {
  const user = useAuthStore(state => state.user);
  
  if (user?.role === 'landowner') {
    return <ListingWizardScreen />;
  }
  
  return <DiscoveryFeedScreen navigation={navigation} />;
};

export const RootNavigator = () => {
  const { setUser, isAuthenticated } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await firestore().collection('users').doc(firebaseUser.uid).get();
        // @ts-ignore
        if (userDoc.exists) {
          setUser(userDoc.data() as any);
        }
      } else {
        setUser(null);
      }
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, [initializing, setUser]);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ContactEnquiry" component={ContactEnquiryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});

