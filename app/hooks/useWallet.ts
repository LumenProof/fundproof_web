'use client';

import { useState, useEffect } from 'react';
import {
  isConnected,
  getPublicKey,
  signTransaction,
} from '@stellar/freighter-api';

export function useWallet() {
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    try {
      if (await isConnected()) {
        const key = await getPublicKey();
        setPublicKey(key);
      } else {
        setError('Freighter is not connected. Please install or unlock Freighter.');
      }
    } catch (e) {
      setError('Error connecting to Freighter. See console for details.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setPublicKey('');
  };

  return {
    publicKey,
    loading,
    error,
    connectWallet,
    disconnectWallet,
  };
}