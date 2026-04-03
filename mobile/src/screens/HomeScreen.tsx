import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, {user?.name}!</Text>
        <Text style={styles.roleBadge}>{user?.role}</Text>
      </View>
      
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Products')}>
          <Text style={styles.cardIcon}>📦</Text>
          <Text style={styles.cardTitle}>Inventory</Text>
          <Text style={styles.cardDesc}>Manage products & stock</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.cardIcon}>🛒</Text>
          <Text style={styles.cardTitle}>Point of Sale</Text>
          <Text style={styles.cardDesc}>Process new sales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.cardIcon}>👥</Text>
          <Text style={styles.cardTitle}>Customers</Text>
          <Text style={styles.cardDesc}>View directory</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.cardIcon}>📊</Text>
          <Text style={styles.cardTitle}>Reports</Text>
          <Text style={styles.cardDesc}>View analytics</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f1f5f9' },
  header: { marginTop: 40, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 18, color: '#64748b', marginTop: 5 },
  roleBadge: { alignSelf: 'flex-start', backgroundColor: '#e0e7ff', color: '#4338ca', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontSize: 12, fontWeight: 'bold', marginTop: 10, overflow: 'hidden' },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  cardIcon: { fontSize: 32, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 5 },
  cardDesc: { fontSize: 12, color: '#64748b' },
  logoutButton: { backgroundColor: '#ef4444', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
