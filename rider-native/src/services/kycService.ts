import { StorageService } from './storageService';

export interface KycRecord {
  docType: 'Aadhaar' | 'Driving License' | 'Voter ID' | 'Passport';
  docNumber: string;
  frontImageUri?: string;
  backImageUri?: string;
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
  ocrExtracted: {
    fullName: string;
    dob: string;
    docNumber: string;
    expiryDate?: string;
  };
}

const STORAGE_KEY = '@evegah_kyc_record';

export const KycService = {
  async getKycRecord(): Promise<KycRecord> {
    const saved = await StorageService.getItem<KycRecord>(STORAGE_KEY);
    if (saved) return saved;

    const defaultRecord: KycRecord = {
      docType: 'Driving License',
      docNumber: 'GJ06 20210049281',
      frontImageUri: 'assets/kyc_banner.png',
      backImageUri: 'assets/kyc_banner1.png',
      status: 'verified',
      submittedAt: '2026-02-10T10:00:00Z',
      verifiedAt: '2026-02-10T10:05:00Z',
      ocrExtracted: {
        fullName: 'Himanshu Patel',
        dob: '15/08/1998',
        docNumber: 'GJ06 20210049281',
        expiryDate: '14/08/2038',
      },
    };
    await StorageService.setItem(STORAGE_KEY, defaultRecord);
    return defaultRecord;
  },

  async submitKyc(docType: KycRecord['docType'], docNumber: string, frontUri?: string, backUri?: string): Promise<KycRecord> {
    const record: KycRecord = {
      docType,
      docNumber,
      frontImageUri: frontUri || 'assets/kyc_banner.png',
      backImageUri: backUri || 'assets/kyc_banner1.png',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ocrExtracted: {
        fullName: 'Himanshu Patel',
        dob: '15/08/1998',
        docNumber,
        expiryDate: '2035-12-31',
      },
    };

    await StorageService.setItem(STORAGE_KEY, record);

    // Auto verify in demo after 3 seconds
    setTimeout(async () => {
      record.status = 'verified';
      record.verifiedAt = new Date().toISOString();
      await StorageService.setItem(STORAGE_KEY, record);
    }, 3000);

    return record;
  },
};
