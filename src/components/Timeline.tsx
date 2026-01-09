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
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <ul className={formatClassName('timeline', className)}>
      {sortedItems.map((item, index) => {
        const isLast = index === sortedItems.length - 1;
        return (
          <li
            key={item.id}
            className={formatClassName('timeline-item', isLast ? 'timeline-item--last' : '')}
          >
            <div className="timeline-date">{item.dateLabel}</div>
            <div className="timeline-marker" aria-hidden="true" />
            <div className="timeline-content">
              <article className="card timeline-card">
                <header className="card__header">
                  <h3 className="card__title">{item.title}</h3>
                  {item.subtitle ? <p className="card__subtitle">{item.subtitle}</p> : null}
                </header>
                {item.content ? <div className="card__body">{item.content}</div> : null}
                {item.footer ? <div className="card__footer">{item.footer}</div> : null}
              </article>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
