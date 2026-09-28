import type { ExamContent } from "./types";

/**
 * Editorial facts about each certification: code, domain weightings, price and
 * validity. None of this lives in the API: it belongs to the vendor, not to us.
 *
 * Vendors change prices, retire exam versions and reweight domains, so treat
 * every entry here as something to re-check against `officialUrl` periodically.
 * Slugs with no entry simply render the sections that come from the API.
 */
export const EXAM_CONTENT: Record<string, ExamContent> = {
  "aws-cloud-practitioner-clf-02": {
    code: "CLF-C02",
    cost: { currency: "USD", amount: 100 },
    validityYears: 3,
    officialUrl:
      "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    domains: [
      {
        name: { en: "Cloud Concepts", pt: "Conceitos de Nuvem" },
        weight: 24,
      },
      {
        name: {
          en: "Security and Compliance",
          pt: "Segurança e Conformidade",
        },
        weight: 30,
      },
      {
        name: {
          en: "Cloud Technology and Services",
          pt: "Tecnologia e Serviços de Nuvem",
        },
        weight: 34,
      },
      {
        name: {
          en: "Billing, Pricing, and Support",
          pt: "Cobrança, Preços e Suporte",
        },
        weight: 12,
      },
    ],
  },

  "aws-solutions-architect-associate-saa-c03": {
    code: "SAA-C03",
    cost: { currency: "USD", amount: 150 },
    validityYears: 3,
    officialUrl:
      "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    domains: [
      {
        name: {
          en: "Design Secure Architectures",
          pt: "Projetar Arquiteturas Seguras",
        },
        weight: 30,
      },
      {
        name: {
          en: "Design Resilient Architectures",
          pt: "Projetar Arquiteturas Resilientes",
        },
        weight: 26,
      },
      {
        name: {
          en: "Design High-Performing Architectures",
          pt: "Projetar Arquiteturas de Alto Desempenho",
        },
        weight: 24,
      },
      {
        name: {
          en: "Design Cost-Optimized Architectures",
          pt: "Projetar Arquiteturas com Custo Otimizado",
        },
        weight: 20,
      },
    ],
  },

  "aws-developer-associate-dva-c02": {
    code: "DVA-C02",
    cost: { currency: "USD", amount: 150 },
    validityYears: 3,
    officialUrl:
      "https://aws.amazon.com/certification/certified-developer-associate/",
    domains: [
      {
        name: {
          en: "Development with AWS Services",
          pt: "Desenvolvimento com Serviços AWS",
        },
        weight: 32,
      },
      { name: { en: "Security", pt: "Segurança" }, weight: 26 },
      { name: { en: "Deployment", pt: "Implantação" }, weight: 24 },
      {
        name: {
          en: "Troubleshooting and Optimization",
          pt: "Solução de Problemas e Otimização",
        },
        weight: 18,
      },
    ],
  },

  "microsoft-azure-fundamentals-az-900": {
    code: "AZ-900",
    cost: { currency: "USD", amount: 99 },
    validityYears: null,
    officialUrl:
      "https://learn.microsoft.com/credentials/certifications/azure-fundamentals/",
    domains: [
      {
        name: {
          en: "Describe cloud concepts",
          pt: "Descrever conceitos de nuvem",
        },
        weight: 28,
      },
      {
        name: {
          en: "Describe Azure architecture and services",
          pt: "Descrever a arquitetura e os serviços do Azure",
        },
        weight: 38,
      },
      {
        name: {
          en: "Describe Azure management and governance",
          pt: "Descrever o gerenciamento e a governança do Azure",
        },
        weight: 34,
      },
    ],
  },

  "microsoft-azure-administrator-az-104": {
    code: "AZ-104",
    cost: { currency: "USD", amount: 165 },
    validityYears: 1,
    officialUrl:
      "https://learn.microsoft.com/credentials/certifications/azure-administrator/",
    domains: [
      {
        name: {
          en: "Manage Azure identities and governance",
          pt: "Gerenciar identidades e governança do Azure",
        },
        weight: 22,
      },
      {
        name: {
          en: "Implement and manage storage",
          pt: "Implementar e gerenciar armazenamento",
        },
        weight: 17,
      },
      {
        name: {
          en: "Deploy and manage Azure compute resources",
          pt: "Implantar e gerenciar recursos de computação do Azure",
        },
        weight: 27,
      },
      {
        name: {
          en: "Implement and manage virtual networking",
          pt: "Implementar e gerenciar rede virtual",
        },
        weight: 17,
      },
      {
        name: {
          en: "Monitor and maintain Azure resources",
          pt: "Monitorar e manter recursos do Azure",
        },
        weight: 17,
      },
    ],
  },

  "microsoft-azure-solutions-architect-az-305": {
    code: "AZ-305",
    cost: { currency: "USD", amount: 165 },
    validityYears: 1,
    officialUrl:
      "https://learn.microsoft.com/credentials/certifications/azure-solutions-architect/",
    domains: [
      {
        name: {
          en: "Design identity, governance, and monitoring solutions",
          pt: "Projetar soluções de identidade, governança e monitoramento",
        },
        weight: 28,
      },
      {
        name: {
          en: "Design data storage solutions",
          pt: "Projetar soluções de armazenamento de dados",
        },
        weight: 22,
      },
      {
        name: {
          en: "Design business continuity solutions",
          pt: "Projetar soluções de continuidade de negócios",
        },
        weight: 17,
      },
      {
        name: {
          en: "Design infrastructure solutions",
          pt: "Projetar soluções de infraestrutura",
        },
        weight: 33,
      },
    ],
  },

  "google-cloud-digital-leader": {
    cost: { currency: "USD", amount: 99 },
    validityYears: 3,
    officialUrl:
      "https://cloud.google.com/learn/certification/cloud-digital-leader",
    domains: [
      {
        name: {
          en: "Introduction to digital transformation with Google Cloud",
          pt: "Introdução à transformação digital com o Google Cloud",
        },
        weight: 10,
      },
      {
        name: {
          en: "Innovating with data and Google Cloud",
          pt: "Inovação com dados e Google Cloud",
        },
        weight: 30,
      },
      {
        name: {
          en: "Infrastructure and application modernization",
          pt: "Modernização de infraestrutura e aplicações",
        },
        weight: 30,
      },
      {
        name: {
          en: "Google Cloud security and operations",
          pt: "Segurança e operações no Google Cloud",
        },
        weight: 30,
      },
    ],
  },
};

/**
 * Falls back to the exam code embedded in the slug (…-az-900, …-saa-c03) so
 * pages with no editorial entry still show something concrete.
 */
export function getExamContent(slug: string): ExamContent {
  const seeded = EXAM_CONTENT[slug];
  if (seeded) return seeded;

  const match = slug.match(/-([a-z]{2,3}-[a-z]?\d{2,3})$/);
  return match ? { code: match[1].toUpperCase() } : {};
}
