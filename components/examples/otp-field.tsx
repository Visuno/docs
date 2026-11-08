'use client';
import { useState } from 'react';
import { OtpField, type OtpStatus } from '@visuno/otp-field/OtpField';

/**
 * Live example for the OTP field docs page — the real Visuno React component.
 * Type or paste a 6-digit code; when the last box fills it "verifies": 123456
 * succeeds (green), anything else errors (red). Page-native colours.
 */
export function OtpFieldExample() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<OtpStatus>('default');
  const [msg, setMsg] = useState('Enter the 6-digit code we sent you');

  const onComplete = (value: string) => {
    const ok = value === '123456';
    setStatus(ok ? 'success' : 'error');
    setMsg(ok ? 'Code verified' : "That code didn't match — try 123456");
  };

  const reset = () => {
    setCode('');
    setStatus('default');
    setMsg('Enter the 6-digit code we sent you');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        margin: '20px 0',
        color: 'var(--vo-fg)',
      }}
    >
      <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>{msg}</p>
      <OtpField
        value={code}
        onChange={(v) => {
          setCode(v);
          if (status !== 'default') setStatus('default');
        }}
        onComplete={onComplete}
        status={status}
      />
      <button
        type="button"
        onClick={reset}
        style={{
          font: 'inherit',
          fontSize: 13,
          padding: '6px 12px',
          color: 'var(--vo-fg)',
          background: 'transparent',
          border: '1px solid var(--vo-line)',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Reset
      </button>
    </div>
  );
}
