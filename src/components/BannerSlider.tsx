import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { images } from '../constants/images';

const BANNERS = Array.from({ length: 7 }, (_, index) => ({
  id: `banner${index + 1}`,
  source: images[`banner${index + 1}`],
}));

export const BannerSlider: React.FC = () => {
  const focused = useIsFocused();
  const slider = useRef<FlatList<(typeof BANNERS)[number]>>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);
  const dragging = useRef(false);
  const goToSlide = (index: number) => {
    slider.current?.scrollToOffset({ offset: index * width, animated: true });
    setActive(index);
  };
  useEffect(() => {
    if (!focused || !width) return;
    const timer = setInterval(() => {
      if (dragging.current) return;
      setActive(current => {
        const next = (current + 1) % BANNERS.length;
        slider.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [focused, width]);
  return (
    <View>
        <View style={styles.carousel} onLayout={({ nativeEvent }) => {
          const nextWidth = Math.max(0, nativeEvent.layout.width - 2);
          setWidth(nextWidth);
          slider.current?.scrollToOffset({ offset: active * nextWidth, animated: false });
        }}>
          {width > 0 && <FlatList
            ref={slider}
            style={{ height: width * 337 / 846 }}
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            extraData={width}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            onScrollBeginDrag={() => { dragging.current = true; }}
            onScrollEndDrag={() => { dragging.current = false; }}
            onMomentumScrollEnd={({ nativeEvent }) => setActive(Math.round(nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => <View style={{ width, height: width * 337 / 846 }}><Image source={item.source} style={[styles.banner, { width, height: width * 337 / 846 }]} resizeMode="contain" accessibilityLabel={item.id} /></View>}
          />}
        </View>
        <View style={styles.pagination}>
          {BANNERS.map((banner, index) => <TouchableOpacity key={banner.id} style={styles.dotButton} onPress={() => goToSlide(index)} accessibilityRole="button" accessibilityLabel={`Show banner ${index + 1}`} accessibilityState={{ selected: active === index }}><View style={[styles.dot, active === index && styles.dotActive]} /></TouchableOpacity>)}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    width: '100%',
    aspectRatio: 846 / 337,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  banner: {
    aspectRatio: 846 / 337,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dotButton: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FB923C',
  },
  dotActive: {
    backgroundColor: '#FB923C',
  },
});
