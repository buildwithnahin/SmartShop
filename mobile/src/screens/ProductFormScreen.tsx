import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProductFormRouteProp = RouteProp<RootStackParamList, 'ProductForm'>;

export const ProductFormScreen = () => {
  const route = useRoute<ProductFormRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const product = route.params?.product;

  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() || '0');
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold?.toString() || '5');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Name and Price are required');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity, 10),
        lowStockThreshold: parseInt(lowStockThreshold, 10),
      };

      if (product?.id) {
        await apiClient.put(`/products/${product.id}`, payload);
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await apiClient.post('/products', payload);
        Alert.alert('Success', 'Product added successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm', 'Delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          setLoading(true);
          await apiClient.delete(`/products/${product.id}`);
          navigation.goBack();
        } catch (error: any) {
          Alert.alert('Error', error.response?.data?.message || 'Failed to delete (Admins only?)');
          setLoading(false);
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product ? 'Edit Product' : 'Add Product'}</Text>
      
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Price ($)" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Stock Quantity" value={stockQuantity} onChangeText={setStockQuantity} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Low Stock Threshold" value={lowStockThreshold} onChangeText={setLowStockThreshold} keyboardType="numeric" />
        
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Product</Text>}
        </TouchableOpacity>

        {product && (
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete} disabled={loading}>
            <Text style={styles.buttonText}>Delete Product</Text>
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
