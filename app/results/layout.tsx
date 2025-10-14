// app/results/layout.tsx
import { ReactNode } from 'react';

export default function ResultsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}