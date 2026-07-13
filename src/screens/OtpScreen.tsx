import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import firestore from '@react-native-firebase/firestore';
import { useAuthStore } from '../store/authStore';

export const OtpScreen = ({ route, navigation }: any) => {
  const { confirmation } = route.params;
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useAuthStore(state => state.setUser);

  const handleVerifyOtp = async () => {
    if (!code) return;
    setLoading(true);
    setError('');
    try {
      const userCredential = await confirmation.confirm(code);
      const user = userCredential?.user;
      
      if (user) {
        // Check if user exists in Firestore
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        // @ts-ignore
        if (userDoc.exists) {
           setUser(userDoc.data() as any);
           // Navigate will be handled by RootNavigator state change
        } else {
           // New user, go to role selection
           navigation.navigate('RoleSelection', { uid: user.uid, phone: user.phoneNumber });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.enterOtp')}</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleVerifyOtp} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={theme.colors.surface} /> : <Text style={styles.buttonText}>{t('common.submit')}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.m, backgroundColor: theme.colors.background, justifyContent: 'center' },
  title: { ...theme.typography.h2, marginBottom: theme.spacing.l, textAlign: 'center' },
  input: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.m, fontSize: theme.typography.body1.fontSize, textAlign: 'center' },
  button: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: 8, alignItems: 'center' },
  buttonText: { ...theme.typography.button, color: theme.colors.surface },
  error: { color: theme.colors.error, marginBottom: theme.spacing.m, textAlign: 'center' },
});
