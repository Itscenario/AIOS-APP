import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBarStyle,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import { ScreenStatusBar } from './ScreenStatusBar';

export const DEFAULT_GRADIENT_COLORS = ['#3b1165', '#3b1165', '#3b1165'];

export interface BackgroundProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  safeArea?: boolean;
  edges?: Edge[];
  statusBarStyle?: StatusBarStyle;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

export const Background = React.forwardRef<
  React.ElementRef<typeof ScrollView>,
  BackgroundProps
>(
  (
    {
      children,
      backgroundColor,
      gradientColors = DEFAULT_GRADIENT_COLORS,
      gradientStart = { x: 0, y: 0 },
      gradientEnd = { x: 0, y: 1 },
      safeArea = true,
      edges = ['top', 'bottom', 'left', 'right'],
      statusBarStyle = 'light-content',
      scrollable = false,
      keyboardAvoiding = true,
      keyboardVerticalOffset = 0,
      style,
      contentContainerStyle,
      keyboardShouldPersistTaps = 'handled',
    },
    ref,
  ) => {
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

    useEffect(() => {
      const showEvent =
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent =
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const showSub = Keyboard.addListener(showEvent, e => {
        setKeyboardHeight(e?.endCoordinates?.height ?? 280);
      });
      const hideSub = Keyboard.addListener(hideEvent, () => {
        setKeyboardHeight(0);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    const hasGradient = Boolean(gradientColors && gradientColors.length > 0);
    const containerStyle: ViewStyle = {
      flex: 1,
      backgroundColor:
        backgroundColor ?? (hasGradient ? undefined : colors.background),
    };

    const userContentStyle = StyleSheet.flatten(contentContainerStyle) || {};
    const basePadding =
      typeof userContentStyle.paddingBottom === 'number'
        ? userContentStyle.paddingBottom
        : 8;

    const dynamicBottomPadding =
      keyboardHeight > 0 ? keyboardHeight + 8 : basePadding;

    const renderContent = () => {
      if (scrollable) {
        return (
          <ScrollView
            ref={ref}
            style={[styles.scroll, style]}
            contentContainerStyle={[
              styles.scrollContent,
              contentContainerStyle,
              { paddingBottom: dynamicBottomPadding },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            scrollEventThrottle={16}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={styles.scrollBody}>{children}</View>
            </TouchableWithoutFeedback>
          </ScrollView>
        );
      }

      return <View style={[styles.content, style]}>{children}</View>;
    };

    const wrappedWithKeyboard =
      keyboardAvoiding && !scrollable ? (
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {renderContent()}
        </KeyboardAvoidingView>
      ) : (
        renderContent()
      );

    return (
      <View style={containerStyle}>
        <ScreenStatusBar barStyle={statusBarStyle} />
        {hasGradient && gradientColors ? (
          <LinearGradient
            colors={gradientColors}
            start={gradientStart}
            end={gradientEnd}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        {safeArea ? (
          <SafeAreaView edges={edges} style={styles.safeArea}>
            {wrappedWithKeyboard}
          </SafeAreaView>
        ) : (
          wrappedWithKeyboard
        )}
      </View>
    );
  },
);

Background.displayName = 'Background';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollBody: {
    flexGrow: 1,
  },
});

export default Background;
