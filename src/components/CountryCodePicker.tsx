import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Country } from 'country-state-city';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import { Typography } from './Typography';
import { CheckIcon } from './Icons';

export interface CountryItem {
  name: string;
  isoCode: string;
  flag: string;
  phonecode: string;
}

export const DEFAULT_COUNTRY: CountryItem = {
  name: 'India',
  isoCode: 'IN',
  flag: '🇮🇳',
  phonecode: '91',
};

export interface CountryCodePickerProps {
  selectedCountry?: CountryItem;
  defaultCountryCode?: string; // e.g. 'IN'
  onSelectCountry?: (country: CountryItem) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  showFlag?: boolean;
  showCode?: boolean;
  showArrow?: boolean;
}

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  selectedCountry,
  defaultCountryCode = 'IN',
  onSelectCountry,
  disabled = false,
  style,
  showFlag = true,
  showCode = true,
  showArrow = true,
}) => {
  // All countries from npm country-state-city
  const allCountries = useMemo<CountryItem[]>(() => {
    const rawCountries = Country.getAllCountries();
    const formatted: CountryItem[] = rawCountries
      .filter(c => Boolean(c.phonecode))
      .map(c => ({
        name: c.name,
        isoCode: c.isoCode,
        flag: c.flag || '🏳️',
        phonecode: c.phonecode.replace(/^\+/, ''),
      }));

    // Prioritize India at the top
    const india = formatted.find(c => c.isoCode.toUpperCase() === 'IN');
    const others = formatted.filter(c => c.isoCode.toUpperCase() !== 'IN');
    return india ? [india, ...others] : formatted;
  }, []);

  // Internal selection state if not controlled externally
  const [internalCountry, setInternalCountry] = useState<CountryItem>(() => {
    if (selectedCountry) return selectedCountry;
    const initial = allCountries.find(
      c => c.isoCode.toUpperCase() === defaultCountryCode.toUpperCase(),
    );
    return initial || DEFAULT_COUNTRY;
  });

  const activeCountry = selectedCountry || internalCountry;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return allCountries;
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/^\+/, '');
    return allCountries.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.isoCode.toLowerCase().includes(q) ||
        c.phonecode.includes(cleanQ),
    );
  }, [allCountries, searchQuery]);

  const handleSelect = (item: CountryItem) => {
    setInternalCountry(item);
    onSelectCountry?.(item);
    setModalVisible(false);
    setSearchQuery('');
  };

  const formattedDialCode = `+${activeCountry.phonecode}`;

  return (
    <>
      <TouchableOpacity
        style={[styles.badgeContainer, style]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        {showFlag ? (
          <Typography variant="bodyLg" style={styles.flagEmoji}>
            {activeCountry.flag}
          </Typography>
        ) : null}

        {showCode ? (
          <Typography
            variant="labelMd"
            weight="bold"
            color={colors.primaryNavy}
            style={styles.codeText}
          >
            {formattedDialCode}
          </Typography>
        ) : null}

        {showArrow ? (
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.arrowIcon}
          >
            ▼
          </Typography>
        ) : null}
      </TouchableOpacity>

      {/* Country Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Typography
                variant="headlineSm"
                weight="bold"
                color={colors.primaryNavy}
              >
                Select Country Code
              </Typography>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Typography variant="headlineSm" color={colors.textMuted}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>

            {/* Search Box */}
            <View style={styles.searchBox}>
              <Typography variant="bodyMd" style={styles.searchIcon}>
                🔍
              </Typography>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country or code (e.g. 91, India)..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>

            {/* Countries List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={item => `${item.isoCode}-${item.phonecode}`}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              maxToRenderPerBatch={25}
              renderItem={({ item }) => {
                const isSelected = item.isoCode === activeCountry.isoCode;
                return (
                  <TouchableOpacity
                    style={[
                      styles.countryRow,
                      isSelected && styles.countryRowSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Typography variant="headlineSm" style={styles.rowFlag}>
                      {item.flag}
                    </Typography>
                    <View style={styles.countryInfo}>
                      <Typography
                        variant="bodyMd"
                        weight={isSelected ? 'bold' : 'medium'}
                        color={
                          isSelected
                            ? colors.secondaryRoyal
                            : colors.textPrimary
                        }
                        numberOfLines={1}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="labelSm" color={colors.textMuted}>
                        {item.isoCode}
                      </Typography>
                    </View>
                    <View style={styles.phoneCodeBadge}>
                      <Typography
                        variant="labelMd"
                        weight="bold"
                        color={colors.primaryNavy}
                      >
                        +{item.phonecode}
                      </Typography>
                    </View>
                    {isSelected ? (
                      <View style={styles.selectedCheck}>
                        <CheckIcon size={12} color={colors.white} />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Typography
                    variant="bodyMd"
                    color={colors.textMuted}
                    align="center"
                  >
                    No country found for "{searchQuery}"
                  </Typography>
                </View>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  codeText: {
    fontSize: 14,
    marginRight: 4,
  },
  arrowIcon: {
    fontSize: 8,
    marginLeft: 2,
    color: colors.textMuted,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.gutterMobile + 4,
  },
  modalContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.lg,
    maxHeight: '80%',
    padding: spacing.spaceMd,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.spaceSm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
    marginBottom: spacing.spaceSm,
  },
  closeButton: {
    padding: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderField,
    borderRadius: rounded.default,
    backgroundColor: colors.surfaceBase,
    paddingHorizontal: 12,
    marginBottom: spacing.spaceSm,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: rounded.default,
  },
  countryRowSelected: {
    backgroundColor: colors.surfaceContainerLow,
  },
  rowFlag: {
    fontSize: 22,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
    marginRight: 10,
  },
  phoneCodeBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
  },
  selectedCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondaryRoyal,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.surfaceContainer,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});

export default CountryCodePicker;
