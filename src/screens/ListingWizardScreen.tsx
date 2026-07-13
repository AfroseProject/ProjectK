import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { theme } from '../theme';
import { getDBConnection, saveDraft, createTables } from '../utils/database';

const listingSchema = z.object({
  vegetationType: z.string().min(1, 'Required'),
  landSize: z.string().min(1, 'Required'),
  density: z.enum(['low', 'medium', 'high']),
  terms: z.enum(['free', 'paid', 'revenue_share', 'highest_offer']),
  isPrivateLand: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type ListingFormData = z.infer<typeof listingSchema>;

export const ListingWizardScreen = () => {
  const [step, setStep] = useState(1);
  const [draftId] = useState(`draft_${Date.now()}`);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      density: 'medium',
      terms: 'free',
    }
  });

  const formValues = watch();

  useEffect(() => {
    const initDbAndSaveDraft = async () => {
      try {
        const db = await getDBConnection();
        await createTables(db);
        await saveDraft(db, draftId, formValues);
      } catch (err) {
        console.error('Failed to save draft', err);
      }
    };
    const timer = setTimeout(initDbAndSaveDraft, 2000); // Auto-save debounce
    return () => clearTimeout(timer);
  }, [formValues, draftId]);

  const onSubmit = (data: ListingFormData) => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      console.log('Final Data', data);
      // Move to upload queue phase
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Listing (Step {step}/4)</Text>
      
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Vegetation Type</Text>
          <Controller
            control={control}
            name="vegetationType"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="e.g. Seemai Karuvelam" />
            )}
          />
          {errors.vegetationType && <Text style={styles.error}>{errors.vegetationType.message}</Text>}
          
          <Text style={styles.label}>Land Size (Acres)</Text>
          <Controller
            control={control}
            name="landSize"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType="numeric" placeholder="e.g. 5" />
            )}
          />
          {errors.landSize && <Text style={styles.error}>{errors.landSize.message}</Text>}
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Density</Text>
          <Text style={styles.placeholderText}>[Radio Buttons for Low/Medium/High]</Text>
          <Text style={styles.label}>Terms</Text>
          <Text style={styles.placeholderText}>[Radio Buttons for Free/Paid/etc]</Text>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Photos</Text>
          <Text style={styles.placeholderText}>[Camera Interface - Min 5, Max 20]</Text>
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.placeholderText}>[Map Pin Interface]</Text>
          <Controller
            control={control}
            name="isPrivateLand"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => onChange(!value)}>
                {/* @ts-ignore */}
                <View style={[styles.checkbox, value && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>I confirm this is private land.</Text>
              </TouchableOpacity>
            )}
          />
          {errors.isPrivateLand && <Text style={styles.error}>{errors.isPrivateLand.message}</Text>}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>{step < 4 ? 'Next' : 'Submit Listing'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.m, backgroundColor: theme.colors.background },
  title: { ...theme.typography.h2, marginBottom: theme.spacing.l, textAlign: 'center' },
  stepContainer: { marginBottom: theme.spacing.l },
  label: { ...theme.typography.h3, marginBottom: theme.spacing.s },
  input: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.s },
  button: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: 8, alignItems: 'center' },
  buttonText: { ...theme.typography.button, color: theme.colors.surface },
  error: { color: theme.colors.error, marginBottom: theme.spacing.m },
  placeholderText: { fontStyle: 'italic', color: theme.colors.textSecondary, marginBottom: theme.spacing.m },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: theme.colors.primary, marginRight: theme.spacing.s, borderRadius: 4 },
  checkboxChecked: { backgroundColor: theme.colors.primary },
  checkboxLabel: { ...theme.typography.body1 }
});
