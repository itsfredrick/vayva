"use client";

import { useState, useEffect } from "react";

type Ratings = Record<string, number>;

export interface Address {
  id: string;
  title: string;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  notes?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  holder: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export function useUserInteractions() {
  const [ratings, setRatings] = useState<Ratings>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [balance, setBalance] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on client mount
    try {
      const savedRatings = localStorage.getItem("vayva_ratings");
      const savedFavorites = localStorage.getItem("vayva_favorites");
      const savedBalance = localStorage.getItem("vayva_balance");
      const savedAddresses = localStorage.getItem("vayva_addresses");
      const savedPayments = localStorage.getItem("vayva_payments");

      if (savedRatings) setRatings(JSON.parse(savedRatings));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedBalance) setBalance(parseFloat(savedBalance));
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
      if (savedPayments) setPaymentMethods(JSON.parse(savedPayments));
    } catch (e) {
      console.error("Failed to load user interactions", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const rateMeal = (mealId: string, rating: number) => {
    const newRatings = { ...ratings, [mealId]: rating };
    setRatings(newRatings);
    localStorage.setItem("vayva_ratings", JSON.stringify(newRatings));
  };

  const toggleFavorite = (mealId: string) => {
    let newFavorites;
    if (favorites.includes(mealId)) {
      newFavorites = favorites.filter((id) => id !== mealId);
    } else {
      newFavorites = [...favorites, mealId];
    }
    setFavorites(newFavorites);
    localStorage.setItem("vayva_favorites", JSON.stringify(newFavorites));
    return { isFavorite: !favorites.includes(mealId) };
  };

  const redeemCode = (code: string) => {
    // Test Validation: Code must start with 'GIFT-'
    if (!code.startsWith("GIFT-")) {
      return { success: false, amount: 0 };
    }

    // Test Logic: Extract amount if possible, or random
    let amount = 100;
    const parts = code.split("-");
    if (parts.length > 1 && !isNaN(Number(parts[1]))) {
      amount = Number(parts[1]);
    }

    const newBalance = balance + amount;
    setBalance(newBalance);
    localStorage.setItem("vayva_balance", newBalance.toString());
    return { success: true, amount };
  };

  // Address Management
  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress = { ...address, id: Date.now().toString() };
    // If first address, make it default
    if (addresses.length === 0) newAddress.isDefault = true;

    const newAddresses = [...addresses, newAddress];
    setAddresses(newAddresses);
    localStorage.setItem("vayva_addresses", JSON.stringify(newAddresses));
  };

  const removeAddress = (id: string) => {
    const newAddresses = addresses.filter((a) => a.id !== id);
    setAddresses(newAddresses);
    localStorage.setItem("vayva_addresses", JSON.stringify(newAddresses));
  };

  const setDefaultAddress = (id: string) => {
    const newAddresses = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(newAddresses);
    localStorage.setItem("vayva_addresses", JSON.stringify(newAddresses));
  };

  // Payment Management
  const addPaymentMethod = (method: Omit<PaymentMethod, "id">) => {
    const newStart = { ...method, id: Date.now().toString() };
    if (paymentMethods.length === 0) newStart.isDefault = true;

    const newMethods = [...paymentMethods, newStart];
    setPaymentMethods(newMethods);
    localStorage.setItem("vayva_payments", JSON.stringify(newMethods));
  };

  const removePaymentMethod = (id: string) => {
    const newMethods = paymentMethods.filter((p) => p.id !== id);
    setPaymentMethods(newMethods);
    localStorage.setItem("vayva_payments", JSON.stringify(newMethods));
  };

  const setDefaultPaymentMethod = (id: string) => {
    const newMethods = paymentMethods.map((p) => ({
      ...p,
      isDefault: p.id === id,
    }));
    setPaymentMethods(newMethods);
    localStorage.setItem("vayva_payments", JSON.stringify(newMethods));
  };

  return {
    ratings,
    favorites,
    balance,
    addresses,
    paymentMethods,
    rateMeal,
    toggleFavorite,
    redeemCode,
    addAddress,
    removeAddress,
    setDefaultAddress,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    isLoaded,
  };
}
