import { Button } from './Button';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { LogoutIcon } from './Icons';

export const LogoutConfirmation: React.FC<{
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ visible, onCancel, onConfirm }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.card} accessibilityViewIsModal>
        <View style={styles.icon}><LogoutIcon size={30} color="#DC2626" /></View>
        <Text style={styles.title}>Log out of AIOS?</Text>
        <Text style={styles.message}>You can sign in again anytime to access your account.</Text>
        <View style={styles.actions}>
          <Button customLayout style={styles.cancel} onPress={onCancel} accessibilityRole="button"><Text style={styles.cancelText}>Cancel</Text></Button>
          <Button customLayout style={styles.confirm} onPress={onConfirm} accessibilityRole="button"><Text style={styles.confirmText}>Logout</Text></Button>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(7, 19, 38, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 380, borderRadius: 28, backgroundColor: '#FFFFFF', padding: 24, alignItems: 'center' },
  icon: { width: 68, height: 68, borderRadius: 24, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  message: { marginTop: 10, fontSize: 14, lineHeight: 22, color: '#64748B', textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 26 },
  cancel: { flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 14 },
  confirm: { flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#DC2626', borderRadius: 14 },
  cancelText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  confirmText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
