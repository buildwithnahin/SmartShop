import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalPurchase: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Customers'>;

export const CustomersScreen = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/customers');
      setCustomers(res.data.data.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCustomers();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('CustomerForm', { customer: item })}
    >
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone || 'No phone'}</Text>
      </View>
      <View style={styles.purchaseBadge}>
        <Text style={styles.purchaseText}>Total: ${item.totalPurchase.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Customers</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CustomerForm', {})}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
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
  name: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  phone: { fontSize: 14, color: '#64748b', marginTop: 4 },
  purchaseBadge: { backgroundColor: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  purchaseText: { fontSize: 12, fontWeight: 'bold', color: '#334155' },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20 }
});
