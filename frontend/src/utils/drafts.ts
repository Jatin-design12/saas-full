/**
 * Utility functions for Registration Drafts (24-Hour Expiration)
 */

export interface RegistrationDraft {
  id: number;
  draft_id: string;
  rider_name: string;
  mobile: string;
  current_step: number;
  step_name: string;
  form_data: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  minutes_remaining?: number;
  hours_remaining?: number;
}

const getApiBase = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

/**
 * Save or update registration draft with 24-hour expiration
 */
export async function saveDraft(stepNumber: number, stepName: string, extraData?: any): Promise<{ success: boolean; draft?: RegistrationDraft; message?: string }> {
  try {
    if (typeof window === 'undefined') return { success: false, message: 'Window not defined' };

    const kyc = JSON.parse(localStorage.getItem('evegah_new_ride_kyc') || '{}');
    const rental = JSON.parse(localStorage.getItem('evegah_new_ride_rental') || '{}');
    const payment = JSON.parse(localStorage.getItem('evegah_new_ride_payment') || '{}');
    const activeDraftId = localStorage.getItem('evegah_active_draft_id') || undefined;

    const payload = {
      draft_id: activeDraftId,
      rider_name: (extraData && extraData.fullName) || kyc.fullName || 'Draft Rider',
      mobile: (extraData && extraData.mobile) || kyc.mobile || '',
      current_step: stepNumber,
      step_name: stepName,
      form_data: {
        kyc: { ...kyc, ...(extraData?.kyc || {}) },
        rental: { ...rental, ...(extraData?.rental || {}) },
        payment: { ...payment, ...(extraData?.payment || {}) },
        ...(extraData || {})
      }
    };

    const res = await fetch(`${getApiBase()}/drafts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.status === 'success' && data.draft) {
      localStorage.setItem('evegah_active_draft_id', data.draft.draft_id);
      return { success: true, draft: data.draft, message: data.message };
    }
    return { success: false, message: data.message || 'Failed to save draft' };
  } catch (err: any) {
    console.error('saveDraft error:', err);
    return { success: false, message: err.message || 'Network error saving draft' };
  }
}

/**
 * Load draft by ID and populate localStorage
 */
export async function loadDraft(draftId: string): Promise<RegistrationDraft | null> {
  try {
    if (!draftId) return null;
    const res = await fetch(`${getApiBase()}/drafts/${draftId}`);
    const data = await res.json();
    if (res.ok && data.status === 'success' && data.draft) {
      const d: RegistrationDraft = data.draft;
      if (typeof window !== 'undefined') {
        localStorage.setItem('evegah_active_draft_id', d.draft_id);
        if (d.form_data) {
          if (d.form_data.kyc) {
            localStorage.setItem('evegah_new_ride_kyc', JSON.stringify(d.form_data.kyc));
          }
          if (d.form_data.rental) {
            localStorage.setItem('evegah_new_ride_rental', JSON.stringify(d.form_data.rental));
          }
          if (d.form_data.payment) {
            localStorage.setItem('evegah_new_ride_payment', JSON.stringify(d.form_data.payment));
          }
        }
      }
      return d;
    }
    return null;
  } catch (err) {
    console.error('loadDraft error:', err);
    return null;
  }
}

/**
 * Delete draft once ride is confirmed or manually discarded
 */
export async function deleteDraft(draftId: string): Promise<boolean> {
  try {
    if (!draftId) return false;
    const res = await fetch(`${getApiBase()}/drafts/${draftId}`, { method: 'DELETE' });
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('evegah_active_draft_id');
      if (active === draftId) {
        localStorage.removeItem('evegah_active_draft_id');
      }
    }
    return res.ok;
  } catch (err) {
    console.error('deleteDraft error:', err);
    return false;
  }
}

/**
 * Fetch all unexpired drafts
 */
export async function fetchAllDrafts(): Promise<RegistrationDraft[]> {
  try {
    const res = await fetch(`${getApiBase()}/drafts`);
    const data = await res.json();
    if (res.ok && data.status === 'success' && Array.isArray(data.drafts)) {
      return data.drafts;
    }
    return [];
  } catch (err) {
    console.error('fetchAllDrafts error:', err);
    return [];
  }
}
