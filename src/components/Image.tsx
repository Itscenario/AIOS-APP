import React from 'react';
import {
  Image as RNImage,
  ImageProps as RNImageProps,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';

export interface ImageProps extends RNImageProps {
  source: ImageSourcePropType;
  resizeMode?: ImageResizeMode;
  rounded?: boolean;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
}

export const Image: React.FC<ImageProps> = ({
  source,
  resizeMode = 'cover',
  rounded = false,
  borderRadius,
  style,
  ...rest
}) => {
  const shapeStyle: ImageStyle = {
    ...(rounded ? { borderRadius: 9999 } : {}),
    ...(borderRadius !== undefined ? { borderRadius } : {}),
  };

  return (
    <RNImage
      source={source}
      resizeMode={resizeMode}
      style={[styles.default, shapeStyle, style]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  default: {
    // Default base style
  },
});

export default Image;
