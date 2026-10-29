import { Button } from './Button';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowBackIcon, DocumentIcon } from './Icons';
import { ScreenStatusBar } from './ScreenStatusBar';

export const PaymentInformation: React.FC<{
  amount: number;
  onBack: () => void;
  transactionCharge?: number;
  subtitle?: string;
}> = ({
  amount,
  onBack,
  transactionCharge = 0,
  subtitle = 'AIOC 2027 · Registration',
}) => {
  const insets = useSafeAreaInsets();
  const money = (value: number) =>
    `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.back}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back to registration"
        >
          <ArrowBackIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Payment Information</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summary}>
          <View style={styles.icon}>
            <DocumentIcon size={24} color="#C57518" />
          </View>
          <Text style={styles.eyebrow}>REGISTRATION PAYMENT</Text>
          <Text style={styles.amountLabel}>Total amount payable</Text>
          <Text style={styles.amount}>{money(amount + transactionCharge)}</Text>
          {/* <Text style={styles.currency}>Indian Rupees · INR</Text> */}
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Payment breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Registration amount</Text>
            <Text style={styles.value}>{money(amount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Internet transaction charge</Text>
            <Text style={styles.value}>{money(transactionCharge)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total payable</Text>
            <Text style={styles.totalValue}>
              {money(amount + transactionCharge)}
            </Text>
          </View>
        </View>
        <Button
          customLayout
          style={styles.pay}
          accessibilityRole="button"
          onPress={() =>
            Alert.alert('Payment', 'Payment gateway is not connected yet.')
          }
        >
          <Text style={styles.payText}>Pay Now</Text>
          <Text style={styles.payArrow}>→</Text>
        </Button>
        {/* <TouchableOpacity style={styles.edit} onPress={onBack} accessibilityRole="button"><Text style={styles.editText}>Review registration details</Text></TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    backgroundColor: '#0B1728',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1C2C42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#B8C7DB',
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    gap: 18,
  },
  summary: {
    alignItems: 'center',
    paddingVertical: 26,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF4E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  eyebrow: {
    color: '#A85B0C',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  amountLabel: {
    marginTop: 18,
    color: '#64748B',
    fontSize: 14,
  },
  amount: {
    color: '#0F294A',
    fontSize: 36,
    lineHeight: 46,
    fontWeight: '800',
    marginTop: 6,
    textAlign: 'center',
  },
  currency: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 6,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
  },
  title: {
    color: '#0F294A',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 14,
  },
  label: {
    flex: 1,
    color: '#64748B',
    fontSize: 13,
    lineHeight: 20,
  },
  value: {
    flexShrink: 1,
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 10,
    paddingTop: 18,
  },
  totalLabel: {
    flex: 1,
    fontSize: 15,
    color: '#0F294A',
    fontWeight: '700',
  },
  totalValue: {
    flexShrink: 1,
    fontSize: 19,
    color: '#0F294A',
    fontWeight: '800',
    textAlign: 'right',
  },
  pay: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F294A',
    borderRadius: 12,
    padding: 16,
    minHeight: 54,
  },
  payText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  payArrow: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  edit: {
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  editText: {
    color: '#526681',
    fontSize: 13,
    fontWeight: '600',
  },
});
