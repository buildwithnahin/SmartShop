import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Products'>;

export const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/products');
      setProducts(res.data.data.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={[styles.card, item.stockQuantity <= item.lowStockThreshold && styles.lowStock]}
      onPress={() => navigation.navigate('ProductForm', { product: item })}
    >
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.stockBadge}>
        <Text style={styles.stockText}>Stock: {item.stockQuantity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Inventory</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ProductForm', {})}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 30 },
  backButton: { fontSize: 16, color: '#64748b', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  addButton: { backgroundColor: '#3b82f6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  lowStock: { borderLeftWidth: 4, borderLeftColor: '#ef4444' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  price: { fontSize: 14, color: '#64748b', marginTop: 4 },
  stockBadge: { backgroundColor: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  stockText: { fontSize: 12, fontWeight: 'bold', color: '#334155' }
});
