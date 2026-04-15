import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';

interface Props {
  imageSource: ImageSourcePropType;
  title: string;
  description: string;
  imagePosition?: 'left' | 'right';
}

const BREAKPOINT = 768;

export default function ResponsiveImageText({
  imageSource,
  title,
  description,
  imagePosition = 'left',
}: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;

  const isReversed = isWide && imagePosition === 'right';

  return (
    <View
      style={[
        styles.container,
        isWide ? styles.rowLayout : styles.columnLayout,
        isReversed && styles.rowReversed,
      ]}
    >
      {/* Image */}
      <View style={[styles.imageWrapper, isWide ? styles.imageWide : styles.imageMobile]}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      </View>

      {/* Text */}
      <View style={[styles.textWrapper, isWide ? styles.textWide : styles.textMobile]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },

  // Layout modes
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  rowReversed: {
    flexDirection: 'row-reverse',
  },
  columnLayout: {
    flexDirection: 'column',
    gap: 16,
  },

  // Image sizing
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageWide: {
    flex: 1,
    aspectRatio: 4 / 3,
  },
  imageMobile: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Text sizing
  textWrapper: {
    justifyContent: 'center',
  },
  textWide: {
    flex: 1,
  },
  textMobile: {
    width: '100%',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
});
