import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;

export interface PromoBanner {
  id: string;
  title: string;
  tagline: string;
  code: string;
  discount: string;
  bgGradient: [string, string];
  btnText: string;
}

const BANNERS: PromoBanner[] = [
  {
    id: 'b1',
    title: 'Ride More, Spend Less',
    tagline: 'Flat 50% Cashback on First 5 Rides with Evegah City',
    code: 'EVEGAH50',
    discount: '50% OFF',
    bgGradient: ['#042A14', '#095D2D'],
    btnText: 'Claim Pass',
  },
  {
    id: 'b2',
    title: 'Zero Emission Festival',
    tagline: 'Eco-Rider Special: ₹100 Free Wallet Bonus on Recharge',
    code: 'GREENRIDER',
    discount: '₹100 BONUS',
    bgGradient: ['#1E1B4B', '#4338CA'],
    btnText: 'Top Up Now',
  },
  {
    id: 'b3',
    title: 'Weekend Explorer Pass',
    tagline: 'Unlimited rides across Vadodara & Delhi zones for 24 hrs',
    code: 'WEEKENDPASS',
    discount: 'PASS ₹199',
    bgGradient: ['#064E3B', '#047857'],
    btnText: 'Activate',
  },
];

interface BannerCarouselProps {
  onSelectBanner?: (banner: PromoBanner) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onSelectBanner }) => {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % BANNERS.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * CARD_WIDTH, animated: true });
    }, 4500);

    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setActiveIndex(index);
        }}
        contentContainerStyle={styles.scrollContent}
      >
        {BANNERS.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            activeOpacity={0.9}
            onPress={() => onSelectBanner?.(banner)}
            style={[styles.bannerCard, { backgroundColor: banner.bgGradient[0] }]}
          >
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>{banner.discount}</Text>
            </View>

            <View style={styles.textContent}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerTagline} numberOfLines={2}>
                {banner.tagline}
              </Text>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>PROMO: </Text>
                <Text style={styles.codeText}>{banner.code}</Text>
              </View>

              <View style={[styles.actionBtn, { backgroundColor: colors.neon }]}>
                <Text style={styles.actionBtnText}>{banner.btnText}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsRow}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === activeIndex ? colors.primary : colors.divider,
                width: i === activeIndex ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  bannerCard: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    minHeight: 145,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  bannerBadgeText: {
    color: '#D7FF00',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textContent: {
    marginVertical: 8,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  bannerTagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 4,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  codeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  actionBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
