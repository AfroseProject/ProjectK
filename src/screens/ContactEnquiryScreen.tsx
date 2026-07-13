import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import functions from '@react-native-firebase/functions';
import { theme } from '../theme';

export const ContactEnquiryScreen = ({ route, navigation }: any) => {
  const { listingId } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContact = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await functions().httpsCallable('getPrivateListingData')({ listingId });
      const { whatsappUrl } = result.data as { whatsappUrl: string };

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        navigation.goBack();
      } else {
        // Fallback to error
        setError('WhatsApp is not installed on your device.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contact details. Ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Landowner</Text>
      <Text style={styles.description}>
        Tapping 'Confirm' will share your interest and redirect you to WhatsApp.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleContact} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={theme.colors.surface} /> : <Text style={styles.buttonText}>Confirm & Open WhatsApp</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.cancelButton]} 
        onPress={() => navigation.goBack()} 
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.m, backgroundColor: theme.colors.background, justifyContent: 'center' },
  title: { ...theme.typography.h2, marginBottom: theme.spacing.m, textAlign: 'center' },
  description: { ...theme.typography.body1, textAlign: 'center', marginBottom: theme.spacing.xl, color: theme.colors.textSecondary },
  button: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: 8, alignItems: 'center', marginBottom: theme.spacing.m },
  buttonText: { ...theme.typography.button, color: theme.colors.surface },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary },
  cancelButtonText: { ...theme.typography.button, color: theme.colors.primary },
  error: { color: theme.colors.error, marginBottom: theme.spacing.m, textAlign: 'center' },
});
