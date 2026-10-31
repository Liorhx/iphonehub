'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SettingsView from '@/components/account/SettingsView';

export default function AccountSettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] bg-[#FBFBFC] pb-24">
      <SettingsView onBack={() => router.push('/account')} />
    </div>
  );
}

