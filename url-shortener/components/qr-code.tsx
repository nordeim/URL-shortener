// components/qr-code.tsx
'use client';

interface QRCodeDisplayProps {
  dataUrl: string;
}

export function QRCodeDisplay({ dataUrl }: QRCodeDisplayProps) {
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="label">
        <span className="label-text font-semibold">QR Code:</span>
      </label>
      <div className="bg-white p-4 rounded-lg">
        <img src={dataUrl} alt="QR Code" className="w-48 h-48" />
      </div>
      <button onClick={downloadQRCode} className="btn btn-sm btn-outline">
        Download QR Code
      </button>
    </div>
  );
}
