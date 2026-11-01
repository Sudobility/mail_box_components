import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Label, cn } from '../index';
import { colors, ui } from '@sudobility/design';

/** Tracking data for EmailInputGroup actions */
export interface EmailInputGroupTrackingData {
  action: 'toggle';
  trackingLabel?: string;
  componentName?: string;
}

export interface EmailInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const EmailInputField: React.FC<EmailInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = '',
}) => {
  return (
    <div className={className}>
      <Label htmlFor={label.toLowerCase()} className={ui.text.label}>
        {label} {required && <span className='text-destructive'>*</span>}
      </Label>
      <input
        id={label.toLowerCase()}
        type='email'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none',
          colors.component.input.default.base,
          colors.component.input.default.dark,
          error
            ? colors.component.input.default.error
            : colors.component.input.default.focus
        )}
      />
      {error && <p className={cn('mt-1 text-sm', ui.text.error)}>{error}</p>}
    </div>
  );
};

export interface CollapsibleEmailFieldProps extends EmailInputFieldProps {
  isVisible: boolean;
  onToggle: () => void;
  showLabel?: string;
  hideLabel?: string;
  /** Optional tracking callback */
  onTrack?: (data: EmailInputGroupTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export const CollapsibleEmailField: React.FC<CollapsibleEmailFieldProps> = ({
  isVisible,
  onToggle,
  showLabel,
  hideLabel,
  onTrack,
  trackingLabel,
  componentName = 'CollapsibleEmailField',
  ...fieldProps
}) => {
  const toggleLabel = isVisible ? hideLabel : showLabel;

  const handleToggle = () => {
    onTrack?.({ action: 'toggle', trackingLabel, componentName });
    onToggle();
  };

  return (
    <div>
      <button
        type='button'
        onClick={handleToggle}
        className='flex items-center text-sm text-primary hover:text-primary/80 mb-2'
      >
        {isVisible ? (
          <ChevronUpIcon className='h-4 w-4 mr-1' />
        ) : (
          <ChevronDownIcon className='h-4 w-4 mr-1' />
        )}
        {toggleLabel}
      </button>

      {isVisible && <EmailInputField {...fieldProps} />}
    </div>
  );
};

export interface EmailInputGroupProps {
  to: string;
  onToChange: (value: string) => void;
  cc?: string;
  onCcChange?: (value: string) => void;
  bcc?: string;
  onBccChange?: (value: string) => void;
  showCc?: boolean;
  showBcc?: boolean;
  onToggleCc?: () => void;
  onToggleBcc?: () => void;
  errors?: {
    to?: string;
    cc?: string;
    bcc?: string;
  };
  className?: string;
  labels?: {
    to?: string;
    cc?: string;
    bcc?: string;
    addCc?: string;
    removeCc?: string;
    addBcc?: string;
    removeBcc?: string;
  };
  placeholders?: {
    to?: string;
    cc?: string;
    bcc?: string;
  };
  /** Optional tracking callback */
  onTrack?: (data: EmailInputGroupTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export const EmailInputGroup: React.FC<EmailInputGroupProps> = ({
  to,
  onToChange,
  cc = '',
  onCcChange,
  bcc = '',
  onBccChange,
  showCc = false,
  showBcc = false,
  onToggleCc,
  onToggleBcc,
  errors = {},
  className = '',
  labels = {},
  placeholders = {},
  onTrack,
  trackingLabel,
  componentName: _componentName = 'EmailInputGroup',
}) => {
  const defaultLabels = {
    to: 'To',
    cc: 'CC',
    bcc: 'BCC',
    addCc: 'Add CC',
    removeCc: 'Remove CC',
    addBcc: 'Add BCC',
    removeBcc: 'Remove BCC',
  };

  const defaultPlaceholders = {
    to: 'recipient@example.com',
    cc: 'cc@example.com',
    bcc: 'bcc@example.com',
  };

  const finalLabels = { ...defaultLabels, ...labels };
  const finalPlaceholders = { ...defaultPlaceholders, ...placeholders };
  return (
    <div className={`space-y-4 ${className}`}>
      {/* To Field - Always visible */}
      <EmailInputField
        label={finalLabels.to}
        value={to}
        onChange={onToChange}
        placeholder={finalPlaceholders.to}
        required
        error={errors.to}
      />

      {/* CC Field - Collapsible */}
      {onToggleCc && onCcChange && (
        <CollapsibleEmailField
          label={finalLabels.cc}
          value={cc}
          onChange={onCcChange}
          placeholder={finalPlaceholders.cc}
          error={errors.cc}
          isVisible={showCc}
          onToggle={onToggleCc}
          showLabel={finalLabels.addCc}
          hideLabel={finalLabels.removeCc}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
        />
      )}

      {/* BCC Field - Collapsible */}
      {onToggleBcc && onBccChange && (
        <CollapsibleEmailField
          label={finalLabels.bcc}
          value={bcc}
          onChange={onBccChange}
          placeholder={finalPlaceholders.bcc}
          error={errors.bcc}
          isVisible={showBcc}
          onToggle={onToggleBcc}
          showLabel={finalLabels.addBcc}
          hideLabel={finalLabels.removeBcc}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
        />
      )}
    </div>
  );
};
