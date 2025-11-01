// app/page.tsx
'use client';

import { useState } from 'react';
import { UrlForm } from '@/components/url-form';
import { LinkTable } from '@/components/link-table';
import { ToastContainer, ToastProps } from '@/components/ui/toast';

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">URL Shortener</h1>
        <p className="text-xl text-base-content/70">
          Create short links, track clicks, and manage your URLs
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <h2 className="card-title">Shorten Your URL</h2>
            <UrlForm onSuccess={handleFormSuccess} showToast={showToast} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Your Links</h2>
        <LinkTable refreshTrigger={refreshTrigger} showToast={showToast} />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
