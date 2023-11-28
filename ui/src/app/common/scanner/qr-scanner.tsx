// QRScanner.tsx
import React, { useState, useCallback } from 'react';
import QrScanner from 'react-qr-scanner';
import { Button, Modal } from 'antd';


interface QRScannerProps {
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose }) => {
  const [result, setResult] = useState<string | null>(null);

  const handleScan = useCallback((data: string | null) => {
    if (data) {
      setResult(data);
    }
  }, []);

  const handleError = useCallback((error: any) => {
    console.error(error);
  }, []);

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="QR Code Scanner"
      visible={true}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <QrScanner
        onScan={handleScan}
        onError={handleError}
        style={{ width: '100%' }}
      />
      <div style={{ marginTop: '16px' }}>
        {result && <p>Scanned QR Code: {result}</p>}
      </div>
    </Modal>
  );
};

export default QRScanner;
