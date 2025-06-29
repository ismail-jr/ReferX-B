'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { useRef } from 'react';

type ReferralQRCodeProps = {
  referralLink: string;
};

export default function ReferralQRCode({ referralLink }: ReferralQRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'referral-qr-code.png';
    downloadLink.click();
  };

  return (
    <div className="">
      <h3 className="text-lg font-semibold text-blue-900">Scan QR Code to Join</h3>

      <div
        className="rounded-xl pt-2 shadow-md"
        ref={qrRef}
      >
        <QRCodeCanvas
          value={referralLink}
          size={120}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin
        />
      </div>

      <button
        onClick={downloadQRCode}
        className="my-3 inline-flex items-center gap-2 p-2 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition"
      >
        <Download size={16} /> Download QR Code
      </button>
    </div>
  );
}
