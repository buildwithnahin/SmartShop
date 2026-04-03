import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ProductFormScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const product = route.params?.product;

  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() || '0');
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold?.toString() || '5');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert('Validation Error', 'Name and Price are required.');
      return;
    }

    const payload = {
      name,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity, 10),
      lowStockThreshold: parseInt(lowStockThreshold, 10),
      ...(imageUrl ? { imageUrl } : {})
    };

    try {
      setLoading(true);
      if (product?.id) {
        await apiClient.put(`/products/${product.id}`, payload);
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await apiClient.post('/products', payload);
        Alert.alert('Success', 'Product added successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to save product';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          try {
            setLoading(true);
            await apiClient.delete(`/products/${product.id}`);
            navigation.goBack();
          } catch (error: any) {
            Alert.alert('Error', 'Failed to delete product');
          } finally {
            setLoading(false);
          }
        } 
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>{product?.id ? 'Edit Product' : 'New Product'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Blue T-Shirt"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stock Quantity</Text>
          <TextInput
            style={styles.input}
            value={stockQuantity}
            onChangeText={setStockQuantity}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Low Stock Alert Threshold</Text>
          <TextInput
            style={styles.input}
            value={lowStockThreshold}
            onChangeText={setLowStockThreshold}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Image URL (Optional)</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/image.jpg"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Product</Text>}
      </TouchableOpacity>

      {product?.id && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
          <Text style={styles.deleteText}>Delete Product</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  backButton: { padding: 5 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  formCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    padding: 14, 
    borderRadius: 12, 
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#0f172a'
  },
  saveButton: { 
    backgroundColor: '#3b82f6', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginHorizontal: 20,
    elevation: 2 
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { 
    padding: 16, 
    alignItems: 'center', 
    marginTop: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 12,
    backgroundColor: '#fef2f2'
  },
  deleteText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' }
});
