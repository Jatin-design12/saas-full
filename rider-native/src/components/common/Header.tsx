import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Icons } from './Icons';
import { BorderRadius, Spacing } from '../../constants/theme';

interface HeaderProps {
  onOpenDrawer?: () => void;
  onOpenNotifications?: () => void;
  onSelectZone?: () => void;
  selectedZoneName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  onOpenNotifications,
  onSelectZone,
  selectedZoneName = 'Gotri Central Zone',
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'EV';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
      {/* User Avatar / Drawer button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onOpenDrawer}
        style={[styles.avatarButton, { borderColor: colors.primary, backgroundColor: colors.surfaceSubtle }]}
      >
        {user?.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(user?.name)}</Text>
        )}
      </TouchableOpacity>

      {/* Zone Selector Pill */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSelectZone}
        style={[styles.zonePill, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
      >
        <Icons.MapPin size={16} color={colors.primary} />
        <Text style={[styles.zoneText, { color: colors.text }]} numberOfLines={1}>
          {selectedZoneName}
        </Text>
        <Icons.ChevronRight size={14} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Action Icons */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleTheme}
          style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
        >
          <Icons.Settings size={18} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenNotifications}
          style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
        >
          <Icons.Bell size={18} color={colors.text} />
          <View style={[styles.notificationDot, { backgroundColor: colors.neon }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  zonePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  zoneText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 6,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
});
