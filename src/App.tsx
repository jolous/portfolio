import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import TextScramble from './utils/textScramble';
import { skillOrder, skills, type SkillKey, type SkillLabel } from './data/skills';
import Card from './components/Card';
import Timeline from './components/Timeline';
import { educationItems } from './data/education';
import { experienceItems } from './data/experience';

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
          size: 14
        }
      },
      grid: {
        display: true
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
        backgroundColor: 'rgba(20, 255, 226,.5)',
        borderColor: 'rgba(0, 0, 0,1)',
        borderWidth: 4,
        radius: 4,
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

export default function App() {
  const [activeSkill, setActiveSkill] = useState<SkillKey>('skillGeneral');
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const scrambleRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.body.offsetHeight - window.innerHeight);
      document.body.style.setProperty('--scroll', `${progress}`);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      <section id="home" className="home-section section container">
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
        <div className="home-img">
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

      <div style={{ backgroundColor: 'rgba(252, 245, 245, 0.5)' }} className="section">
        <div className="titles container" id="educationSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            EDUCATION
          </h1>
        </div>
        <div className="education-section-div">
          <section className="education-section container">
            <Card
              title="Education &amp; publications"
              subtitle="Academic timeline and research output"
              className="education-card"
            >
              <Timeline items={educationItems} className="timeline--centered" />
              <div className="education-publications" id="publicationsSection">
                <h3>Publications</h3>
                <p>
                  <strong>9 research papers</strong> and <strong>over 80 citations</strong>
                </p>
                <a
                  href="https://scholar.google.com/citations?hl=en&user=35yqvLcAAAAJ&view_op=list_works"
                  target="_blank"
                  rel="noreferrer"
                  id="papers"
                  className="publication-button hover-target"
                >
                  View publications
                </a>
              </div>
            </Card>
            <div className="education-publications" id="publicationsSection">
              <h2>Publications</h2>
              <Card
                title="Research publications"
                subtitle="Research output snapshot"
                className="publication-card"
              >
                <p>
                  <strong>9 research papers</strong> and <strong>over 80 citations</strong>
                </p>
                <a
                  href="https://scholar.google.com/citations?hl=en&user=35yqvLcAAAAJ&view_op=list_works"
                  target="_blank"
                  rel="noreferrer"
                  id="papers"
                  className="hover-target"
                >
                  View publications
                </a>
              </Card>
            </div>
          </section>
        </div>
      </div>

      <div className="titles container" id="skillSection">
        <h1 className="separator" style={{ fontWeight: 400 }}>
          SKILLS
        </h1>
      </div>
      <div className="skill-section-div section">
        <section className="skill-section container card-grid">
          <Card title="Skill radar" subtitle="Visual overview of the highlighted capability">
            <div className="skill-chart" style={{ zIndex: -999 }}>
              <canvas id="marksChart" ref={canvasRef}></canvas>
            </div>
          </Card>
          <Card title="Skill categories" subtitle="Select a category to update the chart">
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
          </Card>
        </section>
      </div>

      <div style={{ backgroundColor: 'rgba(245, 247, 252, 0.5)' }} className="section">
        <div className="titles container" id="workSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            WORK EXPERIENCE
          </h1>
        </div>

        <div className="work-section-div">
          <section className="work-section container">
            <Timeline items={experienceItems} />
          </section>
        </div>
      </div>

      <div className="titles container" id="volunteerSection">
        <h1 className="separator" style={{ fontWeight: 400 }}>
          VOLUNTEER
        </h1>
      </div>
      <div className="work-section-div section">
        <section className="work-section container section-content">
          <Card
            title="Hardware &amp; Software Specialist"
            subtitle="Penang Science Cluster, Penang, Malaysia · Mar 2019 – Jan 2020"
          >
            <ul>
              <li>Developed an Android app for volunteer event registration using QR-code scanning.</li>
              <li>
                Automated volunteer data storage and retrieval in Google Sheets via Google Apps
                Script.
              </li>
              <li>Built an Electron-based voting application with a Python back end.</li>
              <li>Integrated and configured fingerprint sensor modules for attendee verification.</li>
              <li>Mentored students in various PSC-hosted competitions.</li>
            </ul>
          </Card>
        </section>
      </div>

      <div style={{ backgroundColor: 'rgba(250, 252, 245, 0.5)' }} className="section">
        <div className="titles container">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            FREELANCE
          </h1>
        </div>
        <div className="work-section-div">
          <section className="work-section container section-content">
            <Card title="Freelance portfolio" subtitle="Selected client and personal projects">
              <ul>
                <li>
                  <a
                    href="https://oilpalm.usm.my"
                    target="_blank"
                    rel="noreferrer"
                    id="oilpalm"
                    className="hover-target"
                  >
                    OilPalm Analytics Hub
                  </a>
                </li>
                <li>
                  <a
                    href="http://mddtextile.com/"
                    target="_blank"
                    rel="noreferrer"
                    id="mdd"
                    className="hover-target"
                  >
                    Mddtextile Website
                  </a>
                </li>
                <li>
                  <a
                    href="https://nihonary.com"
                    target="_blank"
                    rel="noreferrer"
                    id="nihonary"
                    className="hover-target"
                  >
                    Japanese Verb Conjugator
                  </a>
                </li>
                <li>Graphic design projects.</li>
                <li>Embedded hardware, robotics, and application development.</li>
              </ul>
            </Card>
          </section>
        </div>
      </div>

      <div className="titles container" id="demoGallerySection">
        <h1 className="separator" style={{ fontWeight: 400 }}>
          DEMO GALLERY
        </h1>
      </div>
      <div className="work-section-div section">
        <section className="work-section container section-content">
          <Card title="CEMACS visualization" subtitle="Daily-updated atmosphere/coastal monitoring">
            <p>
              Daily-updated and interactive visualization of parameters measured for the
              atmosphere-coastal ocean experiment at the Centre for Marine and Coastal Studies
              (CEMACS) USM.
            </p>
            <div style={{ display: 'block', textAlign: 'center' }}>
              <img
                src="/images/demo/atmosfera.png"
                alt="CEMACS Interactive Visualization"
                style={{ width: '100%', maxWidth: '600px', height: 'auto', display: 'block', margin: '0 auto' }}
              />
            </div>
            <div style={{ display: 'block', textAlign: 'center' }}>
              <span id="animated-link">
                <a
                  href="https://atmosfera.usm.my/visualization.html"
                  target="_blank"
                  rel="noreferrer"
                  id="vizOverview"
                  className="hover-target"
                >
                  View Daily-Updated Interactive Visualizations<span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </span>
            </div>
          </Card>
          <Card title="EDF sunburst chart" subtitle="IPCC methane emission factors for Malaysia">
            <p>
              An interactive Plotly sunburst chart mapping IPCC methane emission factors across
              Malaysia built for Environmental Defense Fund (EDF).
            </p>
            <div style={{ display: 'block', textAlign: 'center' }}>
              <img
                src="/images/demo/sunburst.png"
                alt="EDF Sunburst Visualization"
                style={{ width: '100%', maxWidth: '600px', height: 'auto', display: 'block', margin: '0 auto' }}
              />
            </div>
            <div style={{ display: 'block', textAlign: 'center' }}>
              <span id="animated-link">
                <a
                  href="/demo/sunburst_plot.html"
                  target="_blank"
                  rel="noreferrer"
                  id="sunburstDemo"
                  className="hover-target"
                >
                  View Interactive Sunburst Chart<span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </span>
            </div>
          </Card>
          <Card title="YOLOv5 detection demo" subtitle="Oil palm tree detection video">
            <p>Oil palm tree detection showcase using YOLOv5 on recorded drone video.</p>
            <div style={{ textAlign: 'center' }}>
              <video
                controls
                poster="/images/demo/oilpalm_detection.png"
                style={{ maxWidth: '100%', width: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
              >
                <source src="/images/demo/oilpalm_detection.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>
          </Card>
        </section>
      </div>

      <div style={{ backgroundColor: 'rgba(252, 245, 245, 0.5)' }} className="section">
        <div className="titles container" id="activitiesSection">
          <h1 className="separator" style={{ fontWeight: 400 }}>
            ACHIEVEMENTS
          </h1>
        </div>
        <div className="education-section-div">
          <section className="education-section container section-content">
            <Card title="Competitor achievements" subtitle="Robotics competitions">
              <ul>
                <li>
                  <strong>2009 (Mashhad)</strong>: 1st place, ARC Cup Provincial Robotics
                </li>
                <li>
                  <strong>2008 (Birjand)</strong>: 3rd place, National Robotic Competitions
                </li>
                <li>
                  <strong>2010 (Tehran)</strong>: 5th place, Line-Follower Robot contest at Amir
                  Kabir University
                </li>
              </ul>
            </Card>
            <Card title="Team &amp; leadership roles" subtitle="Technical mentorship and judging">
              <ul>
                <li>
                  <strong>2010–2011 (Mashhad)</strong>: Team Member, Khayam University Robotics Team
                </li>
                <li>
                  <strong>2012 (Ghoochan)</strong>: Technical Referee, Azad University Robotic
                  Competitions
                </li>
              </ul>
            </Card>
          </section>
        </div>
      </div>

      <div className="titles container" id="certificatesSection">
        <h1 className="separator" style={{ fontWeight: 400 }}>
          CERTIFICATES
        </h1>
      </div>
      <div className="work-section-div section">
        <section className="work-section container section-content">
          <Card title="Professional certificates" subtitle="Coursework and credentials">
            <ul>
              <li>
                <a
                  href="/images/certificate/CourseCert_TM20923.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="AWS1"
                  className="hover-target"
                >
                  <strong>Architecting on AWS</strong>
                </a>{' '}
                | Trainocate (2022)
              </li>
              <li>
                <a
                  href="/images/certificate/CourseCert_TM20924.pdf"
                  target="_blank"
                  rel="noreferrer"
                  id="AWS2"
                  className="hover-target"
                >
                  <strong>AWS Technical Essentials</strong>
                </a>
                | Trainocate (2022)
              </li>
              <li>
                <a
                  href="https://www.coursera.org/account/accomplishments/verify/YQY7U8H62873"
                  target="_blank"
                  rel="noreferrer"
                  id="cloud"
                  className="hover-target"
                >
                  <strong>Cloud Computing Basics (Cloud 101)</strong>
                </a>{' '}
                | Coursera (2020)
              </li>
              <li>
                <strong>Statistical Hypothesis Testing &amp; Data Analysis</strong> | Universiti Sains
                Malaysia (2019)
              </li>
              <li>
                <strong>Microsoft Certified IT Professional (MCITP)</strong> | Pasargad Informatic
                Institute (2013)
              </li>
              <li>
                <strong>CompTIA Network +</strong> | Pasargad Informatic Institute (2013)
              </li>
            </ul>
          </Card>
        </section>
      </div>

      <div className="Copyright-section-div section">
        <section className="Copyright-section container">
          <p>Copyright © 2025 Ehsan Jolous Jamshidi. All Rights Reserved</p>
        </section>
      </div>
    </>
  );
}
