import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.name?.split(' ')[0]}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <MaterialCommunityIcons name="logout" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.roleBadgeContainer}>
        <Text style={styles.roleBadge}>{user?.role}</Text>
      </View>
      
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.card, { borderTopColor: '#3b82f6' }]} onPress={() => navigation.navigate('Products')}>
          <View style={[styles.iconContainer, { backgroundColor: '#eff6ff' }]}>
            <MaterialCommunityIcons name="package-variant-closed" size={32} color="#3b82f6" />
          </View>
          <Text style={styles.cardTitle}>Inventory</Text>
          <Text style={styles.cardDesc}>Manage products & stock</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { borderTopColor: '#10b981' }]} onPress={() => navigation.navigate('POS')}>
          <View style={[styles.iconContainer, { backgroundColor: '#ecfdf5' }]}>
            <MaterialCommunityIcons name="cart-outline" size={32} color="#10b981" />
          </View>
          <Text style={styles.cardTitle}>Point of Sale</Text>
          <Text style={styles.cardDesc}>Process new sales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { borderTopColor: '#8b5cf6' }]} onPress={() => navigation.navigate('Customers')}>
          <View style={[styles.iconContainer, { backgroundColor: '#f5f3ff' }]}>
            <MaterialCommunityIcons name="account-group-outline" size={32} color="#8b5cf6" />
          </View>
          <Text style={styles.cardTitle}>Customers</Text>
          <Text style={styles.cardDesc}>View directory</Text>
        </TouchableOpacity>

        {user?.role === 'ADMIN' && (
          <TouchableOpacity style={[styles.card, { borderTopColor: '#f59e0b' }]} onPress={() => navigation.navigate('Reports')}>
            <View style={[styles.iconContainer, { backgroundColor: '#fffbeb' }]}>
              <MaterialCommunityIcons name="chart-box-outline" size={32} color="#f59e0b" />
            </View>
            <Text style={styles.cardTitle}>Reports</Text>
            <Text style={styles.cardDesc}>View analytics</Text>
          </TouchableOpacity>
        )}
      </View>
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
    backgroundColor: '#fff',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 4 },
  roleBadgeContainer: { paddingHorizontal: 20, paddingTop: 15 },
  roleBadge: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#3b82f6', 
    color: '#fff', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    fontSize: 12, 
    fontWeight: 'bold', 
    overflow: 'hidden' 
  },
  grid: { 
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    padding: 20,
    paddingTop: 15
  },
  card: { 
    backgroundColor: '#fff', 
    width: (width - 55) / 2, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 15, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderTopWidth: 4
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },
  logoutButton: { 
    padding: 10, 
    backgroundColor: '#fef2f2', 
    borderRadius: 12,
  },
});
