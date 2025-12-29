import { ExamAttempt, Question } from "./utils";

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Which pillars of the AWS Well-Architected Framework address non-functional requirements? (Select two)",
    type: "multiple",
    options: [
      { id: 1, text: "Performance Efficiency" },
      { id: 2, text: "Security" },
      { id: 3, text: "Cost Optimization" },
      { id: 4, text: "Operational Excellence" },
      { id: 5, text: "Reliability" },
    ],
    correctAnswers: [3, 4],
    explanation:
      "Cost Optimization and Operational Excellence are the pillars that address non-functional requirements in the AWS Well-Architected Framework.",
  },
  {
    id: 2,
    text: "What is the primary benefit of using Amazon S3?",
    type: "single",
    options: [
      { id: 1, text: "Scalable object storage" },
      { id: 2, text: "Relational database" },
      { id: 3, text: "Compute capacity" },
      { id: 4, text: "Network load balancing" },
    ],
    correctAnswers: [1],
    explanation:
      "Amazon S3 (Simple Storage Service) provides scalable object storage for any amount of data.",
  },
  {
    id: 3,
    text: "Which AWS service provides managed NoSQL database?",
    type: "single",
    options: [
      { id: 1, text: "Amazon RDS" },
      { id: 2, text: "Amazon DynamoDB" },
      { id: 3, text: "Amazon Redshift" },
      { id: 4, text: "Amazon Aurora" },
    ],
    correctAnswers: [2],
    explanation:
      "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance.",
  },
  {
    id: 4,
    text: "Which of the following are benefits of AWS Lambda? (Select two)",
    type: "multiple",
    options: [
      { id: 1, text: "No servers to manage" },
      { id: 2, text: "Continuous scaling" },
      { id: 3, text: "Fixed monthly pricing" },
      { id: 4, text: "Manual capacity planning required" },
      { id: 5, text: "Limited to Java runtime" },
    ],
    correctAnswers: [1, 2],
    explanation:
      "AWS Lambda allows you to run code without managing servers and automatically scales based on demand.",
  },
  {
    id: 5,
    text: "What does EC2 stand for?",
    type: "single",
    options: [
      { id: 1, text: "Elastic Compute Cloud" },
      { id: 2, text: "Enhanced Computing Capability" },
      { id: 3, text: "Elastic Container Cloud" },
      { id: 4, text: "Enterprise Compute Cluster" },
    ],
    correctAnswers: [1],
    explanation:
      "EC2 stands for Elastic Compute Cloud, AWS's virtual server hosting service.",
  },
  {
    id: 6,
    text: "Which services are part of AWS's compute offerings? (Select two)",
    type: "multiple",
    options: [
      { id: 1, text: "Amazon EC2" },
      { id: 2, text: "Amazon S3" },
      { id: 3, text: "AWS Lambda" },
      { id: 4, text: "Amazon RDS" },
      { id: 5, text: "Amazon CloudWatch" },
    ],
    correctAnswers: [1, 3],
    explanation:
      "Amazon EC2 and AWS Lambda are compute services. S3 is storage, RDS is database, and CloudWatch is monitoring.",
  },
  {
    id: 7,
    text: "What is the AWS global infrastructure component that consists of one or more discrete data centers?",
    type: "single",
    options: [
      { id: 1, text: "Availability Zone" },
      { id: 2, text: "Region" },
      { id: 3, text: "Edge Location" },
      { id: 4, text: "Virtual Private Cloud" },
    ],
    correctAnswers: [1],
    explanation:
      "An Availability Zone (AZ) is one or more discrete data centers with redundant power, networking, and connectivity.",
  },
  {
    id: 8,
    text: "Which of the following are characteristics of cloud computing? (Select two)",
    type: "multiple",
    options: [
      { id: 1, text: "Trade capital expense for variable expense" },
      { id: 2, text: "Benefit from massive economies of scale" },
      { id: 3, text: "Guess about capacity needs" },
      { id: 4, text: "Maintain physical servers" },
      { id: 5, text: "High upfront costs" },
    ],
    correctAnswers: [1, 2],
    explanation:
      "Cloud computing allows trading capital expense for variable expense and benefits from economies of scale.",
  },
  {
    id: 9,
    text: "Which AWS service is used for content delivery network (CDN)?",
    type: "single",
    options: [
      { id: 1, text: "Amazon Route 53" },
      { id: 2, text: "Amazon CloudFront" },
      { id: 3, text: "AWS Direct Connect" },
      { id: 4, text: "Amazon API Gateway" },
    ],
    correctAnswers: [2],
    explanation:
      "Amazon CloudFront is AWS's content delivery network (CDN) service that speeds up distribution of static and dynamic web content.",
  },
  {
    id: 10,
    text: "What are the benefits of using AWS IAM? (Select two)",
    type: "multiple",
    options: [
      { id: 1, text: "Shared access to your AWS account" },
      { id: 2, text: "Granular permissions" },
      { id: 3, text: "Automatic cost optimization" },
      { id: 4, text: "Built-in antivirus protection" },
      { id: 5, text: "Direct database access" },
    ],
    correctAnswers: [1, 2],
    explanation:
      "AWS IAM provides shared access control and granular permissions for AWS resources.",
  },
  {
    id: 11,
    text: "Which service would you use to send bulk email?",
    type: "single",
    options: [
      { id: 1, text: "Amazon SNS" },
      { id: 2, text: "Amazon SQS" },
      { id: 3, text: "Amazon SES" },
      { id: 4, text: "Amazon Connect" },
    ],
    correctAnswers: [3],
    explanation:
      "Amazon SES (Simple Email Service) is designed for sending bulk emails, marketing messages, and transactional emails.",
  },
  {
    id: 12,
    text: "Which AWS services provide automatic scaling? (Select two)",
    type: "multiple",
    options: [
      { id: 1, text: "Amazon EC2 Auto Scaling" },
      { id: 2, text: "Amazon S3" },
      { id: 3, text: "AWS Lambda" },
      { id: 4, text: "Amazon RDS without Read Replicas" },
      { id: 5, text: "Amazon VPC" },
    ],
    correctAnswers: [1, 3],
    explanation:
      "EC2 Auto Scaling and AWS Lambda both provide automatic scaling capabilities based on demand.",
  },
  {
    id: 13,
    text: "What is the AWS shared responsibility model?",
    type: "single",
    options: [
      { id: 1, text: "AWS is responsible for everything" },
      { id: 2, text: "Customer is responsible for everything" },
      {
        id: 3,
        text: "Security responsibilities are shared between AWS and the customer",
      },
      { id: 4, text: "Only applies to government customers" },
    ],
    correctAnswers: [3],
    explanation:
      "The shared responsibility model means AWS manages security OF the cloud, while customers manage security IN the cloud.",
  },
  {
    id: 14,
    text: "Which services help with cost optimization? (Select two)",
    type: "multiple",
    options: [
      { id: 1, text: "AWS Cost Explorer" },
      { id: 2, text: "AWS Trusted Advisor" },
      { id: 3, text: "Amazon Inspector" },
      { id: 4, text: "AWS WAF" },
      { id: 5, text: "Amazon Macie" },
    ],
    correctAnswers: [1, 2],
    explanation:
      "AWS Cost Explorer and Trusted Advisor both provide insights and recommendations for cost optimization.",
  },
  {
    id: 15,
    text: "What is Amazon VPC?",
    type: "single",
    options: [
      { id: 1, text: "A virtual private cloud for isolated network resources" },
      { id: 2, text: "A database service" },
      { id: 3, text: "A content delivery network" },
      { id: 4, text: "A serverless compute category" },
    ],
    correctAnswers: [1],
    explanation:
      "Amazon VPC (Virtual Private Cloud) lets you provision a logically isolated section of the AWS cloud.",
  },
];

export const MOCK_EXAM_ATTEMPT: ExamAttempt = {
  id: 1,
  examId: 1,
  examTitle: "AWS Certified Cloud Practitioner - Practice Exam",
  timeLimit: 60,
  passingScore: 70,
  questions: MOCK_QUESTIONS,
  startedAt: new Date(),
};
