import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  imageUrl?: string | null;
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
      <View style={styles.cardContent}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <MaterialCommunityIcons name="image-off-outline" size={24} color="#94a3b8" />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
      <View style={[styles.stockBadge, item.stockQuantity <= item.lowStockThreshold ? styles.stockBadgeLow : styles.stockBadgeOk]}>
        <Text style={[styles.stockText, item.stockQuantity <= item.lowStockThreshold ? styles.stockTextLow : styles.stockTextOk]}>
          Stock: {item.stockQuantity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Inventory</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ProductForm', {})}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
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
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  addButton: { 
    backgroundColor: '#3b82f6', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20 
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  },
  lowStock: { borderLeftColor: '#ef4444' },
  cardContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  productImage: { width: 48, height: 48, borderRadius: 10, marginRight: 15 },
  placeholderImage: { 
    backgroundColor: '#f1f5f9', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed'
  },
  textContainer: { flex: 1, paddingRight: 10 },
  name: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  price: { fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: '600' },
  stockBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  stockBadgeOk: { backgroundColor: '#f0fdf4' },
  stockBadgeLow: { backgroundColor: '#fef2f2' },
  stockText: { fontSize: 12, fontWeight: 'bold' },
  stockTextOk: { color: '#16a34a' },
  stockTextLow: { color: '#ef4444' }
});
