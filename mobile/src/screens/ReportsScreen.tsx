import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';

export const ReportsScreen = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/reports/dashboard');
      setSummary(res.data.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        Alert.alert('Access Denied', 'Only administrators can view reports.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to load report data');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Analytics</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
      ) : summary ? (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.row}>
            <View style={[styles.card, styles.cardToday]}>
              <Text style={styles.cardLabel}>Revenue</Text>
              <Text style={styles.cardValue}>${summary.today.revenue.toFixed(2)}</Text>
            </View>
            <View style={[styles.card, styles.cardToday]}>
              <Text style={styles.cardLabel}>Sales</Text>
              <Text style={styles.cardValue}>{summary.today.salesCount}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.row}>
            <View style={[styles.card, styles.cardMonth]}>
              <Text style={styles.cardLabel}>Revenue</Text>
              <Text style={styles.cardValue}>${summary.thisMonth.revenue.toFixed(2)}</Text>
            </View>
            <View style={[styles.card, styles.cardMonth]}>
              <Text style={styles.cardLabel}>Sales</Text>
              <Text style={styles.cardValue}>{summary.thisMonth.salesCount}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Inventory Alerts</Text>
          <View style={[styles.card, styles.cardAlert]}>
            <Text style={[styles.cardLabel, { color: '#ef4444' }]}>Low Stock Items</Text>
            <Text style={[styles.cardValue, { color: '#ef4444' }]}>{summary.lowStockAlerts}</Text>
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { fontSize: 16, color: '#64748b', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  content: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 20, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2, marginHorizontal: 5, alignItems: 'center' },
  cardToday: { borderTopWidth: 4, borderTopColor: '#3b82f6' },
  cardMonth: { borderTopWidth: 4, borderTopColor: '#10b981' },
  cardAlert: { borderTopWidth: 4, borderTopColor: '#ef4444', marginHorizontal: 5, marginBottom: 30 },
  cardLabel: { fontSize: 14, color: '#64748b', marginBottom: 5 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' }
});
