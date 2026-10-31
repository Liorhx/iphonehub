export interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

const STORAGE_KEY = 'iphonehub_saved_addresses';

export const INITIAL_DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_home',
    type: 'Home',
    fullName: 'Rahul Yadav',
    phone: '+91 90449 14653',
    street: 'House 42, Gomti Nagar, Near Riverside Mall',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226010',
    isDefault: true,
  },
  {
    id: 'addr_work',
    type: 'Work',
    fullName: 'Rahul Yadav',
    phone: '+91 90449 14653',
    street: 'Cyber Tower, 4th Floor, Vibhuti Khand',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226010',
    isDefault: false,
  },
];

export function getSavedAddresses(): SavedAddress[] {
  if (typeof window === 'undefined') return INITIAL_DEFAULT_ADDRESSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_ADDRESSES));
      return INITIAL_DEFAULT_ADDRESSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEFAULT_ADDRESSES;
  } catch (e) {
    console.error('Failed to parse saved addresses:', e);
    return INITIAL_DEFAULT_ADDRESSES;
  }
}

export function saveAddressesToStorage(addresses: SavedAddress[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    // Dispatch custom event so other components (like Checkout) update in real-time
    window.dispatchEvent(new Event('saved_addresses_updated'));
  } catch (e) {
    console.error('Failed to save addresses:', e);
  }
}

export function addSavedAddress(newAddr: Omit<SavedAddress, 'id'>): SavedAddress[] {
  const current = getSavedAddresses();
  const id = `addr_${Date.now()}`;
  let updated: SavedAddress[];

  if (newAddr.isDefault) {
    updated = current.map((a) => ({ ...a, isDefault: false }));
    updated.unshift({ ...newAddr, id, isDefault: true });
  } else {
    updated = [...current, { ...newAddr, id }];
  }

  saveAddressesToStorage(updated);
  return updated;
}

export function updateSavedAddress(updatedAddr: SavedAddress): SavedAddress[] {
  const current = getSavedAddresses();
  let updated: SavedAddress[];

  if (updatedAddr.isDefault) {
    updated = current.map((a) =>
      a.id === updatedAddr.id ? { ...updatedAddr, isDefault: true } : { ...a, isDefault: false }
    );
  } else {
    updated = current.map((a) => (a.id === updatedAddr.id ? updatedAddr : a));
  }

  saveAddressesToStorage(updated);
  return updated;
}

export function removeSavedAddress(id: string): SavedAddress[] {
  const current = getSavedAddresses();
  const filtered = current.filter((a) => a.id !== id);
  // Ensure at least one is default if list not empty
  if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
    filtered[0].isDefault = true;
  }
  saveAddressesToStorage(filtered);
  return filtered;
}

export function setDefaultSavedAddress(id: string): SavedAddress[] {
  const current = getSavedAddresses();
  const updated = current.map((a) => ({
    ...a,
    isDefault: a.id === id,
  }));
  saveAddressesToStorage(updated);
  return updated;
}

