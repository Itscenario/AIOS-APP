import { formatProfileName } from '../utils/profileName';
import React, { useState } from 'react';
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
import { HomeScreen } from '../screens/HomeScreen';
import { AboutAIOSScreen } from '../screens/AboutAIOSScreen';
import { PresidentAIOSScreen } from '../screens/PresidentAIOSScreen';
import { AIOSThemeSongScreen } from '../screens/AIOSThemeSongScreen';
import { PastPresidentsScreen } from '../screens/PastPresidentsScreen';
import { OfficeBearersScreen } from '../screens/OfficeBearersScreen';
import { OfficeBearersSubCommitteeScreen } from '../screens/OfficeBearersSubCommitteeScreen';
import { GoverningCouncilScreen } from '../screens/GoverningCouncilScreen';
import { DrawerParamList } from './types';
import { logout, useAppDispatch, useAppSelector } from '../store';
import {
  DashboardIcon,
  JobsTabIcon,
  CertificatesTabIcon,
  MidTermTabIcon,
  ProfileTabIcon,
  LogoutIcon,
  PersonIcon,
  CloseIcon,
} from '../components/Icons';

const Drawer = createDrawerNavigator<DrawerParamList>();
const ABOUT_OPTIONS = [
  'About Us',
  'Address',
  'Governing Council',
  'Representative from State Society',
  'Office Bearers Sub-Committee',
  'Office Bearers',
  'Past Presidents',
  'AIOS Theme Song',
];
const MEMBER_ZONE_OPTIONS = [
  'Join AIOS',
  'General Election 2026',
  'Member Benefits',
  'Find an Ophthalmologist',
  'Suggestion/Grievance Corner',
  'Awards',
  'Fellowships',
  'AIOS Minutes',
  'Presidential Committees',
  'AIOS Elections',
  'Affiliated societies',
  'Legal Cell',
  'ONE Network',
  'Family Benefit Scheme',
  'AIOS CME Series',
];
const CLINICAL_EDUCATION_OPTIONS = [
  'Manthan: AIOS JournalScan',
  'AIOS Publications',
  'AIOS EYE 24/7',
  'AIOS Play',
  'AIOS Consent Book',
  'AIOS Guidelines',
  'YouTube Channel',
  'AIOS Times',
  'AIOS Newsletter',
  'AIOS OKAT',
  'YO Center/ Residents',
  'Fellowship Programmes',
  'AIOS Dynamic Ebook',
];
const menuOptions = [
  { label: 'About AIOS', Icon: PersonIcon },
  { label: 'AIOS Conferences', Icon: CertificatesTabIcon },
  { label: 'Member Zone', Icon: ProfileTabIcon },
  { label: 'Clinical Education', Icon: JobsTabIcon },
  { label: 'AIOS Wings', Icon: MidTermTabIcon },
  { label: 'AIOS FAICO', Icon: CertificatesTabIcon },
  { label: 'Public Awareness', Icon: PersonIcon },
];

const PortalDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const dispatch = useAppDispatch();
  const [faicoExpanded, setFaicoExpanded] = useState(false);
  const [wingsExpanded, setWingsExpanded] = useState(false);
  const [clinicalExpanded, setClinicalExpanded] = useState(false);
  const [manthanExpanded, setManthanExpanded] = useState(false);
  const [memberZoneExpanded, setMemberZoneExpanded] = useState(false);
  const [awardsExpanded, setAwardsExpanded] = useState(false);
  const [electionsExpanded, setElectionsExpanded] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [conferencesExpanded, setConferencesExpanded] = useState(false);
  const [annualExpanded, setAnnualExpanded] = useState(false);
  const [midtermExpanded, setMidtermExpanded] = useState(false);
  const [iocExpanded, setIocExpanded] = useState(false);
  const [addressExpanded, setAddressExpanded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const savedProfile = useAppSelector(state => state.auth.profile);
  const profile = savedProfile?.membershipId?.match(/^LM-\d+$/)
    ? { ...savedProfile, membershipId: undefined }
    : savedProfile;
  const insets = useSafeAreaInsets();
  const portal = props.state.routes[props.state.index];
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
            <Text style={styles.brand}>AIOS <Text style={styles.brandAccent}>PORTAL</Text></Text>
            <TouchableOpacity style={styles.close} onPress={() => props.navigation.closeDrawer()} accessibilityRole="button" accessibilityLabel="Close menu">
              <CloseIcon size={18} color="#FFFFFF" />
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
          <Text style={styles.name} numberOfLines={2}>{formatProfileName(name)}</Text>
          {profile?.email ? (
            <Text style={styles.email} numberOfLines={2} selectable>{profile.email}</Text>
          ) : null}
            </View>
            {/* Close button temporarily hidden.
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close navigation menu"
              style={styles.close}
              onPress={() => props.navigation.closeDrawer()}
            >
              <CloseIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
            */}
          </View>
        </View>
        <Text style={styles.sectionLabel}>EXPLORE AIOS</Text>
        <DrawerItem
          label="Home"
          focused={portal.name === 'Home'}
          activeTintColor="#EA580C"
          inactiveTintColor="#334155"
          activeBackgroundColor="#FFF7ED"
          style={styles.item}
          labelStyle={styles.itemLabel}
          icon={({ color }) => <View style={[styles.menuIcon, portal.name === 'Home' && styles.menuIconActive]}><DashboardIcon size={20} color={color} /></View>}
          onPress={() => {
            setSelectedMenu(null);
            props.navigation.navigate('Home');
            props.navigation.closeDrawer();
          }}
        />
        {menuOptions.map(({ label, Icon }) => (
          <View key={label}>
          <DrawerItem
            label={label}
            focused={selectedMenu === label}
            activeTintColor="#EA580C"
            inactiveTintColor="#334155"
            activeBackgroundColor="#FFF7ED"
            style={styles.item}
            labelStyle={styles.itemLabel}
            icon={({ color }) => <View style={[styles.menuIcon, selectedMenu === label && styles.menuIconActive]}><Icon size={20} color={color} /></View>}
            onPress={() => {
              setSelectedMenu(label);
              if (label === 'AIOS FAICO') {
                setFaicoExpanded(value => !value);
              }
              if (label === 'AIOS Wings') {
                setWingsExpanded(value => !value);
              }
              if (label === 'Clinical Education') {
                setClinicalExpanded(value => !value);
              }
              if (label === 'Member Zone') {
                setMemberZoneExpanded(value => !value);
              }
              if (label === 'About AIOS') {
                setAboutExpanded(value => !value);
              }
              if (label === 'AIOS Conferences') {
                setConferencesExpanded(value => !value);
              }
            }}
          />
          {label === 'AIOS FAICO' && faicoExpanded && (
            <View style={styles.aboutSubmenu}>
              {['About FAICO', 'Hony FAICO', 'Fellows of Collegium'].map(option => (
                <View key={option} style={styles.aboutSubmenuItem}>
                  <Text style={styles.aboutSubmenuText}>{option}</Text>
                </View>
              ))}
            </View>
          )}
          {label === 'AIOS Wings' && wingsExpanded && (
            <View style={styles.aboutSubmenu}>
              {[
                'Scientific Committee',
                'Academic & Research Committee',
                'AIOS Proceedings',
                'Indian Journal of Ophthalmology',
              ].map(option => (
                <View key={option} style={styles.aboutSubmenuItem}>
                  <Text style={styles.aboutSubmenuText}>{option}</Text>
                </View>
              ))}
            </View>
          )}
          {label === 'Clinical Education' && clinicalExpanded && (
            <View style={styles.aboutSubmenu}>
              {CLINICAL_EDUCATION_OPTIONS.map(option => option === 'Manthan: AIOS JournalScan' ? (
                <View key={option}>
                  <TouchableOpacity
                    style={[styles.aboutSubmenuItem, manthanExpanded && styles.addressActive]}
                    onPress={() => setManthanExpanded(value => !value)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: manthanExpanded }}
                  >
                    <Text style={[styles.aboutSubmenuText, manthanExpanded && styles.addressActiveText]}>{option}</Text>
                  </TouchableOpacity>
                  {manthanExpanded && (
                    <View style={styles.annualSubmenu}>
                      {['August 2026', 'July 2026', 'October 2026'].map(month => (
                        <View key={month} style={styles.aboutSubmenuItem}>
                          <Text style={styles.aboutSubmenuText}>{month}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <View key={option} style={styles.aboutSubmenuItem}>
                  <Text style={styles.aboutSubmenuText}>{option}</Text>
                </View>
              ))}
            </View>
          )}
          {label === 'Member Zone' && memberZoneExpanded && (
            <View style={styles.aboutSubmenu}>
              {MEMBER_ZONE_OPTIONS.map(option => option === 'Awards' ? (
                <View key={option}>
                  <TouchableOpacity
                    style={[styles.aboutSubmenuItem, awardsExpanded && styles.addressActive]}
                    onPress={() => setAwardsExpanded(value => !value)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: awardsExpanded }}
                  >
                    <Text style={[styles.aboutSubmenuText, awardsExpanded && styles.addressActiveText]}>Awards</Text>
                  </TouchableOpacity>
                  {awardsExpanded && (
                    <View style={styles.annualSubmenu}>
                      <View style={styles.aboutSubmenuItem}>
                        <Text style={styles.aboutSubmenuText}>AIOS Awards</Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : option === 'AIOS Elections' ? (
                <View key={option}>
                  <TouchableOpacity
                    style={[styles.aboutSubmenuItem, electionsExpanded && styles.addressActive]}
                    onPress={() => setElectionsExpanded(value => !value)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: electionsExpanded }}
                  >
                    <Text style={[styles.aboutSubmenuText, electionsExpanded && styles.addressActiveText]}>AIOS Elections</Text>
                  </TouchableOpacity>
                  {electionsExpanded && (
                    <View style={styles.annualSubmenu}>
                      {['2025 VP Election', 'General Election 2023', 'VP Election 2027'].map(election => (
                        <View key={election} style={styles.aboutSubmenuItem}>
                          <Text style={styles.aboutSubmenuText}>{election}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <View key={option} style={styles.aboutSubmenuItem}>
                  <Text style={styles.aboutSubmenuText}>{option}</Text>
                </View>
              ))}
            </View>
          )}
          {label === 'AIOS Conferences' && conferencesExpanded && (
            <View style={styles.aboutSubmenu}>
              <TouchableOpacity
                style={[styles.aboutSubmenuItem, annualExpanded && styles.addressActive]}
                onPress={() => setAnnualExpanded(value => !value)}
                accessibilityRole="button"
                accessibilityState={{ expanded: annualExpanded }}
              >
                <Text style={[styles.aboutSubmenuText, annualExpanded && styles.addressActiveText]}>Annual Conference</Text>
              </TouchableOpacity>
              {annualExpanded && (
                <View style={styles.annualSubmenu}>
                  {['AIOC 2027 Gujarat', 'AIOC 2026 Jaipur', 'APAO AIOS 2025 Delhi', 'AIOC 2024 Kolkata', 'AIOC 2023 Kochi'].map((title, index) => index === 0 ? (
                    <TouchableOpacity
                      key={title}
                      style={styles.aboutSubmenuItem}
                      accessibilityRole="button"
                      onPress={() => {
                        props.navigation.navigate('Portal', { screen: 'Certificates' });
                        props.navigation.closeDrawer();
                      }}
                    >
                      <Text style={styles.aboutSubmenuText}>{title}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View key={title} style={styles.aboutSubmenuItem}>
                      <Text style={styles.aboutSubmenuText}>{title}</Text>
                    </View>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={[styles.aboutSubmenuItem, midtermExpanded && styles.addressActive]}
                onPress={() => setMidtermExpanded(value => !value)}
                accessibilityRole="button"
                accessibilityState={{ expanded: midtermExpanded }}
              >
                <Text style={[styles.aboutSubmenuText, midtermExpanded && styles.addressActiveText]}>Mid-term Conference</Text>
              </TouchableOpacity>
              {midtermExpanded && (
                <View style={styles.annualSubmenu}>
                  {['AIOS Mid-term Ranchi', 'AIOS Mid-term Amritsar', 'AIOS Mid-term Dehradun', 'AIOS Mid-term Vizag', 'AIOS Mid-term Patna'].map((title, index) => index === 0 ? (
                    <TouchableOpacity
                      key={title}
                      style={styles.aboutSubmenuItem}
                      accessibilityRole="button"
                      onPress={() => {
                        props.navigation.navigate('Portal', { screen: 'MidTerm' });
                        props.navigation.closeDrawer();
                      }}
                    >
                      <Text style={styles.aboutSubmenuText}>{title}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View key={title} style={styles.aboutSubmenuItem}>
                      <Text style={styles.aboutSubmenuText}>{title}</Text>
                    </View>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={[styles.aboutSubmenuItem, iocExpanded && styles.addressActive]}
                onPress={() => setIocExpanded(value => !value)}
                accessibilityRole="button"
                accessibilityState={{ expanded: iocExpanded }}
              >
                <Text style={[styles.aboutSubmenuText, iocExpanded && styles.addressActiveText]}>IOC</Text>
              </TouchableOpacity>
              {iocExpanded && (
                <View style={styles.annualSubmenu}>
                  {['AIOS IOC 2026', 'AIOS IOC 2025', 'AIOS IOC 2024', 'AIOS IOC 2023'].map(title => (
                    <View key={title} style={styles.aboutSubmenuItem}>
                      <Text style={styles.aboutSubmenuText}>{title}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          {label === 'About AIOS' && aboutExpanded && (
            <View style={styles.aboutSubmenu}>
              {ABOUT_OPTIONS.map(option => option === 'About Us' || option === 'Governing Council' || option === 'Office Bearers Sub-Committee' || option === 'Office Bearers' || option === 'Past Presidents' || option === 'AIOS Theme Song' ? (
                <TouchableOpacity
                  key={option}
                  style={styles.aboutSubmenuItem}
                  accessibilityRole="button"
                  onPress={() => {
                    props.navigation.navigate(option === 'AIOS Theme Song' ? 'AIOSThemeSong' : option === 'Past Presidents' ? 'PastPresidents' : option === 'Office Bearers' ? 'OfficeBearers' : option === 'Office Bearers Sub-Committee' ? 'OfficeBearersSubCommittee' : option === 'Governing Council' ? 'GoverningCouncil' : 'AboutAIOS');
                    props.navigation.closeDrawer();
                  }}
                >
                  <Text style={styles.aboutSubmenuText}>{option}</Text>
                </TouchableOpacity>
              ) : option === 'Address' ? (
                <View key={option}>
                  <TouchableOpacity
                    style={[styles.aboutSubmenuItem, addressExpanded && styles.addressActive]}
                    onPress={() => setAddressExpanded(value => !value)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: addressExpanded }}
                  >
                    <Text style={[styles.aboutSubmenuText, addressExpanded && styles.addressActiveText]}>Address</Text>
                  </TouchableOpacity>
                  {addressExpanded && (
                    <TouchableOpacity
                      style={styles.addressSubmenu}
                      accessibilityRole="button"
                      onPress={() => {
                        props.navigation.navigate('PresidentAIOS');
                        props.navigation.closeDrawer();
                      }}
                    >
                      <Text style={styles.aboutSubmenuText}>President AIOS</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View key={option} style={styles.aboutSubmenuItem}>
                  <Text style={styles.aboutSubmenuText}>{option}</Text>
                </View>
              ))}
            </View>
          )}
          </View>
        ))}
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
    initialRouteName="Portal"
    drawerContent={props => <PortalDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: 'front',
      drawerStyle: { width: '84%', maxWidth: 340 },
      overlayColor: 'rgba(10, 30, 63, 0.45)',
    }}
  >
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="AboutAIOS" component={AboutAIOSScreen} />
    <Drawer.Screen name="PresidentAIOS" component={PresidentAIOSScreen} />
    <Drawer.Screen name="AIOSThemeSong" component={AIOSThemeSongScreen} />
    <Drawer.Screen name="PastPresidents" component={PastPresidentsScreen} />
    <Drawer.Screen name="OfficeBearers" component={OfficeBearersScreen} />
    <Drawer.Screen name="OfficeBearersSubCommittee" component={OfficeBearersSubCommitteeScreen} />
    <Drawer.Screen name="GoverningCouncil" component={GoverningCouncilScreen} />
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
  annualSubmenu: {
    backgroundColor: '#242F68',
    paddingLeft: 16,
    paddingVertical: 4,
  },
  addressActive: {
    backgroundColor: '#FFCA97',
  },
  addressActiveText: {
    color: '#343F79',
  },
  addressSubmenu: {
    backgroundColor: '#242F68',
    paddingLeft: 36,
    paddingRight: 20,
    paddingVertical: 16,
    minHeight: 48,
  },
  aboutSubmenu: {
    backgroundColor: '#343F79',
    borderRadius: 12,
    marginHorizontal: 2,
    marginBottom: 10,
    paddingVertical: 8,
  },
  aboutSubmenuItem: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  aboutSubmenuText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandAccent: {
    color: '#FDBA74',
    fontSize: 10,
    letterSpacing: 2,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconActive: {
    backgroundColor: '#FFEDD5',
  },
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
  content: { paddingHorizontal: 14 },
  profile: {
    backgroundColor: '#0A1E3F',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 23 },
  email: { color: '#CBD5E1', fontSize: 12, lineHeight: 18, marginTop: 5 },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 16,
    marginBottom: 8,
  },
  item: { borderRadius: 14, marginHorizontal: 0, marginVertical: 3 },
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
