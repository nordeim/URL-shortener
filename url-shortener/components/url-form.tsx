// components/url-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { urlSchema, type UrlInput } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { QRCodeDisplay } from './qr-code';

interface ShortenedLink {
  shortUrl: string;
  shortId: string;
  originalUrl: string;
  qrDataUrl?: string;
}

interface UrlFormProps {
  onSuccess?: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export function UrlForm({ onSuccess, showToast }: UrlFormProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortenedLink | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UrlInput>({
    resolver: zodResolver(urlSchema),
  });

  const onSubmit = async (data: UrlInput) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        showToast(responseData.error || 'Failed to shorten URL', 'error');
        return;
      }

      setResult(responseData);
      showToast('Short link created successfully', 'success');
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error shortening URL:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('url')}
          type="url"
          label="Enter URL to shorten"
          placeholder="https://example.com/very-long-url"
          error={errors.url?.message}
        />

        <Input
          {...register('customAlias')}
          type="text"
          label="Custom Alias (optional)"
          placeholder="my-link"
          error={errors.customAlias?.message}
          helperText="3-10 characters: letters, numbers, hyphens, underscores"
        />

        <Button type="submit" loading={loading} className="w-full">
          Shorten URL
        </Button>
      </form>

      {result && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-success">Success!</h3>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Short URL:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={result.shortUrl}
                    readOnly
                    className="input input-bordered flex-1"
                  />
                  <Button
                    onClick={() => copyToClipboard(result.shortUrl)}
                    variant="secondary"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Original URL:
                  </span>
                </label>
                <p className="text-sm break-all text-base-content/70">
                  {result.originalUrl}
                </p>
              </div>

              {result.qrDataUrl && <QRCodeDisplay dataUrl={result.qrDataUrl} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
