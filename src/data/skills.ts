export type SkillLabel = string | [string, string];

export type SkillKey =
  | 'skillGeneral'
  | 'skillProgramming'
  | 'skillData'
  | 'skillWeb'
  | 'skillOther';

interface SkillDefinition {
  label: string;
  labels: SkillLabel[];
  data: number[];
}

export const skills: Record<SkillKey, SkillDefinition> = {
  skillGeneral: {
    label: 'SOFT SKILLS',
    labels: [
      'Teamwork',
      'Communication',
      'Mentoring',
      'Problem-Solving',
      'Adaptability',
      'Customer-Centric Mindset',
      'Presentation & Storytelling'
    ],
    data: [95, 90, 80, 80, 100, 90, 90]
  },
  skillProgramming: {
    label: 'DATA SCIENCE & ANALYTICS',
    labels: [
      ['Programming', '(Python, R)'],
      ['AI', '(ML, DL)'],
      ['NLP', '(spaCy, NLTK)'],
      'Statistical Analysis',
      'Data Engineering',
      ['Database', '(DynamoDB, MongoDB, SQLite, PostgreSQL)'],
      ['Vector Database', '(ChromaDB, Pinecone)'],
      ['Visualization', '(Plotly, matplotlib, seaborn, Tableau)'],
      ['MLOps & Deployment', '(Docker, AWS SageMaker)'],
      ['Tools & Environments', '(Jupyter Notebooks, VS Code)']
    ],
    data: [85, 80, 70, 50, 70, 80, 80, 90, 65, 80]
  },
  skillData: {
    label: 'AWS CLOUD SERVICES',
    labels: [
      ['Compute & Serverless', '(AWS Cloud9, Lambda, API Gateway)'],
      ['Storage & Messaging', '(S3, SNS, EventBridge)'],
      ['Security & Monitoring', '(Cognito, CloudWatch)'],
      ['Computer Vision & Document AI', '(Amazon Rekognition, Textract)']
    ],
    data: [85, 90, 70, 60]
  },
  skillWeb: {
    label: 'Web Development',
    labels: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'cPanel', 'Apache Server', 'RESTful API'],
    data: [95, 70, 60, 85, 70, 65, 70]
  },
  skillOther: {
    label: 'OTHER TECHNICAL SKILLS',
    labels: [
      ['Programming', '(C++, C#, Java)'],
      ['Systems & DevOps', '(Linux server administration, Network+)'],
      ['Design', '(Photoshop, Illustrator, Corel Draw)'],
      ['Embedded & IoT', '(AVR & Arduino microcontroller programming)'],
      ['Hobbies', '(Photography, Personal App Development, Gaming)']
    ],
    data: [40, 60, 60, 70, 70]
  }
};

export const skillOrder: SkillKey[] = [
  'skillGeneral',
  'skillProgramming',
  'skillData',
  'skillWeb',
  'skillOther'
];
