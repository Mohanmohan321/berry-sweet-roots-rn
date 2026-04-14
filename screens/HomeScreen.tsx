import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

/* ── Assets ──────────────────────────────────────────────────────── */
const logo = require('../assets/logo.png');
const basketImg = require('../assets/strawberries-basket.jpg');
const heroImg = require('../assets/hero-farm.jpg');
const jamImg = require('../assets/strawberry-jam.jpg');
const whatsappIcon = require('../assets/whatsapp-icon.jpg');
const instagramIcon = require('../assets/instagram-icon.jpg');

const TOTAL_CARDS = 4;

/* ── Berry colour palette (same as web) ─────────────────────────── */
const C = {
  red:   '#D93A4C',
  green: '#4A7C59',
  dark:  '#1E1A2E',
  muted: '#6B6868',
  amber: '#C18C5D',
  border:'rgba(217,58,76,0.20)',
  bg:    'rgba(217,58,76,0.06)',
};

/* ── Font helpers (Georgia on iOS = same as web) ────────────────── */
const SERIF  = Platform.OS === 'ios' ? 'Georgia'        : 'serif';
const SANS   = Platform.OS === 'ios' ? 'System'         : 'sans-serif';

/* ── Scroll hint ─────────────────────────────────────────────────── */
const ScrollHint = ({ text, color = 'rgba(100,100,95,0.45)' }: { text?: string; color?: string }) => (
  <View style={[sty.scrollHint, { pointerEvents: 'none' as any }]}>
    {text ? (
      <Text style={{ fontSize: 10, color, letterSpacing: 2, textTransform: 'uppercase', fontFamily: SANS }}>
        {text}
      </Text>
    ) : null}
    <Text style={{ fontSize: 22, color, lineHeight: 22 }}>⌄</Text>
  </View>
);

/* ── Image carousel ──────────────────────────────────────────────── */
const ImageCarousel = ({ containerWidth }: { containerWidth: number }) => {
  const images = [basketImg, heroImg, jamImg];
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const imgW = containerWidth;

  const onSnap = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / imgW);
    setActive(idx);
  };

  const goTo = (i: number) => {
    setActive(i);
    scrollRef.current?.scrollTo({ x: i * imgW, animated: true });
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={onSnap}
        style={{ borderRadius: 16, height: 210 }}
        contentContainerStyle={{ width: imgW * images.length }}
      >
        {images.map((src, i) => (
          <Image
            key={i}
            source={src}
            style={{ width: imgW, height: 210, borderRadius: 16 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {/* Dot indicators */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, gap: 8 }}>
        {images.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => goTo(i)}
            style={{
              width: active === i ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: active === i ? C.red : 'rgba(217,58,76,0.25)',
            }}
          />
        ))}
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { height: SCREEN_H, width: SCREEN_W } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeCard, setActiveCard] = useState(0);
  const isAnimating = useRef(false);

  // Width of content column (mirror web's maxWidth: 480)
  const colW = Math.min(SCREEN_W, 480);
  // Inner padding left/right matches px-6 (24px each side)
  const innerW = colW - 48;

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_CARDS - 1, index));
    if (clamped === activeCard || isAnimating.current) return;
    isAnimating.current = true;
    scrollRef.current?.scrollTo({ y: clamped * SCREEN_H, animated: true });
    setActiveCard(clamped);
    setTimeout(() => { isAnimating.current = false; }, 600);
  }, [activeCard, SCREEN_H]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / SCREEN_H);
    setActiveCard(idx);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      <View style={{ width: colW, flex: 1, position: 'relative' }}>

        <ScrollView
          ref={scrollRef}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          onMomentumScrollEnd={onScrollEnd}
          style={{ flex: 1 }}
        >
          {/* ══ CARD 1 ─ Logo ══════════════════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H, justifyContent: 'center', alignItems: 'center',
            paddingHorizontal: 32, paddingTop: insets.top }]}>
            <Image
              source={logo}
              style={{ width: Math.min(320, colW * 0.82), height: 130 }}
              resizeMode="contain"
            />
            <ScrollHint text="Scroll Down" />
          </View>

          {/* ══ CARD 2 ─ Our Strawberries ══════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H }]}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: insets.top + 56, paddingBottom: 32, overflow: 'hidden' }}>

              {/* Eyebrow */}
              <Text style={{ textAlign: 'center', marginBottom: 4, fontSize: 11,
                color: C.amber, letterSpacing: 3.1, textTransform: 'uppercase',
                fontWeight: '700', fontFamily: SANS }}>
                Our Story
              </Text>

              {/* Heading */}
              <Text style={{ textAlign: 'center', marginBottom: 12, fontSize: 22,
                fontWeight: '700', color: C.dark, fontFamily: SERIF }}>
                Our Strawberries
              </Text>

              {/* Pull quote */}
              <View style={{ marginBottom: 12, paddingVertical: 10, paddingRight: 12,
                paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: C.amber,
                backgroundColor: 'rgba(193,140,93,0.05)', borderRadius: 10,
                borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <Text style={{ fontStyle: 'italic', fontWeight: '600', color: C.dark,
                  lineHeight: 18, fontSize: 12, fontFamily: SERIF }}>
                  In the quiet hills of Kodaikanal, The Berry Patch began with a simple
                  idea — to grow strawberries the right way.
                </Text>
              </View>

              {/* Body */}
              <Text style={{ fontSize: 12, color: C.muted, lineHeight: 20,
                marginBottom: 8, fontFamily: SERIF }}>
                We work with local farmers — no shortcuts, no chemicals. Grown organically
                in Kodaikanal's cool hills, just as nature intended.
              </Text>
              <Text style={{ fontSize: 12, color: C.muted, lineHeight: 20,
                marginBottom: 12, fontFamily: SERIF }}>
                We chose the{' '}
                <Text style={{ color: C.dark, fontWeight: '700' }}>Camarosa variety</Text>
                {' '}— handpicked at peak ripeness and lab-tested by{' '}
                <Text style={{ color: C.green, fontWeight: '700' }}>ICAR-IIHR Bangalore</Text>
                {' '}with zero pesticide residue across 130+ compounds.
              </Text>

              {/* Carousel */}
              <ImageCarousel containerWidth={innerW} />

              {/* Pills */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap',
                justifyContent: 'center', gap: 8, marginTop: 12 }}>
                {[
                  { label: '🌿 Organically Grown', color: C.green, bg: 'rgba(74,124,89,0.08)',  border: 'rgba(74,124,89,0.22)' },
                  { label: '✓ Pesticide-Free',      color: C.red,   bg: C.bg,                    border: C.border               },
                  { label: '🍓 Farm Fresh',          color: C.amber, bg: 'rgba(193,140,93,0.08)', border: 'rgba(193,140,93,0.22)' },
                ].map(({ label, color, bg, border }) => (
                  <View key={label} style={{ backgroundColor: bg, borderRadius: 99,
                    paddingHorizontal: 11, paddingVertical: 4,
                    borderWidth: 1, borderColor: border }}>
                    <Text style={{ fontSize: 11, color, fontWeight: '700', fontFamily: SANS }}>
                      {label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA: Our Process */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Process')}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 8, width: '100%', marginTop: 16, backgroundColor: C.red,
                  borderRadius: 14, paddingVertical: 14,
                  shadowColor: C.red, shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.38, shadowRadius: 10, elevation: 6 }}
                activeOpacity={0.88}
              >
                <Text style={{ color: 'white', fontSize: 13, fontWeight: '700',
                  letterSpacing: 0.6, fontFamily: SANS }}>
                  Our Process
                </Text>
                <Text style={{ color: 'white', fontSize: 15 }}>→</Text>
              </TouchableOpacity>
            </View>
            <ScrollHint />
          </View>

          {/* ══ CARD 3 ─ Strawberry Jam ════════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H, justifyContent: 'center',
            alignItems: 'center', paddingHorizontal: 32 }]}>
            <View style={{ backgroundColor: 'rgba(193,140,93,0.10)', borderRadius: 99,
              paddingHorizontal: 16, paddingVertical: 6,
              borderWidth: 1, borderColor: 'rgba(193,140,93,0.3)', marginBottom: 20 }}>
              <Text style={{ fontSize: 11, color: C.amber, letterSpacing: 3,
                textTransform: 'uppercase', fontWeight: '600', fontFamily: SANS }}>
                Coming Soon
              </Text>
            </View>
            <Text style={{ textAlign: 'center', fontSize: 36, fontWeight: '900',
              color: C.dark, lineHeight: 40, marginBottom: 16, fontFamily: SERIF }}>
              Strawberry{'\n'}Jam
            </Text>
            <Text style={{ textAlign: 'center', maxWidth: 240, fontSize: 13,
              color: C.muted, lineHeight: 22, fontFamily: SERIF }}>
              Small-batch, handmade preserves from our organic harvest.
              No preservatives. Pure fruit.
            </Text>
            <ScrollHint />
          </View>

          {/* ══ CARD 4 ─ Contact ════════════════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H }]}>

            {/* Top header */}
            <View style={{ paddingTop: insets.top + 64, paddingBottom: 20, alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '700',
                color: C.dark, letterSpacing: 3.2, textTransform: 'uppercase',
                fontFamily: SERIF }}>
                Get In Touch
              </Text>
              <Text style={{ textAlign: 'center', marginTop: 4, fontSize: 12,
                color: C.muted, fontFamily: SERIF }}>
                Order fresh strawberries or just say hello.
              </Text>
            </View>

            {/* Social buttons */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',
              paddingHorizontal: 24 }}>
              <View style={{ gap: 12, width: '100%', maxWidth: 320 }}>
                {([
                  { href: 'https://wa.me/',         icon: whatsappIcon,  label: 'WhatsApp',  sub: 'Chat to order',    shadowColor: 'rgba(37,211,102,0.22)'  },
                  { href: 'https://instagram.com/', icon: instagramIcon, label: 'Instagram', sub: 'Follow our farm',  shadowColor: 'rgba(193,50,50,0.18)'   },
                ] as const).map(({ href, icon, label, sub, shadowColor }) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => Linking.openURL(href)}
                    activeOpacity={0.88}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 16,
                      padding: 14, backgroundColor: 'white',
                      borderWidth: 1, borderColor: 'rgba(220,215,208,0.8)',
                      borderRadius: 20,
                      shadowColor, shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.22, shadowRadius: 8, elevation: 3 }}
                  >
                    <Image source={icon}
                      style={{ width: 48, height: 48, borderRadius: 24 }}
                      resizeMode="cover" />
                    <View>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: C.dark,
                        fontFamily: SERIF }}>{label}</Text>
                      <Text style={{ fontSize: 11, color: C.muted, fontFamily: SANS }}>{sub}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bottom logo + copyright */}
            <View style={{ alignItems: 'center', paddingBottom: insets.bottom + 40 }}>
              <Image source={logo} style={{ width: 140, height: 60 }} resizeMode="contain" />
              <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 10,
                color: C.muted, opacity: 0.45, letterSpacing: 4.8,
                textTransform: 'uppercase', fontFamily: SANS }}>
                © The Berry Patch • Kodaikanal
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ── Dot indicators ── */}
        <DotNav
          total={TOTAL_CARDS}
          active={activeCard}
          color={C.red}
          inactiveColor="rgba(217,58,76,0.25)"
          onPress={goTo}
          screenH={SCREEN_H}
        />
      </View>
    </View>
  );
}

/* ── Dot Navigation ──────────────────────────────────────────────── */
const DotNav = ({
  total, active, color, inactiveColor, onPress, screenH,
}: {
  total: number; active: number; color: string; inactiveColor: string;
  onPress: (i: number) => void; screenH: number;
}) => {
  // Each dot: 10px or 26px height + 10px gap. Total ≈ (total * 10) + ((total-1) * 10) + 16 extra
  const dotTotalH = total * 10 + (total - 1) * 10;
  const topOffset = (screenH - dotTotalH) / 2;

  return (
    <View style={{
      position: 'absolute', right: 12, top: topOffset,
      gap: 10, zIndex: 9999,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onPress(i)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            width: 10,
            height: active === i ? 26 : 10,
            borderRadius: 5,
            backgroundColor: active === i ? color : inactiveColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.12,
            shadowRadius: 2,
            elevation: 1,
          }}
        />
      ))}
    </View>
  );
};

const sty = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  scrollHint: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 2,
  },
});
