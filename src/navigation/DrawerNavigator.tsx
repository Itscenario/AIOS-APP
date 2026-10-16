import { formatProfileName } from '../utils/profileName';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabNavigator } from './BottomTabNavigator';
import { DrawerParamList } from './types';
import { logout, useAppDispatch, useAppSelector } from '../store';
import { images } from '../constants/images';
import {
  DashboardIcon,
  JobsTabIcon,
  CertificatesTabIcon,
  MidTermTabIcon,
  ProfileTabIcon,
  LogoutIcon,
  CloseIcon,
  PersonIcon,
} from '../components/Icons';

const Drawer = createDrawerNavigator<DrawerParamList>();
const destinations = [
  { route: 'Dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { route: 'Jobs', label: 'Job Opportunities', Icon: JobsTabIcon },
  {
    route: 'Certificates',
    label: 'Annual Conference',
    Icon: CertificatesTabIcon,
  },
  { route: 'MidTerm', label: 'Mid-Term Conference', Icon: MidTermTabIcon },
  { route: 'Profile', label: 'My Account', Icon: ProfileTabIcon },
] as const;

const PortalDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const dispatch = useAppDispatch();
  const savedProfile = useAppSelector(state => state.auth.profile);
  const profile = savedProfile?.membershipId?.match(/^LM-\d+$/)
    ? { ...savedProfile, membershipId: undefined }
    : savedProfile;
  const insets = useSafeAreaInsets();
  const portal = props.state.routes[props.state.index];
  const activeTab =
    portal.state?.routes[portal.state.index ?? 0]?.name ?? 'Dashboard';
  const name =
    profile?.name ||
    [profile?.title, profile?.firstName, profile?.surname]
      .filter(Boolean)
      .join(' ') ||
    'My Profile';

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profile}>
          <View style={styles.brandRow}>
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brand}>AIOS</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close navigation menu"
              style={styles.close}
              onPress={() => props.navigation.closeDrawer()}
            >
              <CloseIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileIdentityRow}>
            {profile?.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.profileAvatar} resizeMode="cover" />
            ) : (
              <View style={styles.profileAvatarPlaceholder}>
                <PersonIcon size={28} color="#CBD5E1" />
              </View>
            )}
            <View style={styles.profileIdentityDetails}>
          <Text style={styles.name}>{formatProfileName(name)}</Text>
          {profile?.email ? (
            <Text style={styles.email}>{profile.email}</Text>
          ) : null}
            </View>
          </View>
        </View>
        <DrawerItem
          label="Home"
          focused={activeTab === 'Dashboard'}
          activeTintColor="#EA580C"
          inactiveTintColor="#334155"
          activeBackgroundColor="#FFF7ED"
          style={styles.item}
          labelStyle={styles.itemLabel}
          icon={({ color, size }) => <DashboardIcon size={size} color={color} />}
          onPress={() => {
            props.navigation.navigate('Portal', { screen: 'Dashboard' });
            props.navigation.closeDrawer();
          }}
        />
        {/* Navigation items temporarily hidden until replacement items are added.
        <Text style={styles.sectionLabel}>EXPLORE</Text>
        {destinations.map(({ route, label, Icon }) => (
          <DrawerItem
            key={route}
            label={label}
            focused={activeTab === route}
            activeTintColor="#EA580C"
            inactiveTintColor="#334155"
            activeBackgroundColor="#FFF7ED"
            style={styles.item}
            labelStyle={styles.itemLabel}
            icon={({ color, size }) => <Icon size={size} color={color} />}
            onPress={() => {
              props.navigation.navigate('Portal', { screen: route });
              props.navigation.closeDrawer();
            }}
          />
        ))}
        */}
      </DrawerContentScrollView>
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <TouchableOpacity
          style={styles.logout}
          accessibilityRole="button"
          accessibilityLabel="Logout"
          onPress={() => {
            dispatch(logout());
            props.navigation
              .getParent()
              ?.reset({ index: 0, routes: [{ name: 'Login' }] });
          }}
        >
          <LogoutIcon size={21} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const DrawerNavigator: React.FC = () => (
  <Drawer.Navigator
    drawerContent={props => <PortalDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: 'front',
      drawerStyle: { width: '84%', maxWidth: 340 },
      overlayColor: 'rgba(10, 30, 63, 0.45)',
    }}
  >
    <Drawer.Screen
      name="Portal"
      component={BottomTabNavigator}
      options={({ route }) => ({
        swipeEnabled: (getFocusedRouteNameFromRoute(route) ?? 'Dashboard') === 'Dashboard',
      })}
    />
  </Drawer.Navigator>
);

export default DrawerNavigator;

const styles = StyleSheet.create({
  profileIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  profileAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E3556',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIdentityDetails: {
    flex: 1,
    minWidth: 0,
  },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 12 },
  profile: {
    backgroundColor: '#0A1E3F',
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  logo: { width: 44, height: 44, backgroundColor: '#FFFFFF', borderRadius: 10 },
  brand: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', flex: 1 },
  close: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 23 },
  email: { color: '#CBD5E1', fontSize: 12, marginTop: 5 },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 16,
    marginBottom: 8,
  },
  item: { borderRadius: 10 },
  itemLabel: { fontSize: 14, fontWeight: '600' },
  footer: { borderTopWidth: 1, borderTopColor: '#E2E8F0', padding: 16 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
  },
  logoutText: { color: '#DC2626', fontSize: 15, fontWeight: '700' },
});
