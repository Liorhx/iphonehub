'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Home,
  Briefcase,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import {
  SavedAddress,
  getSavedAddresses,
  addSavedAddress,
  updateSavedAddress,
  removeSavedAddress,
  setDefaultSavedAddress,
} from '@/lib/addresses';

interface SavedAddressesViewProps {
  onBack: () => void;
  // Optional select mode for checkout or quick picking
  onSelectAddress?: (address: SavedAddress) => void;
  selectedAddressId?: string;
}

export default function SavedAddressesView({
  onBack,
  onSelectAddress,
  selectedAddressId,
}: SavedAddressesViewProps) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [formType, setFormType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('Uttar Pradesh');
  const [formPin, setFormPin] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  useEffect(() => {
    setAddresses(getSavedAddresses());
  }, []);

  const openAddForm = () => {
    setFormType('Home');
    setFormName('Rahul Yadav');
    setFormPhone('+91 90449 14653');
    setFormStreet('');
    setFormCity('Lucknow');
    setFormState('Uttar Pradesh');
    setFormPin('226010');
    setFormIsDefault(addresses.length === 0);
    setEditingAddress(null);
    setIsAddingNew(true);
  };

  const openEditForm = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setFormType(addr.type);
    setFormName(addr.fullName);
    setFormPhone(addr.phone);
    setFormStreet(addr.street);
    setFormCity(addr.city);
    setFormState(addr.state);
    setFormPin(addr.pinCode);
    setFormIsDefault(addr.isDefault);
    setIsAddingNew(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formStreet || !formCity || !formPin) {
      alert('Please fill out all address fields.');
      return;
    }

    if (editingAddress) {
      // Update existing
      const updatedList = updateSavedAddress({
        ...editingAddress,
        type: formType,
        fullName: formName.trim(),
        phone: formPhone.trim(),
        street: formStreet.trim(),
        city: formCity.trim(),
        state: formState.trim(),
        pinCode: formPin.trim(),
        isDefault: formIsDefault,
      });
      setAddresses(updatedList);
      setEditingAddress(null);
    } else {
      // Add new
      const updatedList = addSavedAddress({
        type: formType,
        fullName: formName.trim(),
        phone: formPhone.trim(),
        street: formStreet.trim(),
        city: formCity.trim(),
        state: formState.trim(),
        pinCode: formPin.trim(),
        isDefault: formIsDefault,
      });
      setAddresses(updatedList);
      setIsAddingNew(false);
    }
  };

  const handleRemove = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this address?')) {
      const updated = removeSavedAddress(id);
      setAddresses(updated);
    }
  };

  const handleSetDefault = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = setDefaultSavedAddress(id);
    setAddresses(updated);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-zinc-100 text-zinc-900 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
          Saved Addresses
        </h1>
      </div>

      {/* Address Cards List matching mockup */}
      <div className="space-y-4">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress && onSelectAddress(addr)}
              className={`bg-white rounded-3xl border p-5 space-y-3.5 transition-all shadow-subtle ${
                isSelected
                  ? 'border-brand-emerald ring-2 ring-brand-emerald/20 bg-emerald-50/20'
                  : 'border-zinc-200/90 hover:border-zinc-300'
              } ${onSelectAddress ? 'cursor-pointer' : ''}`}
            >
              {/* Type Icon & Label Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-800 shrink-0">
                    {addr.type === 'Home' ? (
                      <Home className="w-4 h-4 stroke-[1.9]" />
                    ) : addr.type === 'Work' ? (
                      <Briefcase className="w-4 h-4 stroke-[1.9]" />
                    ) : (
                      <MapPin className="w-4 h-4 stroke-[1.9]" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="font-extrabold text-base text-zinc-900">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="ml-2.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 tracking-wider border border-zinc-200/60">
                        DEFAULT
                      </span>
                    )}
                  </div>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={(e) => handleSetDefault(addr.id, e)}
                    className="text-xs font-semibold text-zinc-400 hover:text-brand-emerald"
                  >
                    Set as default
                  </button>
                )}
              </div>

              {/* Recipient Info */}
              <div className="pl-1 space-y-1">
                <p className="font-bold text-sm sm:text-base text-zinc-900">
                  {addr.fullName}
                </p>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm">
                  {addr.street}, {addr.city}, {addr.state} {addr.pinCode}
                </p>
                <p className="text-xs sm:text-sm text-zinc-600 pt-0.5">
                  {addr.phone}
                </p>
              </div>

              {/* Bottom Actions: Edit and Remove (matching mockup buttons) */}
              <div className="flex items-center justify-end gap-5 pt-1 border-t border-zinc-100 text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditForm(addr);
                  }}
                  className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-950 font-semibold transition"
                >
                  <Pencil className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleRemove(addr.id, e)}
                  className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-rose-600 font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Button: + Add New Address (matching mockup) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={openAddForm}
          className="w-full py-4 bg-[#081225] hover:bg-zinc-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all relative overflow-hidden group"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Address</span>
          {/* Subtle sparkle accent on bottom-right of button */}
          <Sparkles className="w-3.5 h-3.5 text-slate-400 absolute right-4 opacity-70 group-hover:opacity-100 transition" />
        </button>
      </div>

      {/* =========================================================================
          ADD / EDIT ADDRESS MODAL
          ========================================================================= */}
      {(isAddingNew || editingAddress) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-extrabold text-lg text-zinc-950">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingAddress(null);
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Address Type Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormType(t)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        formType === t
                          ? 'bg-[#081225] text-white border-[#081225]'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rahul Yadav"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-600">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. +91 90449 14653"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-600">
                  Street / Flat / Colony Address
                </label>
                <input
                  type="text"
                  required
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  placeholder="e.g. House 42, Gomti Nagar, Near Riverside Mall"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                />
              </div>

              {/* City, State & PIN Code */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-600">City</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Lucknow"
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-600">State</label>
                  <input
                    type="text"
                    required
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    placeholder="Uttar Pradesh"
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-600">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formPin}
                    onChange={(e) => setFormPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="226010"
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <div
                onClick={() => setFormIsDefault(!formIsDefault)}
                className="flex items-center gap-2 pt-1 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                    formIsDefault
                      ? 'bg-brand-emerald border-brand-emerald text-white'
                      : 'border-zinc-300 bg-white'
                  }`}
                >
                  {formIsDefault && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs text-zinc-700 font-medium">
                  Make this my default delivery address
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingAddress(null);
                  }}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#081225] hover:bg-zinc-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

