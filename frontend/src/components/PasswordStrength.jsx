import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  // Criteria checks
  const checks = [
    { label: 'Min 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { label: 'Special symbol (!@#$)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.met).length;

  let strengthLabel = 'Very Weak';
  let colorClass = 'bg-red-500';
  let textClass = 'text-red-400';

  if (score === 5) {
    strengthLabel = 'Strong & Secure';
    colorClass = 'bg-emerald-500';
    textClass = 'text-emerald-400';
  } else if (score >= 3) {
    strengthLabel = 'Medium';
    colorClass = 'bg-amber-500';
    textClass = 'text-amber-400';
  } else if (score >= 1) {
    strengthLabel = 'Weak';
    colorClass = 'bg-orange-500';
    textClass = 'text-orange-400';
  }

  return (
    <div className="mt-2 space-y-2.5">
      <div className="flex justify-between items-center text-[11px] uppercase tracking-wider font-semibold">
        <span className="text-gray-500">Security strength</span>
        <span className={textClass}>{strengthLabel}</span>
      </div>

      {/* Progress indicators */}
      <div className="flex gap-1 h-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-full flex-1 rounded-full transition-all duration-500 ${
              i < score ? colorClass : 'bg-slate-800'
            }`}
          ></div>
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] leading-tight">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-1.5 py-0.5">
            {check.met ? (
              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            ) : (
              <X className="w-3 h-3 text-slate-600 flex-shrink-0" />
            )}
            <span className={check.met ? 'text-slate-300' : 'text-slate-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
