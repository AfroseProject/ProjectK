import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import firestore from '@react-native-firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { User } from '../types/schema';

export const RoleSelectionScreen = ({ route }: any) => {
  const { uid, phone } = route.params;
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore(state => state.setUser);

  const handleSelectRole = async (role: 'landowner' | 'responder') => {
    setLoading(true);
    try {
      const newUser: User = {
        uid,
        role,
        phone,
        language: i18n.language as 'en' | 'ta',
        createdAt: new Date(),
      };
      
      await firestore().collection('users').doc(uid).set(newUser);
      setUser(newUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <TouchableOpacity style={styles.card} onPress={() => handleSelectRole('landowner')}>
        <Text style={styles.cardTitle}>{t('roles.landowner')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.card, styles.secondaryCard]} onPress={() => handleSelectRole('responder')}>
        <Text style={styles.cardTitle}>{t('roles.responder')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.m, backgroundColor: theme.colors.background, justifyContent: 'center' },
  title: { ...theme.typography.h2, marginBottom: theme.spacing.xl, textAlign: 'center' },
  card: { backgroundColor: theme.colors.primary, padding: theme.spacing.xl, borderRadius: 12, marginBottom: theme.spacing.m, alignItems: 'center' },
  secondaryCard: { backgroundColor: theme.colors.secondary },
  cardTitle: { ...theme.typography.h3, color: theme.colors.surface },
});
