import type { ReactNode } from 'react';

export type TimelineItem = {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  dateLabel: ReactNode;
  startDate: string;
  content?: ReactNode;
  footer?: ReactNode;
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

const formatClassName = (baseClass: string, className?: string) =>
  [baseClass, className].filter(Boolean).join(' ');

export default function Timeline({ items, className }: TimelineProps) {
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <ul className={formatClassName('timeline', className)}>
      {sortedItems.map((item, index) => {
        const isLast = index === sortedItems.length - 1;
        const isRight = index % 2 === 0;
        return (
          <li
            key={item.id}
            className={formatClassName(
              'timeline-item',
              `${isRight ? 'timeline-item--right' : 'timeline-item--left'} ${
                isLast ? 'timeline-item--last' : ''
              }`,
            )}
          >
            <div className="timeline-side timeline-side--left">
              {isRight ? (
                <div className="timeline-date">{item.dateLabel}</div>
              ) : (
                <div className="timeline-content">
                  <article className="timeline-entry">
                    <h3 className="timeline-title">{item.title}</h3>
                    {item.subtitle ? <p className="timeline-subtitle">{item.subtitle}</p> : null}
                    {item.content ? <div className="timeline-body">{item.content}</div> : null}
                    {item.footer ? <div className="timeline-footer">{item.footer}</div> : null}
                  </article>
                </div>
              )}
            </div>
            <div className="timeline-marker" aria-hidden="true" />
            <div className="timeline-side timeline-side--right">
              {isRight ? (
                <div className="timeline-content">
                  <article className="timeline-entry">
                    <h3 className="timeline-title">{item.title}</h3>
                    {item.subtitle ? <p className="timeline-subtitle">{item.subtitle}</p> : null}
                    {item.content ? <div className="timeline-body">{item.content}</div> : null}
                    {item.footer ? <div className="timeline-footer">{item.footer}</div> : null}
                  </article>
                </div>
              ) : (
                <div className="timeline-date">{item.dateLabel}</div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
