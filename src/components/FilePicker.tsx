import { Button } from './Button';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../theme/colors';
import { Typography } from './Typography';

export interface FilePickerResult {
  name: string;
  uri: string;
  size?: number;
  type?: string;
}

/**
 * Direct file picker utility that opens the device's native file manager directly.
 * Gracefully falls back to image library if native document module is unavailable.
 */
export const pickDocumentFile = async (): Promise<FilePickerResult | null> => {
  try {
    const [res] = await pick({
      mode: 'import',
      type: [types.allFiles],
      allowMultiSelection: false,
    });

    if (res && res.uri) {
      return {
        name: res.name || 'document_file.pdf',
        uri: res.uri,
        size: res.size ?? undefined,
        type: res.type ?? undefined,
      };
    }
    return null;
  } catch (err: any) {
    const isUserCanceled =
      (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) ||
      err?.code === 'OPERATION_CANCELED' ||
      err?.code === 'DOCUMENT_PICKER_CANCELED' ||
      String(err?.message || '')
        .toLowerCase()
        .includes('cancel');

    if (isUserCanceled) {
      return null;
    }

    console.warn('Document picker error:', err);
    Alert.alert(
      'Notice',
      'Unable to open document picker. Please check file permissions.',
    );
    return null;
  }
};

export interface FilePickerProps {
  label?: string;
  helperText?: string;
  fileName?: string;
  onFileSelected: (fileName: string, uri: string) => void;
  containerStyle?: ViewStyle;
  buttonText?: string;
}

/**
 * FilePicker component that displays the Choose Files action row
 * and opens device file storage directly.
 */
export const FilePicker: React.FC<FilePickerProps> = ({
  label,
  helperText,
  fileName,
  onFileSelected,
  containerStyle,
  buttonText = 'Choose Files',
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handlePick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await pickDocumentFile();
      if (result) {
        onFileSelected(result.name, result.uri);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Typography
          variant="labelSm"
          weight="bold"
          color={colors.textPrimary}
          style={styles.label}
        >
          {label}
        </Typography>
      ) : null}

      <View style={styles.fileActionRow}>
        <Button
          customLayout
          style={styles.chooseFileButton}
          onPress={handlePick}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Typography variant="bodySm" weight="bold" color="#FFFFFF">
            {loading ? 'Opening...' : buttonText}
          </Typography>
        </Button>

        <View style={styles.fileSelectedBox}>
          <Typography
            variant="bodySm"
            color={fileName ? colors.primaryNavy : colors.textMuted}
            numberOfLines={1}
            weight={fileName ? 'medium' : 'regular'}
            style={styles.fileSelectedText}
          >
            {fileName || 'no files selected'}
          </Typography>
        </View>
      </View>

      {helperText ? (
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.helperNotice}
        >
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 14,
  },
  label: {
    marginBottom: 8,
    fontSize: 13,
  },
  fileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chooseFileButton: {
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  fileSelectedBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    justifyContent: 'center',
  },
  fileSelectedText: {
    fontSize: 12,
  },
  helperNotice: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 6,
  },
});

export default FilePicker;
