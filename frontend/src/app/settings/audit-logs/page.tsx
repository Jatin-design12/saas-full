'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuditLogsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/super-admin/audit-logs');
  }, [router]);
  return null;
}
