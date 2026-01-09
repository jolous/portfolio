import type { ReactNode } from 'react';

type CardProps = {
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function Card({ title, subtitle, children, footer, className }: CardProps) {
  const cardClassName = ['card', className].filter(Boolean).join(' ');

  return (
    <article className={cardClassName}>
      <header className="card__header">
        <h3 className="card__title">{title}</h3>
        <p className="card__subtitle">{subtitle}</p>
      </header>
      <div className="card__body">{children}</div>
      {footer ? <div className="card__footer">{footer}</div> : null}
    </article>
  );
}
