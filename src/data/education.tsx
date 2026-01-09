import type { TimelineItem } from '../components/Timeline';

export const educationItems: TimelineItem[] = [
  {
    id: 'phd-environmental-technology',
    title: 'Doctor of Philosophy (Environmental Technology)',
    subtitle: 'Universiti Sains Malaysia, Penang, Malaysia',
    dateLabel: '2021 - Present',
    startDate: '2021-01-01',
    content: (
      <ul className="education-list">
        <li>Researching AI-driven energy optimization for sustainable cities.</li>
        <li>Leading interdisciplinary collaborations across environmental systems.</li>
      </ul>
    ),
  },
  {
    id: 'master-data-science',
    title: 'Master of Data Science & Analytics',
    subtitle: 'Universiti Sains Malaysia, Penang, Malaysia',
    dateLabel: '2018 - 2020',
    startDate: '2018-01-01',
    content: (
      <ul className="education-list">
        <li>Specialized in predictive modeling, automation, and business intelligence.</li>
        <li>Capstone centered on intelligent dashboards for operational decisioning.</li>
      </ul>
    ),
  },
  {
    id: 'bachelor-computer-engineering',
    title: 'Bachelor of Computer Engineering Technology-Hardware',
    subtitle: 'Khayyam University, Mashhad, Iran',
    dateLabel: '2008 - 2011',
    startDate: '2008-01-01',
    content: (
      <ul className="education-list">
        <li>Built hardware-software prototypes and embedded control systems.</li>
        <li>Focus on electronics, microprocessors, and digital system design.</li>
      </ul>
    ),
  },
];
