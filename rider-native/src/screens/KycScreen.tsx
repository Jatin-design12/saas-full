import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { KycService, KycRecord } from '../services/kycService';
import { Icons } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { BorderRadius, Spacing } from '../constants/theme';

interface KycScreenProps {
  onBack?: () => void;
}

export const KycScreen: React.FC<KycScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { updateProfile } = useAuth();

  const [kycRecord, setKycRecord] = useState<KycRecord | null>(null);
  const [docType, setDocType] = useState<KycRecord['docType']>('Driving License');
  const [docNumber, setDocNumber] = useState('');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    KycService.getKycRecord().then((rec) => {
      setKycRecord(rec);
      setDocType(rec.docType);
      setDocNumber(rec.docNumber);
      setFrontUploaded(true);
      setBackUploaded(true);
    });
  }, []);

  const handleSubmit = async () => {
    if (!docNumber.trim() || !frontUploaded) {
      Alert.alert('Missing Documents', 'Please enter your document ID and upload front side.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await KycService.submitKyc(docType, docNumber);
      setKycRecord(res);
      await updateProfile({ kycStatus: 'verified' });
      Alert.alert('Verification Submitted', 'Instant OCR verification completed. Your profile is verified!');
    } finally {
      setSubmitting(false);
    }
  };

  const isVerified = kycRecord?.status === 'verified';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
        {onBack && (
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
            <Icons.ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>KYC Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verification Status Banner */}
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: isVerified ? '#DCFCE7' : '#FEF3C7',
              borderColor: isVerified ? '#15803D' : '#D97706',
            },
          ]}
        >
          <View style={styles.statusLeft}>
            <Icons.Shield size={24} color={isVerified ? '#15803D' : '#D97706'} />
            <View>
              <Text style={[styles.statusTitle, { color: isVerified ? '#15803D' : '#92400E' }]}>
                {isVerified ? 'Government ID Verified ✓' : 'Verification Incomplete'}
              </Text>
              <Text style={[styles.statusSub, { color: isVerified ? '#166534' : '#B45309' }]}>
                {isVerified
                  ? 'Eligible for all Evegah EV models & high-speed passes'
                  : 'Please submit your Driving License or Aadhaar'}
              </Text>
            </View>
          </View>
        </View>

        {/* Document Type Selector */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Document Type</Text>
        <View style={styles.docTypeRow}>
          {(['Driving License', 'Aadhaar', 'Voter ID', 'Passport'] as const).map((type) => {
            const isSelected = docType === type;
            return (
              <TouchableOpacity
                key={type}
                activeOpacity={0.8}
                onPress={() => setDocType(type)}
                style={[
                  styles.docTypeChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.docTypeText,
                    { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Document Number Input */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.lg }]}>
          {docType} Number
        </Text>
        <TextInput
          placeholder={`Enter your ${docType} ID`}
          placeholderTextColor={colors.textMuted}
          value={docNumber}
          onChangeText={setDocNumber}
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.cardBorder,
              backgroundColor: colors.surface,
            },
          ]}
        />

        {/* Upload Thumbnails (Front & Back) */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.lg }]}>
          Document Photos
        </Text>
        <View style={styles.uploadRow}>
          {/* Front Photo */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setFrontUploaded(!frontUploaded)}
            style={[
              styles.uploadBox,
              {
                borderColor: frontUploaded ? colors.primary : colors.cardBorder,
                backgroundColor: frontUploaded ? colors.surfaceSubtle : colors.card,
              },
            ]}
          >
            <Icons.Shield size={28} color={frontUploaded ? colors.primary : colors.textMuted} />
            <Text style={[styles.uploadTitle, { color: colors.text }]}>
              {frontUploaded ? 'Front Side Uploaded ✓' : 'Front Side Photo'}
            </Text>
            <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>
              {frontUploaded ? 'OCR Parsed' : 'Tap to capture / upload'}
            </Text>
          </TouchableOpacity>

          {/* Back Photo */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setBackUploaded(!backUploaded)}
            style={[
              styles.uploadBox,
              {
                borderColor: backUploaded ? colors.primary : colors.cardBorder,
                backgroundColor: backUploaded ? colors.surfaceSubtle : colors.card,
              },
            ]}
          >
            <Icons.Shield size={28} color={backUploaded ? colors.primary : colors.textMuted} />
            <Text style={[styles.uploadTitle, { color: colors.text }]}>
              {backUploaded ? 'Back Side Uploaded ✓' : 'Back Side Photo'}
            </Text>
            <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>
              {backUploaded ? 'OCR Parsed' : 'Tap to capture / upload'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* OCR Extracted Data Preview */}
        {kycRecord?.ocrExtracted && (
          <View style={[styles.ocrBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
            <View style={styles.ocrHeader}>
              <Icons.Zap size={16} color={colors.primary} />
              <Text style={[styles.ocrTitle, { color: colors.text }]}>Instant AI OCR Extracted Data</Text>
            </View>

            <View style={styles.ocrDataRow}>
              <Text style={[styles.ocrKey, { color: colors.textSecondary }]}>Full Name</Text>
              <Text style={[styles.ocrVal, { color: colors.text }]}>{kycRecord.ocrExtracted.fullName}</Text>
            </View>
            <View style={styles.ocrDataRow}>
              <Text style={[styles.ocrKey, { color: colors.textSecondary }]}>Date of Birth</Text>
              <Text style={[styles.ocrVal, { color: colors.text }]}>{kycRecord.ocrExtracted.dob}</Text>
            </View>
            <View style={styles.ocrDataRow}>
              <Text style={[styles.ocrKey, { color: colors.textSecondary }]}>ID Number</Text>
              <Text style={[styles.ocrVal, { color: colors.text }]}>{kycRecord.ocrExtracted.docNumber}</Text>
            </View>
            <View style={styles.ocrDataRow}>
              <Text style={[styles.ocrKey, { color: colors.textSecondary }]}>Validity</Text>
              <Text style={[styles.ocrVal, { color: colors.text }]}>{kycRecord.ocrExtracted.expiryDate || 'Active'}</Text>
            </View>
          </View>
        )}

        {/* Submit Button */}
        <Button
          title={isVerified ? 'Update Document Details' : 'Verify & Submit KYC'}
          variant="primary"
          size="lg"
          loading={submitting}
          onPress={handleSubmit}
          style={{ marginTop: Spacing.xl }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 54,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 90,
  },
  statusBanner: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  statusSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    maxWidth: 260,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  docTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  docTypeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  docTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: 14,
    fontWeight: '600',
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBox: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  uploadTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  uploadSub: {
    fontSize: 10,
    fontWeight: '500',
  },
  ocrBox: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginTop: Spacing.lg,
    gap: 8,
  },
  ocrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ocrTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  ocrDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  ocrKey: {
    fontSize: 12,
    fontWeight: '500',
  },
  ocrVal: {
    fontSize: 12,
    fontWeight: '700',
  },
});
