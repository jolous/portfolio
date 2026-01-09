import type { TimelineItem } from '../components/Timeline';

export const experienceItems: TimelineItem[] = [
  {
    id: 'robotic-tutor',
    title: 'Robotic Tutor',
    subtitle: 'Khayyam University, Mashhad, Iran',
    dateLabel: 'Apr 2011 - Jan 2012',
    startDate: '2011-04-01',
    content: (
      <ul>
        <li>Instructed a small group of students in core robotics engineering principles.</li>
        <li>Coached and mentored students for robotics competitions.</li>
      </ul>
    ),
  },
  {
    id: 'it-help-desk',
    title: 'Information Technology Help Desk',
    subtitle: 'Rhine Engineering Pvt. Ltd., Tehran, Iran',
    dateLabel: 'Aug 2012 - Sep 2015',
    startDate: '2012-08-01',
    content: (
      <ul>
        <li>Designed and maintained the company website.</li>
        <li>Monitored and supported computer systems and network infrastructure.</li>
        <li>
          Installed, tested, and configured new software, hardware, and printers; trained staff on
          their use.
        </li>
      </ul>
    ),
  },
  {
    id: 'iot-systems-engineer',
    title: 'IoT Systems Engineer',
    subtitle: 'Cyan System, Mashhad, Iran',
    dateLabel: 'Sep 2015 - Aug 2017',
    startDate: '2015-09-01',
    content: (
      <>
        <p>Co-founded a start-up to develop a wireless building management system.</p>
        <ul>
          <li>Designed and built a mobile app using PhoneGap.</li>
          <li>Developed a user dashboard with HTML, CSS, and JavaScript to monitor system activity.</li>
          <li>Programmed AVR microcontrollers and integrated various sensors.</li>
        </ul>
      </>
    ),
    footer: (
      <a
        href="https://www.youtube.com/shorts/NAvs-EaTwQw"
        target="_blank"
        rel="noopener noreferrer"
        id="bms"
        className="hover-target"
      >
        product demo
      </a>
    ),
  },
  {
    id: 'phd-researcher',
    title: 'PhD Researcher / Project-Based Contributor',
    subtitle: 'Universiti Sains Malaysia, Penang, Malaysia',
    dateLabel: 'Jan 2020 - Present',
    startDate: '2020-01-01',
    content: (
      <>
        <p>
          <strong>Main PhD Research:</strong> Oil Palm Yield Prediction using Machine Learning and
          Deep Learning techniques.
        </p>
        <p>
          Performed oil palm tree detection from drone images using YOLOv5 and Amazon Rekognition.
        </p>
        <p>
          <strong>Additional Project Contributions (under supervisor’s external collaborations):</strong>
        </p>
        <ul>
          <li>
            Developed an automated AWS-based HPC cluster and web interface for WRF model setup
            (Petronas), including dynamic namelist generation and workflow automation.
          </li>
          <li>
            Contributed to methane emissions research (Environmental Defense Fund) by developing
            visualizations and assisting with data interpretation.
          </li>
          <li>
            Built a university chatbot for the School of Industrial Technology by scraping website
            content, extracting structured Markdown summaries using ChatGPT, storing them in Pinecone
            vector database, and deploying the chatbot using n8n.{' '}
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
            Developed a meeting minutes management app that extracts key discussion sections and
            uses ChatGPT to label them by topic (e.g., students, curriculum), enabling search and
            filtering via ChromaDB.
          </li>
          <li>
            Retrieved satellite images using the NASA API via Python to support coastal and
            agricultural research.
          </li>
          <li>
            Connected a Raspberry Pi to the CEMACS weather station (Penang) data logger for real-time
            sensor data acquisition (e.g., water temperature, radiation, wind speed), converted data
            to GHG format, uploaded to AWS S3, transformed to CSV using EC2, stored in DynamoDB, and
            visualized selected parameters via a custom web dashboard and REST API.{' '}
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
      </>
    ),
  },
];
