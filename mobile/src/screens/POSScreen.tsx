import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

export const POSScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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
    if (product.stockQuantity <= 0) {
      Alert.alert('Out of Stock', 'This product is currently unavailable.');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          Alert.alert('Limit Reached', 'Cannot add more than available stock.');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQ = item.quantity + delta;
        if (newQ > item.stockQuantity) {
          Alert.alert('Limit Reached', 'Cannot exceed available stock.');
          return item;
        }
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    Alert.alert('Confirm Sale', `Charge total amount of $${totalAmount.toFixed(2)}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete Sale', onPress: async () => {
        try {
          setLoading(true);
          const payload = {
            totalAmount,
            items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
          };
          await apiClient.post('/sales', payload);
          Alert.alert('Success', 'Sale completed successfully!');
          setCart([]);
          fetchProducts();
        } catch (error) {
          Alert.alert('Error', 'Failed to complete sale.');
        } finally {
          setLoading(false);
        }
      }}
    ]);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={[styles.productCard, item.stockQuantity <= 0 && styles.outOfStock]} 
      onPress={() => addToCart(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholderThumb]}>
          <MaterialCommunityIcons name="image-off" size={24} color="#cbd5e1" />
        </View>
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productStock}>Stock: {item.stockQuantity}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity style={styles.qBtn} onPress={() => updateQuantity(item.id, -1)}>
          <Text style={styles.qText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qValue}>{item.quantity}</Text>
        <TouchableOpacity style={styles.qBtn} onPress={() => updateQuantity(item.id, 1)}>
          <Text style={styles.qText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromCart(item.id)}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Point of Sale</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Products ({products.length})</Text>
          {loading && products.length === 0 ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : (
             <FlatList
               data={products}
               keyExtractor={(item) => item.id}
               renderItem={renderProduct}
               numColumns={2}
               columnWrapperStyle={styles.row}
               contentContainerStyle={{ paddingBottom: 20 }}
             />
          )}
        </View>

        <View style={styles.cartSection}>
          <View style={styles.cartHeader}>
            <Text style={styles.sectionTitle}>Cart ({cart.length})</Text>
            {cart.length > 0 && (
              <TouchableOpacity onPress={() => setCart([])}>
                <Text style={styles.clearCart}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            ListEmptyComponent={<Text style={styles.emptyCart}>Cart is empty</Text>}
          />
          
          <View style={styles.checkoutFooter}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutBtn, cart.length === 0 && styles.checkoutBtnDisabled]} 
              onPress={handleCheckout}
              disabled={cart.length === 0 || loading}
            >
               {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutText}>Charge</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff' 
  },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  content: { flex: 1, flexDirection: 'row' },
  productsSection: { flex: 3, padding: 10 },
  cartSection: { flex: 2, backgroundColor: '#fff', borderLeftWidth: 1, borderColor: '#e2e8f0', elevation: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#334155' },
  row: { justifyContent: 'space-between' },
  productCard: { 
    backgroundColor: '#fff', width: '48%', marginBottom: 10, borderRadius: 12, padding: 10,
    elevation: 2, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset:{width:0,height:2}
  },
  outOfStock: { opacity: 0.5 },
  thumbnail: { width: '100%', height: 80, borderRadius: 8, marginBottom: 8 },
  placeholderThumb: { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  cardInfo: { width: '100%', alignItems: 'center' },
  productName: { fontSize: 14, fontWeight: '700', color: '#0f172a', textAlign: 'center' },
  productPrice: { fontSize: 14, color: '#3b82f6', fontWeight: 'bold' },
  productStock: { fontSize: 11, color: '#64748b' },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  clearCart: { color: '#ef4444', fontWeight: 'bold' },
  emptyCart: { textAlign: 'center', marginTop: 20, color: '#94a3b8' },
  cartItem: { padding: 15, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  cartItemInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cartItemName: { fontSize: 14, fontWeight: '600', flex: 1 },
  cartItemPrice: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  qBtn: { backgroundColor: '#f1f5f9', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  qText: { fontSize: 18, fontWeight: 'bold', color: '#334155' },
  qValue: { marginHorizontal: 15, fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { marginLeft: 15, padding: 5 },
  checkoutFooter: { padding: 20, backgroundColor: '#f8fafc', borderTopWidth: 1, borderColor: '#e2e8f0' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#64748b' },
  totalValue: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  checkoutBtn: { backgroundColor: '#10b981', padding: 18, borderRadius: 12, alignItems: 'center' },
  checkoutBtnDisabled: { backgroundColor: '#a7f3d0' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
