import React, { useState, useEffect } from 'react';
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
}

interface CartItem extends Product {
  quantity: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'POS'>;

export const POSScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/products');
      setProducts(res.data.data.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stockQuantity === 0) {
      Alert.alert('Error', 'Product out of stock');
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) {
        Alert.alert('Error', 'Maximum stock reached');
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      setProcessing(true);
      const payload = {
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
      };
      await apiClient.post('/sales', payload);
      Alert.alert('Success', 'Sale completed successfully!');
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to process sale');
    } finally {
      setProcessing(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => addToCart(item)}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.productStock}>Stock: {item.stockQuantity}</Text>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
        <Text style={styles.removeBtnText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Point of Sale</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.main}>
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Products</Text>
          {loading ? <ActivityIndicator size="large" color="#3b82f6" /> : (
            <FlatList
              data={products}
              keyExtractor={item => item.id}
              renderItem={renderProduct}
              numColumns={2}
            />
          )}
        </View>

        <View style={styles.cartSection}>
          <Text style={styles.sectionTitle}>Cart</Text>
          <FlatList
            data={cart}
            keyExtractor={item => item.id}
            renderItem={renderCartItem}
            ListEmptyComponent={<Text style={styles.emptyCart}>Cart is empty</Text>}
          />
          <View style={styles.checkoutBox}>
            <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
            <TouchableOpacity 
              style={[styles.checkoutBtn, cart.length === 0 && styles.disabledBtn]} 
              onPress={handleCheckout}
              disabled={cart.length === 0 || processing}
            >
              {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutBtnText}>Checkout</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  backButton: { fontSize: 16, color: '#64748b', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  main: { flex: 1, flexDirection: 'column' },
  productsSection: { flex: 1, padding: 10 },
  cartSection: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, elevation: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#1e293b' },
  productCard: { flex: 1, backgroundColor: '#fff', margin: 5, padding: 15, borderRadius: 10, alignItems: 'center', elevation: 2 },
  productName: { fontWeight: 'bold', textAlign: 'center' },
  productPrice: { color: '#3b82f6', marginTop: 5 },
  productStock: { fontSize: 12, color: '#64748b', marginTop: 5 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, marginBottom: 5 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontWeight: 'bold' },
  cartItemPrice: { color: '#64748b', fontSize: 12 },
  removeBtn: { padding: 5, backgroundColor: '#ef4444', borderRadius: 5 },
  removeBtnText: { color: '#fff', fontWeight: 'bold' },
  emptyCart: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },
  checkoutBox: { marginTop: 10, borderTopWidth: 1, borderColor: '#e2e8f0', paddingTop: 10 },
  totalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
  checkoutBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 10, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#94a3b8' },
  checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
