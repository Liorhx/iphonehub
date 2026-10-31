'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SavedAddressesView from '@/components/account/SavedAddressesView';

export default function SavedAddressesPage() {
  const router = useRouter();

  return (
    <div className="pb-24">
      <SavedAddressesView onBack={() => router.push('/account')} />
    </div>
  );
}

