import LegalPage from '@/components/Legal'

export const metadata = {
  title: 'Terms & Conditions',
  description: 'The terms that govern projects and services delivered by AI ka Fanda.',
  alternates: { canonical: '/terms' },
}

const sections = [
  {
    h: 'Services Scope',
    p: 'AI ka Fanda provides custom AI agent development, workflow automation, websites, mobile apps and SaaS product engineering. The specific scope, timeline, deliverables, and fees for each engagement will be detailed in an independent project agreement.',
  },
  {
    h: 'Client Responsibilities',
    p: 'To ensure timely delivery, clients must provide necessary API keys, workflow documentation, domain access, and feedback on milestones within the agreed review cycles. Delays in providing these assets may impact overall delivery timelines.',
  },
  {
    h: 'Code Delivery and Handover',
    p: 'Upon successful completion of project milestones and full settlement of invoices, full ownership of all custom source code, assets, and configurations developed within the scope is handed over to the client. AI ka Fanda does not retain any intellectual property rights or licensing fees unless explicitly agreed.',
  },
  {
    h: 'Maintenance and Support',
    p: 'All projects include 30 days of active post-deploy bug fixing and monitoring. Extended maintenance agreements and continuous optimization retainers can be scheduled as separate line items.',
  },
  {
    h: 'Governing Law',
    p: 'These terms are governed by and construed in accordance with the laws of Pakistan. Any dispute arising out of or related to our services shall be subject to the exclusive jurisdiction of the competent courts in Karachi, Pakistan.',
  },
  {
    h: 'Questions',
    p: 'If you have any questions or require clarification on these Terms & Conditions, please email us.',
  },
]

export default function TermsPage() {
  return <LegalPage title="Terms & Conditions" updated="May 18, 2026" sections={sections} />
}
