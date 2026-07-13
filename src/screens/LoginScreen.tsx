import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import auth from '@react-native-firebase/auth';

export const LoginScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const confirmation = await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
      setLoading(false);
      navigation.navigate('Otp', { confirmation });
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to send OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.login')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('auth.phoneNumber')}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSendOtp} 
        disabled={loading}
        accessibilityRole="button"
      >
        {loading ? <ActivityIndicator color={theme.colors.surface} /> : <Text style={styles.buttonText}>{t('common.continue')}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
    fontSize: theme.typography.body1.fontSize,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
  },
  error: {
    color: theme.colors.error,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
});
