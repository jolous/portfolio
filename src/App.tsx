import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import TextScramble from './utils/textScramble';
import { skillOrder, skills, type SkillKey, type SkillLabel } from './data/skills';

const phrases = ['Data Scientist', 'Web Developer', 'Programmer', 'Photographer'];

const chartOptions = {
  scales: {
    r: {
      beginAtZero: true,
      min: 0,
      max: 100,
      ticks: {
        display: false
      },
      pointLabels: {
        font: {
          size: 14,
          weight: '600'
        },
        color: '#111827'
      },
      grid: {
        display: true,
        color: 'rgba(15, 23, 42, 0.25)'
      },
      angleLines: {
        color: 'rgba(15, 23, 42, 0.2)'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

const buildLabels = (labels: SkillLabel[], isSmallScreen: boolean) =>
  labels.map(label => {
    if (Array.isArray(label)) {
      return isSmallScreen ? label[0] : label;
    }
    return label;
  });

const buildData = (id: SkillKey, isSmallScreen: boolean) => {
  const { label, labels, data } = skills[id];
  return {
    labels: buildLabels(labels, isSmallScreen),
    datasets: [
      {
        label,
        backgroundColor: 'rgba(16, 185, 129, 0.35)',
        borderColor: 'rgba(15, 118, 110, 0.95)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(15, 118, 110, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        radius: 5,
        data
      }
    ]
  };
};

const navItems = [
  { href: '#home', label: 'HOME' },
  { href: '#educationSection', label: 'EDUCATION' },
  { href: '#skillSection', label: 'SKILLS' },
  { href: '#workSection', label: 'WORK EXPERIENCE' },
  { href: '#activitiesSection', label: 'ACHIEVEMENTS' },
  { href: '#certificatesSection', label: 'CERTIFICATES' }
];

const demoGalleryItems = [
  {
    title: 'CEMACS Atmosfera Dashboard',
    badge: 'New idea',
    description:
      'Daily-updated and interactive visualization of parameters measured for the atmosphere-coastal ocean experiment at the Centre for Marine and Coastal Studies (CEMACS) USM.',
    ctaLabel: 'View daily dashboard',
    ctaHref: 'https://atmosfera.usm.my/visualization.html',
    mediaType: 'image',
    mediaSrc: '/images/demo/atmosfera.png',
    mediaAlt: 'CEMACS Interactive Visualization'
  },
  {
    title: 'IPCC Methane Sunburst',
    badge: 'Prototype',
    description:
      'An interactive Plotly sunburst chart mapping IPCC methane emission factors across Malaysia built for Environmental Defense Fund (EDF).',
    ctaLabel: 'View sunburst chart',
    ctaHref: '/demo/sunburst_plot.html',
    mediaType: 'image',
    mediaSrc: '/images/demo/sunburst.png',
    mediaAlt: 'Interactive sunburst chart'
  },
  {
    title: 'Oil Palm Detection Demo',
    badge: 'Showcase',
    description: 'Oil palm tree detection showcase using YOLOv5 on recorded drone video.',
    ctaLabel: 'Watch detection demo',
    ctaHref: '/images/demo/oilpalm_detection.mp4',
    mediaType: 'video',
    mediaSrc: '/images/demo/oilpalm_detection.mp4',
    mediaPoster: '/images/demo/oilpalm_detection.png',
    mediaAlt: 'Oil palm detection video'
  }
];

export default function App() {
  const [activeSkill, setActiveSkill] = useState<SkillKey>('skillGeneral');
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({
    phdResearcher: false,
    iotEngineer: false,
    itHelpDesk: false,
    roboticTutor: false,
    aiTechIntern: false,
    hardwareSoftwareSpecialist: false
  });
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const scrambleRef = useRef<HTMLSpanElement | null>(null);
  const heroImageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.body.offsetHeight - window.innerHeight);
      document.body.style.setProperty('--scroll', `${progress}`);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleRoleDetails = (roleKey: string) => {
    setExpandedRoles(previous => ({
      ...previous,
      [roleKey]: !previous[roleKey]
    }));
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.top = `${event.pageY}px`;
      cursorRef.current.style.left = `${event.pageX}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const heroImage = heroImageRef.current;
    if (!heroImage) return;

    const maxTilt = 3.5;
    const maxGlowShift = 12;
    let frameId = 0;
    let latestEvent: PointerEvent | null = null;

    const applyTilt = () => {
      if (!latestEvent) return;
      const rect = heroImage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = latestEvent.clientX - rect.left;
      const y = latestEvent.clientY - rect.top;
      const xPercent = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
      const yPercent = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

      const tiltX = (-yPercent * maxTilt).toFixed(2);
      const tiltY = (xPercent * maxTilt).toFixed(2);

      heroImage.style.setProperty('--tilt-x', `${tiltX}deg`);
      heroImage.style.setProperty('--tilt-y', `${tiltY}deg`);
      heroImage.style.setProperty('--glow-x', `${(xPercent * maxGlowShift).toFixed(2)}px`);
      heroImage.style.setProperty('--glow-y', `${(yPercent * maxGlowShift).toFixed(2)}px`);
      frameId = 0;
    };

    const updateTilt = (event: PointerEvent) => {
      latestEvent = event;
      if (frameId) return;
      frameId = window.requestAnimationFrame(applyTilt);
    };

    const resetTilt = () => {
      latestEvent = null;
      heroImage.style.setProperty('--tilt-x', '0deg');
      heroImage.style.setProperty('--tilt-y', '0deg');
      heroImage.style.setProperty('--glow-x', '0px');
      heroImage.style.setProperty('--glow-y', '0px');
    };

    resetTilt();
    heroImage.addEventListener('pointermove', updateTilt);
    heroImage.addEventListener('pointerleave', resetTilt);

    return () => {
      heroImage.removeEventListener('pointermove', updateTilt);
      heroImage.removeEventListener('pointerleave', resetTilt);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const hoverTargets = Array.from(document.querySelectorAll<HTMLElement>('.hover-target'));

    const handleEnter = (event: Event) => {
      cursor.classList.add('link-effect');
      (event.currentTarget as HTMLElement).classList.add('hoverred-link');
    };

    const handleLeave = (event: Event) => {
      cursor.classList.remove('link-effect');
      (event.currentTarget as HTMLElement).classList.remove('hoverred-link');
    };

    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', handleEnter);
      target.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      hoverTargets.forEach(target => {
        target.removeEventListener('mouseenter', handleEnter);
        target.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  useEffect(() => {
    if (!scrambleRef.current) return;

    const fx = new TextScramble(scrambleRef.current);
    let counter = 0;
    let timeoutId = 0;

    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        timeoutId = window.setTimeout(next, 3000);
      });
      counter = (counter + 1) % phrases.length;
    };

    next();

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: 'radar',
      data: buildData(activeSkill, window.innerWidth < 1000),
      options: chartOptions
    });

    chartRef.current = chart;
    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data = buildData(activeSkill, window.innerWidth < 1000);
    chartRef.current.update();
  }, [activeSkill]);

  useEffect(() => {
    const handleResize = () => {
      if (!chartRef.current) return;
      chartRef.current.data = buildData(activeSkill, window.innerWidth < 1000);
      chartRef.current.update();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSkill]);

  useEffect(() => {
    const handleAnchorClick = (event: Event) => {
      const anchor = event.currentTarget as HTMLAnchorElement;
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length === 1) return;

      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        const offset = 100;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    anchors.forEach(anchor => anchor.addEventListener('click', handleAnchorClick));

    return () => {
      anchors.forEach(anchor => anchor.removeEventListener('click', handleAnchorClick));
    };
  }, []);

  const skillLabels = useMemo(
    () =>
      skillOrder.map(key => ({
        key,
        label: skills[key].label
      })),
    []
  );

  return (
    <>
      <div id="goToTop" className="hover-target">
        <a href="#home">&#x2191;</a>
      </div>
      <div className="progress"></div>
      <div className="cursor" ref={cursorRef}></div>

      <nav>
        <h1>Ehsan Jolous Jamshidi</h1>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.href} className="hover-target">
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
          <li>
            <a
              href="mailto:&#101;&#106;&#046;&#106;&#097;&#109;&#115;&#104;&#105;&#100;&#105;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;"
              id="contact"
              className="hover-target"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-envelope-fill"
                viewBox="0 0 16 16"
              >
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
              </svg>
              SEND EMAIL
            </a>
          </li>
          <li>
            <a href="tel:60109068744" className="phone hover-target">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-telephone-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                />
              </svg>
              CALL ME
            </a>
          </li>
        </ul>
      </nav>

      <section id="home" className="home-section">
        <div className="home-linkdin">
          <a
            href="https://www.linkedin.com/in/ehsan-jolous-jamshidi-19a2b6146/"
            target="_blank"
            rel="noreferrer"
            className="link hover-target"
          >
            <img src="/images/linkdin.png" alt="LinkedIn" />
          </a>
        </div>
        <div className="home-img" ref={heroImageRef}>
          <img src="/images/Ehsan.jpg" alt="Ehsan Jolous Jamshidi" />
        </div>
        <div className="home-desc">
          <h1>
            Hello,
            <br />
            My name is Ehsan.
            <br />
            I am a{' '}
            <ins>
              <u>
                <span className="text" ref={scrambleRef}></span>
              </u>
            </ins>
            .
          </h1>
          <p>
            I use AI and automation to turn complex data into clear, actionable insights. I have
            experience in front-end development, building automation workflows, data analysis with
            Python, and working with SQL and NoSQL databases.
          </p>
        </div>
      </section>

      <div className="section-card" style={{ backgroundColor: 'rgba(252, 245, 245, 0.5)' }}>
        <div className="titles" id="educationSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            EDUCATION
          </h1>
        </div>
        <div className="education-section-div">
          <section className="education-section">
            <div className="education-timeline">
              <div className="timeline-item left">
                <div className="timeline-content">
                  <h3>Doctor of Philosophy (Environmental Technology)</h3>
                  <p>
                    Universiti Sains Malaysia, Penang, Malaysia
                    <br />
                    2021 - Present
                  </p>
                </div>
              </div>
              <div className="timeline-item right">
                <div className="timeline-content">
                  <h3>Master of Data Science &amp; Analytics</h3>
                  <p>
                    Universiti Sains Malaysia, Penang, Malaysia
                    <br />
                    2018 - 2020
                  </p>
                </div>
              </div>
              <div className="timeline-item left">
                <div className="timeline-content">
                  <h3>Bachelor of Computer Engineering Technology-Hardware</h3>
                  <p>
                    Khayyam University, Mashhad, Iran
                    <br />
                    2008 - 2011
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="titles" id="publicationsSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            PUBLICATIONS
          </h1>
        </div>
        <div className="publications-section-div">
          <section className="publications-section">
            <div className="publications-summary">
              <h3 style={{ fontWeight: 400 }}>
                <span className="highlight">
                  <strong>10 research papers</strong> and <strong>over 125 citations</strong>
                </span>
              </h3>
              <p>
                <a
                  href="https://scholar.google.com/citations?hl=en&user=35yqvLcAAAAJ&view_op=list_works"
                  target="_blank"
                  rel="noreferrer"
                  id="papers"
                  className="work-role__toggle hover-target"
                >
                  Scholar profile
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="section-card">
        <div className="titles" id="skillSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            SKILLS
          </h1>
        </div>
        <div className="skill-section-div">
          <section className="skill-section">
            <div className="skill-chart">
              <canvas id="marksChart" ref={canvasRef}></canvas>
            </div>

            <ul className="skill-links">
              {skillLabels.map(skill => (
                <li
                  key={skill.key}
                  id={skill.key}
                  onClick={() => setActiveSkill(skill.key)}
                  style={{ fontWeight: skill.key === activeSkill ? 'bold' : 400 }}
                  className="hover-target"
                >
                  {skill.label}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="section-card" style={{ backgroundColor: 'rgba(245, 247, 252, 0.5)' }}>
        <div className="titles" id="workSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            WORK EXPERIENCE
          </h1>
        </div>

        <div className="work-section-div">
          <section className="work-section">
            <article
              className={`work-role ${expandedRoles.phdResearcher ? 'is-expanded' : 'is-collapsed'}`}
            >
              <div className="work-role__summary">
                <div>
                  <h3>PhD Researcher / Project-Based Contributor</h3>
                  <p>
                    Universiti Sains Malaysia, Penang, Malaysia
                    <br />
                    Jan. 2020 – Present
                  </p>
                </div>
                <button
                  type="button"
                  className="work-role__toggle hover-target"
                  aria-expanded={expandedRoles.phdResearcher}
                  aria-controls="work-details-phd-researcher"
                  onClick={() => toggleRoleDetails('phdResearcher')}
                >
                  {expandedRoles.phdResearcher ? 'Hide details' : 'Show details'}
                </button>
              </div>
              <div
                id="work-details-phd-researcher"
                className="work-role__details"
                hidden={!expandedRoles.phdResearcher}
              >
                <p>
                  <strong>Main PhD Research:</strong> Oil Palm Yield Prediction using Machine
                  Learning and Deep Learning techniques.
                </p>
                <p>
                  Performed oil palm tree detection from drone images using YOLOv5 and Amazon
                  Rekognition.
                </p>
                <p>
                  <strong>Additional Project Contributions (under supervisor’s external
                  collaborations):</strong>
                </p>
                <ul>
                  <li>
                    Developed an automated AWS-based HPC cluster and web interface for WRF model
                    setup (Petronas), including dynamic namelist generation and workflow automation.
                  </li>
                  <li>
                    Contributed to methane emissions research (Environmental Defense Fund) by
                    developing visualizations and assisting with data interpretation.
                  </li>
                  <li>
                    Built a university chatbot for the School of Industrial Technology by scraping
                    website content, extracting structured Markdown summaries using ChatGPT,
                    storing them in Pinecone vector database, and deploying the chatbot using n8n.{' '}
                    <a
                      href="https://indtech.usm.my"
                      target="_blank"
                      rel="noreferrer"
                      id="indtech"
                      className="hover-target"
                    >
                      View the chatbot here
                    </a>
                  </li>
                  <li>
                    Developed a meeting minutes management app that extracts key discussion
                    sections and uses ChatGPT to label them by topic (e.g., students, curriculum),
                    enabling search and filtering via ChromaDB.
                  </li>
                  <li>
                    Retrieved satellite images using the NASA API via Python to support coastal and
                    agricultural research.
                  </li>
                  <li>
                    Connected a Raspberry Pi to the CEMACS weather station (Penang) data logger for
                    real-time sensor data acquisition (e.g., water temperature, radiation, wind
                    speed), converted data to GHG format, uploaded to AWS S3, transformed to CSV
                    using EC2, stored in DynamoDB, and visualized selected parameters via a custom
                    web dashboard and REST API.{' '}
                    <a
                      href="https://atmosfera.usm.my"
                      target="_blank"
                      rel="noreferrer"
                      id="atmosfera"
                      className="hover-target"
                    >
                      Atmosfera Website
                    </a>
                  </li>
                </ul>
              </div>
            </article>

            <article
              className={`work-role ${expandedRoles.iotEngineer ? 'is-expanded' : 'is-collapsed'}`}
            >
              <div className="work-role__summary">
                <div>
                  <h3>IoT Systems Engineer</h3>
                  <a
                    href="https://www.youtube.com/shorts/NAvs-EaTwQw"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="bms"
                    className="work-role__link-button hover-target"
                  >
                    product demo
                  </a>
                  <p>
                    Cyan System, Mashhad, Iran
                    <br />
                    Sep 2015 – Aug 2017
                  </p>
                </div>
                <button
                  type="button"
                  className="work-role__toggle hover-target"
                  aria-expanded={expandedRoles.iotEngineer}
                  aria-controls="work-details-iot-engineer"
                  onClick={() => toggleRoleDetails('iotEngineer')}
                >
                  {expandedRoles.iotEngineer ? 'Hide details' : 'Show details'}
                </button>
              </div>
              <div
                id="work-details-iot-engineer"
                className="work-role__details"
                hidden={!expandedRoles.iotEngineer}
              >
                <p>Co-founded a start-up to develop a wireless building management system</p>
                <ul>
                  <li>Designed and built a mobile app using PhoneGap.</li>
                  <li>
                    Developed a user dashboard with HTML, CSS, and JavaScript to monitor system
                    activity.
                  </li>
                  <li>Programmed AVR microcontrollers and integrated various sensors.</li>
                </ul>
              </div>
            </article>

            <article
              className={`work-role ${expandedRoles.itHelpDesk ? 'is-expanded' : 'is-collapsed'}`}
            >
              <div className="work-role__summary">
                <div>
                  <h3>Information Technology Help Desk</h3>
                  <p>
                    Rhine Engineering Pvt. Ltd., Tehran, Iran
                    <br />
                    Aug 2012 – Sep 2015
                  </p>
                </div>
                <button
                  type="button"
                  className="work-role__toggle hover-target"
                  aria-expanded={expandedRoles.itHelpDesk}
                  aria-controls="work-details-it-help-desk"
                  onClick={() => toggleRoleDetails('itHelpDesk')}
                >
                  {expandedRoles.itHelpDesk ? 'Hide details' : 'Show details'}
                </button>
              </div>
              <div
                id="work-details-it-help-desk"
                className="work-role__details"
                hidden={!expandedRoles.itHelpDesk}
              >
                <ul>
                  <li>Designed and maintained the company website.</li>
                  <li>Monitored and supported computer systems and network infrastructure.</li>
                  <li>
                    Installed, tested, and configured new software, hardware, and printers; trained
                    staff on their use.
                  </li>
                </ul>
              </div>
            </article>

            <article
              className={`work-role ${expandedRoles.roboticTutor ? 'is-expanded' : 'is-collapsed'}`}
            >
              <div className="work-role__summary">
                <div>
                  <h3>Robotic Tutor</h3>
                  <p>
                    Khayyam University, Mashhad, Iran
                    <br />
                    Apr. 2011 - Jan. 2012
                  </p>
                </div>
                <button
                  type="button"
                  className="work-role__toggle hover-target"
                  aria-expanded={expandedRoles.roboticTutor}
                  aria-controls="work-details-robotic-tutor"
                  onClick={() => toggleRoleDetails('roboticTutor')}
                >
                  {expandedRoles.roboticTutor ? 'Hide details' : 'Show details'}
                </button>
              </div>
              <div
                id="work-details-robotic-tutor"
                className="work-role__details"
                hidden={!expandedRoles.roboticTutor}
              >
                <ul>
                  <li>
                    Instructed a small group of students in core robotics engineering principles.
                  </li>
                  <li>Coached and mentored students for robotics competitions.</li>
                </ul>
              </div>
            </article>
          </section>
        </div>
      </div>

      <div className="section-card">
        <div className="titles" id="volunteerSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            VOLUNTEER &amp; INTERNSHIP
          </h1>
        </div>
        <div className="work-section-div">
          <section className="work-section">
            <article
              className={`work-role ${expandedRoles.aiTechIntern ? 'is-expanded' : 'is-collapsed'}`}
            >
              <div className="work-role__summary">
                <div>
                  <h3>AI &amp; Technology Intern</h3>
                  <p>
                    Dainichi Hanso Co., Ltd., Osaka, Japan
                    <br />
                    Nov 2025 - Dec 2025
                  </p>
                </div>
                <button
                  type="button"
                  className="work-role__toggle hover-target"
                  aria-expanded={expandedRoles.aiTechIntern}
                  aria-controls="work-details-ai-tech-intern"
                  onClick={() => toggleRoleDetails('aiTechIntern')}
                >
                  {expandedRoles.aiTechIntern ? 'Hide details' : 'Show details'}
                </button>
              </div>
              <div
                id="work-details-ai-tech-intern"
                className="work-role__details"
                hidden={!expandedRoles.aiTechIntern}
              >
                <p>
                  Selected by Japan&apos;s METI global talent program (14,000+ applicants) to deliver
                  an AI-powered inspection workflow for injection molded resin products.
                </p>
                <ul>
                  <li>
                    Built a YOLOv12 + OpenCV inspection pipeline detecting voids, dark spots, and
                    color inconsistencies.
                  </li>
                  <li>
                    Integrated Raspberry Pi and Arduino hardware for real-time communication with
                    industrial devices.
                  </li>
                  <li>
                    Designed a monitoring dashboard for defect counts, inspection statistics, and
                    configurable parameters.
                  </li>
                  <li>
                    Developed a bilingual real-time communication app using OpenAI Realtime API for
                    live speech-to-text, translation, and summarization.
                  </li>
                </ul>
              </div>
            </article>

            <article
              className={`work-role ${
                expandedRoles.hardwareSoftwareSpecialist ? 'is-expanded' : 'is-collapsed'
              }`}
            >
              <div className="work-role__summary">
                <div>
                  <h3>Hardware &amp; Software Specialist</h3>
                  <p>
                    Penang Science Cluster, Penang, Malaysia
                    <br />
                    Mar 2019 – Jan 2020
                  </p>
                </div>
                <button
                  type="button"
                  className="work-role__toggle hover-target"
                  aria-expanded={expandedRoles.hardwareSoftwareSpecialist}
                  aria-controls="work-details-hardware-software-specialist"
                  onClick={() => toggleRoleDetails('hardwareSoftwareSpecialist')}
                >
                  {expandedRoles.hardwareSoftwareSpecialist ? 'Hide details' : 'Show details'}
                </button>
              </div>
              <div
                id="work-details-hardware-software-specialist"
                className="work-role__details"
                hidden={!expandedRoles.hardwareSoftwareSpecialist}
              >
                <ul>
                  <li>Developed an Android app for volunteer event registration with QR check-ins.</li>
                  <li>
                    Automated volunteer data storage and retrieval in Google Sheets via Google Apps
                    Script.
                  </li>
                  <li>Built an Electron-based voting application with a Python back end.</li>
                  <li>Integrated fingerprint sensors for secure participant verification.</li>
                  <li>Mentored students in PSC competitions with technical implementation support.</li>
                </ul>
              </div>
            </article>
          </section>
        </div>
      </div>

      <div className="section-card" style={{ backgroundColor: 'rgba(250, 252, 245, 0.5)' }}>
        <div className="titles">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            FREELANCE
          </h1>
        </div>
        <div className="work-section-div">
          <section className="work-section">
            <div className="freelance-grid">
              <article className="freelance-card">
                <div className="freelance-card__header">
                  <h3>OilPalm Analytics Hub</h3>
                </div>
                <p className="freelance-card__summary">
                  Interactive analytics portal for research teams to explore field insights and
                  publish weekly reports.
                </p>
                <div className="freelance-card__meta">
                  <span>Dashboards</span>
                  <span>Visualization</span>
                  <span>Research</span>
                </div>
                <a
                  href="https://oilpalm.usm.my"
                  target="_blank"
                  rel="noreferrer"
                  className="freelance-card__link animated-link hover-target"
                >
                  Visit project
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </article>

              <article className="freelance-card">
                <div className="freelance-card__header">
                  <h3>Mddtextile Website</h3>
                </div>
                <p className="freelance-card__summary">
                  Modern storefront experience focused on materials, product categories, and a
                  clean editorial feel.
                </p>
                <div className="freelance-card__meta">
                  <span>UI refresh</span>
                  <span>Responsive</span>
                  <span>Merchandise</span>
                </div>
                <a
                  href="http://mddtextile.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="freelance-card__link animated-link hover-target"
                >
                  View site
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </article>

              <article className="freelance-card">
                <div className="freelance-card__header">
                  <h3>Japanese Verb Conjugator</h3>
                </div>
                <p className="freelance-card__summary">
                  Fast conjugation lookups with practice flows that keep learners focused and
                  confident.
                </p>
                <div className="freelance-card__meta">
                  <span>Search UX</span>
                  <span>Learning</span>
                  <span>Web app</span>
                </div>
                <a
                  href="https://nihonary.com"
                  target="_blank"
                  rel="noreferrer"
                  className="freelance-card__link animated-link hover-target"
                >
                  Explore app
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </article>

              <article className="freelance-card">
                <div className="freelance-card__header">
                  <h3>Creative &amp; Product Builds</h3>
                </div>
                <p className="freelance-card__summary">
                  Graphic design, embedded hardware, robotics, and custom launches tailored to
                  ambitious briefs.
                </p>
                <div className="freelance-card__meta">
                  <span>Design</span>
                  <span>Embedded</span>
                  <span>Prototyping</span>
                </div>
                <span className="freelance-card__note">Available on request</span>
              </article>
            </div>
          </section>
        </div>
      </div>

      <div className="section-card">
        <div className="titles" id="demoGallerySection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            DEMO GALLERY
          </h1>
        </div>
        <div className="work-section-div">
          <section className="work-section">
            <div className="demo-gallery">
              {demoGalleryItems.map((item, index) => (
                <article
                  key={item.title}
                  className={`demo-card${index % 2 === 1 ? ' demo-card--reversed' : ''}`}
                >
                  <div className="demo-card__content">
                    <span className="demo-card__badge">{item.badge}</span>
                    <span className="demo-card__eyebrow">Featured demo</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <a
                      href={item.ctaHref}
                      target="_blank"
                      rel="noreferrer"
                      className="work-role__link-button hover-target"
                    >
                      {item.ctaLabel}
                    </a>
                  </div>
                  <div className="demo-card__media">
                    {item.mediaType === 'video' ? (
                      <video controls poster={item.mediaPoster}>
                        <source src={item.mediaSrc} type="video/mp4" />
                        Your browser does not support HTML5 video.
                      </video>
                    ) : (
                      <img src={item.mediaSrc} alt={item.mediaAlt} />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="section-card achievement-section-card">
        <div className="titles" id="activitiesSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            ACHIEVEMENTS
          </h1>
        </div>
        <section className="achievements-section">
          <div className="achievements-intro">
            <div>
              <p className="achievements-kicker">Milestones &amp; leadership</p>
              <h2>Competitive highlights and team contributions.</h2>
            </div>
            <p className="achievements-lead">
              A curated selection of awards, placements, and roles that shaped my experience in
              robotics competitions and leadership programs.
            </p>
          </div>
          <div className="achievements-grid">
            <article className="achievements-track">
              <header className="achievements-track__header">
                <span>Competitions</span>
                <h3>Competitor Achievements</h3>
                <p>High-impact placements across provincial and national robotics contests.</p>
              </header>
              <div className="achievements-track__items">
                <div className="achievement-card">
                  <div className="achievement-card__year">2009</div>
                  <div className="achievement-card__body">
                    <h4>ARC Cup Provincial Robotics</h4>
                    <p>1st place · Mashhad</p>
                  </div>
                  <span className="achievement-card__badge">Gold</span>
                </div>
                <div className="achievement-card">
                  <div className="achievement-card__year">2008</div>
                  <div className="achievement-card__body">
                    <h4>National Robotic Competitions</h4>
                    <p>3rd place · Birjand</p>
                  </div>
                  <span className="achievement-card__badge achievement-card__badge--bronze">
                    Bronze
                  </span>
                </div>
                <div className="achievement-card">
                  <div className="achievement-card__year">2010</div>
                  <div className="achievement-card__body">
                    <h4>Line-Follower Robot Contest</h4>
                    <p>5th place · Amir Kabir University</p>
                  </div>
                  <span className="achievement-card__badge achievement-card__badge--finalist">
                    Finalist
                  </span>
                </div>
              </div>
            </article>
            <article className="achievements-track">
              <header className="achievements-track__header">
                <span>Leadership</span>
                <h3>Team &amp; Leadership Roles</h3>
                <p>Hands-on collaboration and officiating roles in academic competitions.</p>
              </header>
              <div className="achievements-track__items">
                <div className="achievement-card">
                  <div className="achievement-card__year achievement-card__year--range">
                    2010
                    <span>–2011</span>
                  </div>
                  <div className="achievement-card__body">
                    <h4>Khayam University Robotics Team</h4>
                    <p>Team Member · Mashhad</p>
                  </div>
                  <span className="achievement-card__badge achievement-card__badge--team">
                    Core
                  </span>
                </div>
                <div className="achievement-card">
                  <div className="achievement-card__year">2012</div>
                  <div className="achievement-card__body">
                    <h4>Azad University Robotic Competitions</h4>
                    <p>Technical Referee · Ghoochan</p>
                  </div>
                  <span className="achievement-card__badge achievement-card__badge--mentor">
                    Mentor
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <div className="section-card">
        <div className="titles" id="certificatesSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            CERTIFICATES
          </h1>
        </div>
        <div className="certificates-section-div">
          <section className="certificates-section">
            <header className="certificates-intro">
              <div>
                <span className="certificates-kicker">Professional Learning</span>
                <h2>Credentials &amp; Continuous Training</h2>
              </div>
              <p className="certificates-lead">
                A curated mix of cloud certifications and foundational IT credentials that highlight
                ongoing technical growth.
              </p>
            </header>
            <div className="certificates-grid">
              <article className="certificate-card">
                <div className="certificate-card__meta">
                  <span className="certificate-card__year">2022</span>
                </div>
                <h3>Architecting on AWS</h3>
                <p className="certificate-card__provider">Trainocate</p>
                <p>Deep dive into designing scalable, resilient cloud infrastructure.</p>
                <a
                  href="/images/certificate/CourseCert_TM20923.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="AWS1"
                  className="certificate-card__link hover-target"
                >
                  View certificate
                </a>
                <span className="certificate-card__badge">Cloud</span>
              </article>
              <article className="certificate-card">
                <div className="certificate-card__meta">
                  <span className="certificate-card__year">2022</span>
                </div>
                <h3>AWS Technical Essentials</h3>
                <p className="certificate-card__provider">Trainocate</p>
                <p>Core AWS services, shared responsibility, and architectural basics.</p>
                <a
                  href="/images/certificate/CourseCert_TM20924.pdf"
                  target="_blank"
                  rel="noreferrer"
                  id="AWS2"
                  className="certificate-card__link hover-target"
                >
                  View certificate
                </a>
                <span className="certificate-card__badge">AWS</span>
              </article>
              <article className="certificate-card">
                <div className="certificate-card__meta">
                  <span className="certificate-card__year">2020</span>
                </div>
                <h3>Cloud Computing Basics (Cloud 101)</h3>
                <p className="certificate-card__provider">Coursera</p>
                <p>Cloud fundamentals, service models, and practical adoption guidance.</p>
                <a
                  href="https://www.coursera.org/account/accomplishments/verify/YQY7U8H62873"
                  target="_blank"
                  rel="noreferrer"
                  id="cloud"
                  className="certificate-card__link hover-target"
                >
                  Verify credential
                </a>
                <span className="certificate-card__badge">Cloud</span>
              </article>
              <article className="certificate-card">
                <div className="certificate-card__meta">
                  <span className="certificate-card__year">2019</span>
                </div>
                <h3>Statistical Hypothesis Testing &amp; Data Analysis</h3>
                <p className="certificate-card__provider">Universiti Sains Malaysia</p>
                <p>Applied statistical inference and analytical decision-making methods.</p>
                <span className="certificate-card__badge">Data</span>
              </article>
              <article className="certificate-card">
                <div className="certificate-card__meta">
                  <span className="certificate-card__year">2013</span>
                </div>
                <h3>Microsoft Certified IT Professional (MCITP)</h3>
                <p className="certificate-card__provider">Pasargad Informatic Institute</p>
                <p>Enterprise administration skills across Microsoft server technologies.</p>
                <span className="certificate-card__badge">Microsoft</span>
              </article>
              <article className="certificate-card">
                <div className="certificate-card__meta">
                  <span className="certificate-card__year">2013</span>
                </div>
                <h3>CompTIA Network +</h3>
                <p className="certificate-card__provider">Pasargad Informatic Institute</p>
                <p>Core networking concepts, troubleshooting, and infrastructure support.</p>
                <span className="certificate-card__badge">Networking</span>
              </article>
            </div>
          </section>
        </div>
      </div>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__cta">
            <span className="site-footer__eyebrow">Collaborate</span>
            <h2>Let&#39;s work together to build something meaningful.</h2>
            <p className="site-footer__quote">
              “Thoughtful design, clear data, and human-centered solutions.”
            </p>
            <span className="site-footer__spark" aria-hidden="true"></span>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p>© 2025 Ehsan Jolous Jamshidi. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
