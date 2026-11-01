import React from 'react';
import { cn } from '../index';
import { colors, ui } from '@sudobility/design';

export interface MetricItem {
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

export interface MetricsGridProps {
  title?: string;
  description?: string;
  metrics: MetricItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  title,
  description,
  metrics,
  columns = 3,
  className,
}) => {
  const containerClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  const colorClasses = {
    blue: 'text-primary',
    green: 'text-success',
    purple: 'text-accent-foreground',
    orange: 'text-warning',
    pink: 'text-secondary-foreground',
    gray: 'text-muted-foreground',
  };

  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

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

        <div className={cn('grid gap-8', gridClasses[columns])}>
          {metrics.map((metric, index) => {
            const colorClass = metric.color
              ? colorClasses[metric.color]
              : colorClasses.blue;

            return (
              <div
                key={index}
                className={cn(
                  'rounded-xl p-6 border text-center',
                  colors.component.card.default.base,
                  colors.component.card.default.dark,
                  colors.component.card.default.hover
                )}
              >
                {metric.icon && (
                  <div className={cn('flex justify-center mb-4', colorClass)}>
                    {metric.icon}
                  </div>
                )}

                <div className='space-y-2'>
                  <div className={cn('text-3xl font-bold', colorClass)}>
                    {metric.value}
                  </div>

                  <div className={cn(ui.text.label)}>{metric.label}</div>

                  {metric.trend && (
                    <div
                      className={cn(
                        'text-sm font-semibold',
                        metric.trend.direction === 'up'
                          ? ui.text.success
                          : ui.text.error
                      )}
                    >
                      {metric.trend.direction === 'up' ? '↑' : '↓'}{' '}
                      {metric.trend.value}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
