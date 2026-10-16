import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { rounded, shadows } from '../theme/spacing';
import { Typography } from './Typography';
import { CloseIcon, GalleryIcon, PersonIcon, TrashIcon } from './Icons';
import { images } from '../constants/images';

export interface ProfileImagePickerProps {
  imageUri?: string | null;
  onImageSelected: (uri: string, asset?: Asset) => void;
  onImageRemoved?: () => void;
  label?: string;
  helperText?: string;
  error?: string;
  size?: number;
  disabled?: boolean;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  imageUri,
  onImageSelected,
  onImageRemoved,
  label = 'Profile Photo',
  helperText = 'Choose a clear photo from your gallery or camera.',
  error,
  size = 110,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'AIOS needs access to your camera to take a profile picture.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  };

  const handleTakePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to capture your profile photo.',
        );
        return;
      }

      const response = await launchCamera({
        mediaType: 'photo',
        cameraType: 'front',
        quality: 0.8,
        saveToPhotos: false,
      });

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage || 'Unable to open camera.');
        return;
      }

      const asset = response.assets?.[0];
      if (asset?.uri) {
        onImageSelected(asset.uri, asset);
        setModalVisible(false);
      }
    } catch (err: any) {
      console.error('Error opening camera:', err);
      const isNativeMissing =
        err?.message?.includes('null') ||
        err?.message?.includes('launchCamera') ||
        typeof err?.message === 'string' && err.message.toLowerCase().includes('cannot read property');
      if (isNativeMissing) {
        Alert.alert(
          'App Rebuild Required',
          'Camera native module connect nahi hua hai. Nayi library install hone ke baad app ko rebuild karna zaroori hota hai. Please terminal me "npm run android" run karein.',
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred while accessing the camera.');
      }
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Gallery Error', response.errorMessage || 'Unable to open gallery.');
        return;
      }

      const asset = response.assets?.[0];
      if (asset?.uri) {
        onImageSelected(asset.uri, asset);
        setModalVisible(false);
      }
    } catch (err: any) {
      console.error('Error opening gallery:', err);
      const isNativeMissing =
        err?.message?.includes('null') ||
        err?.message?.includes('launchImageLibrary') ||
        typeof err?.message === 'string' && err.message.toLowerCase().includes('cannot read property');
      if (isNativeMissing) {
        Alert.alert(
          'App Rebuild Required',
          'Gallery native module connect nahi hua hai. Nayi library install hone ke baad app ko rebuild karna zaroori hota hai. Please terminal me "npm run android" run karein.',
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred while accessing your gallery.');
      }
    }
  };

  const handleRemovePhoto = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
    setModalVisible(false);
  };

  const badgeSize = Math.max(32, Math.round(size * 0.3));

  return (
    <View style={styles.container}>
      {label ? (
        <Typography
          variant="labelMd"
          weight="bold"
          color={colors.textPrimary}
          style={styles.label}
        >
          {label}
        </Typography>
      ) : null}

      <View style={styles.avatarWrapper}>
        <TouchableOpacity
          onPress={() => !disabled && setModalVisible(true)}
          activeOpacity={0.85}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={imageUri ? 'Change profile photo' : 'Upload profile photo'}
          style={[
            styles.avatarCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            error ? styles.avatarCircleError : null,
          ]}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.avatarImage,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <PersonIcon size={size * 0.44} color={colors.textMuted} />
              <Typography
                variant="caption"
                weight="semibold"
                color={colors.textMuted}
                style={styles.placeholderText}
              >
                Add Photo
              </Typography>
            </View>
          )}

          {/* Action Badge with Camera Icon */}
          <View
            style={[
              styles.actionBadge,
              {
                width: badgeSize,
                height: badgeSize,
                borderRadius: badgeSize / 2,
                bottom: 0,
                right: 0,
              },
            ]}
          >
            <Image
              source={images.cameraIcon}
              style={{
                width: badgeSize * 0.52,
                height: badgeSize * 0.52,
                tintColor: colors.white,
              }}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={0.7}
        disabled={disabled}
        style={styles.actionPromptButton}
      >
        <Typography
          variant="bodySm"
          weight="bold"
          color={colors.secondaryRoyal}
        >
          {imageUri ? 'Change Photo' : 'Upload Profile Picture'}
        </Typography>
      </TouchableOpacity>

      {helperText ? (
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.helperText}
        >
          {helperText}
        </Typography>
      ) : null}

      {error ? (
        <Typography
          variant="labelSm"
          color={colors.error}
          style={styles.errorText}
        >
          {error}
        </Typography>
      ) : null}

      {/* Choice Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaProvider>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.modalSheet}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleBlock}>
                    <Typography
                      variant="headlineSm"
                      weight="bold"
                      color={colors.primaryNavy}
                    >
                      Profile Photo
                    </Typography>
                    <Typography
                      variant="bodySm"
                      color={colors.textMuted}
                      style={styles.modalSubtitle}
                    >
                      Choose an option to set your picture
                    </Typography>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}
                    activeOpacity={0.7}
                  >
                    <CloseIcon size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Options List */}
                <View style={styles.optionsList}>
                  {/* Camera Option */}
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={handleTakePhoto}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.optionIconContainer, styles.cameraIconBg]}>
                      <Image
                        source={images.cameraIcon}
                        style={{
                          width: 22,
                          height: 22,
                          tintColor: colors.secondaryRoyal,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Typography
                        variant="bodyMd"
                        weight="bold"
                        color={colors.textPrimary}
                      >
                        Take Photo
                      </Typography>
                      {/* <Typography
                        variant="caption"
                        color={colors.textMuted}
                      >
                        Use camera to capture a new photo
                      </Typography> */}
                    </View>
                    <Typography
                      variant="bodyLg"
                      color={colors.borderFieldHover}
                      style={styles.optionChevron}
                    >
                      ›
                    </Typography>
                  </TouchableOpacity>

                  {/* Gallery Option */}
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={handleChooseFromGallery}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.optionIconContainer, styles.galleryIconBg]}>
                      <GalleryIcon size={22} color={colors.tertiarySaffron} />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Typography
                        variant="bodyMd"
                        weight="bold"
                        color={colors.textPrimary}
                      >
                        Choose from Gallery
                      </Typography>
                      {/* <Typography
                        variant="caption"
                        color={colors.textMuted}
                      >
                        Select existing photo from device
                      </Typography> */}
                    </View>
                    <Typography
                      variant="bodyLg"
                      color={colors.borderFieldHover}
                      style={styles.optionChevron}
                    >
                      ›
                    </Typography>
                  </TouchableOpacity>

                  {/* Remove Photo Option (if photo exists) */}
                  {imageUri ? (
                    <TouchableOpacity
                      style={[styles.optionItem, styles.removeOptionItem]}
                      onPress={handleRemovePhoto}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.optionIconContainer, styles.trashIconBg]}>
                        <TrashIcon size={20} color={colors.error} />
                      </View>
                      <View style={styles.optionTextContainer}>
                        <Typography
                          variant="bodyMd"
                          weight="bold"
                          color={colors.error}
                        >
                          Remove Photo
                        </Typography>
                        {/* <Typography
                          variant="caption"
                          color={colors.textMuted}
                        >
                          Delete current profile picture
                        </Typography> */}
                      </View>
                      <Typography
                        variant="bodyLg"
                        color={colors.error}
                        style={styles.optionChevron}
                      >
                        ›
                      </Typography>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Typography
                    variant="labelLg"
                    weight="bold"
                    color={colors.textSecondary}
                  >
                    Cancel
                  </Typography>
                </TouchableOpacity>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
        </SafeAreaProvider>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
    width: '100%',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  label: {
    marginBottom: 14,
    alignSelf: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
    ...shadows.level1,
  },
  avatarCircleError: {
    borderColor: colors.error,
  },
  avatarImage: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  placeholderText: {
    fontSize: 11,
    marginTop: 2,
  },
  actionBadge: {
    position: 'absolute',
    backgroundColor: colors.primaryNavy,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.level1,
  },
  actionPromptButton: {
    marginTop: 16,
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 4,
    textAlign: 'center',
  },

  /* Modal Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: rounded.xl,
    borderTopRightRadius: rounded.xl,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 20,
    ...shadows.level2,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
  },
  modalTitleBlock: {
    flex: 1,
  },
  modalSubtitle: {
    marginTop: 2,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionsList: {
    paddingVertical: 10,
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: rounded.default,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  removeOptionItem: {
    borderColor: colors.errorContainer,
    backgroundColor: '#FEF2F2',
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cameraIconBg: {
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
  },
  galleryIconBg: {
    backgroundColor: colors.tertiarySaffronBg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  trashIconBg: {
    backgroundColor: colors.errorContainer,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionChevron: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 4,
  },

  cancelButton: {
    marginTop: 6,
    paddingVertical: 13,
    borderRadius: rounded.default,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
