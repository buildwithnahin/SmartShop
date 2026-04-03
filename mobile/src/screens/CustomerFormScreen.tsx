import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CustomerFormRouteProp = RouteProp<RootStackParamList, 'CustomerForm'>;

export const CustomerFormScreen = () => {
  const route = useRoute<CustomerFormRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const customer = route.params?.customer;

  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name,
        phone: phone || undefined,
      };

      if (customer?.id) {
        await apiClient.put(`/customers/${customer.id}`, payload);
        Alert.alert('Success', 'Customer updated successfully');
      } else {
        await apiClient.post('/customers', payload);
        Alert.alert('Success', 'Customer added successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm', 'Delete this customer?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          setLoading(true);
          await apiClient.delete(`/customers/${customer.id}`);
          navigation.goBack();
        } catch (error: any) {
          Alert.alert('Error', error.response?.data?.message || 'Failed to delete customer');
          setLoading(false);
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{customer ? 'Edit Customer' : 'Add Customer'}</Text>
      
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Customer Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Phone Number (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Customer</Text>}
        </TouchableOpacity>

        {customer && (
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete} disabled={loading}>
            <Text style={styles.buttonText}>Delete Customer</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
            <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f1f5f9', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#0f172a' },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2 },
  input: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
  button: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  deleteButton: { backgroundColor: '#ef4444', marginTop: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { padding: 15, alignItems: 'center', marginTop: 10 },
  cancelText: { color: '#64748b', fontSize: 16, fontWeight: 'bold' }
});
