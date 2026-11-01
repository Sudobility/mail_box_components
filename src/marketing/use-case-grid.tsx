import React from 'react';
import { cn } from '../index';
import { ui } from '@sudobility/design';

export interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';
}

export interface UseCaseGridProps {
  title?: string;
  description?: string;
  useCases: UseCase[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const UseCaseGrid: React.FC<UseCaseGridProps> = ({
  title,
  description,
  useCases,
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
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={cn(ui.section.gradient, className)}>
      <div className={containerClass}>
        {(title || description) && (
          <div className='text-center mb-12'>
            {title && (
              <h2 className='text-3xl font-bold text-foreground mb-4'>
                {title}
              </h2>
            )}
            {description && (
              <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn('grid gap-8', gridClasses[columns])}>
          {useCases.map((useCase, index) => {
            const iconColor = useCase.color
              ? colorClasses[useCase.color]
              : colorClasses.blue;

            return (
              <div
                key={index}
                className='bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow'
              >
                <div className={cn('flex-shrink-0 mb-4', iconColor)}>
                  {useCase.icon}
                </div>

                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  {useCase.title}
                </h3>

                <p className='text-muted-foreground mb-4'>
                  {useCase.description}
                </p>

                {useCase.examples && useCase.examples.length > 0 && (
                  <div>
                    <h4 className='text-sm font-semibold text-muted-foreground mb-2'>
                      Examples:
                    </h4>
                    <ul className='space-y-1'>
                      {useCase.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className='flex items-start'>
                          <div
                            className={cn(
                              'w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0',
                              useCase.color
                                ? `bg-${useCase.color}-500`
                                : 'bg-primary'
                            )}
                          />
                          <span className='text-sm text-muted-foreground'>
                            {example}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
