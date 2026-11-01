import React from 'react';
import { cn } from '../index';
import { ui } from '@sudobility/design';

export interface ProcessStep {
  step: number | string;
  title: string;
  description: string;
  details?: string[];
  icon?: React.ReactNode;
}

export interface ProcessStepsProps {
  title?: string;
  description?: string;
  steps: ProcessStep[];
  orientation?: 'horizontal' | 'vertical';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';
  className?: string;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  title,
  description,
  steps,
  orientation = 'vertical',
  color = 'blue',
  className,
}) => {
  const containerClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  const colorClasses = {
    blue: {
      bg: 'bg-primary',
      text: 'text-primary',
      border: 'border-primary/20',
    },
    green: {
      bg: 'bg-success',
      text: 'text-success',
      border: 'border-success/20',
    },
    purple: {
      bg: 'bg-accent',
      text: 'text-accent-foreground',
      border: 'border-accent',
    },
    orange: {
      bg: 'bg-warning',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    pink: {
      bg: 'bg-secondary',
      text: 'text-secondary-foreground',
      border: 'border-secondary',
    },
    gray: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-border',
    },
  };

  const colors = colorClasses[color];

  return (
    <section className={cn('py-16', className)}>
      <div className={containerClass}>
        {(title || description) && (
          <div className='text-center mb-12'>
            {title && <h2 className={cn(ui.text.h2, 'mb-4')}>{title}</h2>}
            {description && (
              <p className={cn(ui.text.lead, 'max-w-3xl mx-auto')}>
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            orientation === 'horizontal'
              ? 'flex flex-col lg:flex-row justify-center items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8'
              : 'space-y-8 max-w-4xl mx-auto'
          )}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'relative',
                orientation === 'horizontal'
                  ? 'flex-1 text-center lg:text-left'
                  : 'flex items-start'
              )}
            >
              {/* Step Number/Icon */}
              <div
                // intentional: text-white is contrast for categorical step colors (colors.bg)
                className={cn(
                  'flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold',
                  colors.bg,
                  orientation === 'horizontal'
                    ? 'w-12 h-12 mx-auto lg:mx-0 mb-4'
                    : 'w-10 h-10 mr-4 mt-1'
                )}
              >
                {step.icon ? step.icon : step.step}
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && orientation === 'vertical' && (
                <div
                  className={cn(
                    'absolute left-5 top-12 w-px h-8 -ml-px',
                    colors.bg.replace('bg-', 'bg-').replace('-600', '-200'),
                    'dark:' +
                      colors.bg.replace('bg-', 'bg-').replace('-600', '-800')
                  )}
                />
              )}

              {/* Content */}
              <div
                className={cn(
                  orientation === 'horizontal' ? 'flex-1' : 'flex-1 min-w-0'
                )}
              >
                <h3 className={cn(ui.text.h4, 'mb-2')}>{step.title}</h3>
                <p className={cn(ui.text.body, 'mb-3')}>{step.description}</p>

                {step.details && step.details.length > 0 && (
                  <ul className='space-y-1'>
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className='flex items-start'>
                        <div
                          className={cn(
                            'w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0',
                            colors.bg
                          )}
                        />
                        <span className={ui.text.bodySmall}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
