import LegalPage from '@/components/Legal'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How AI ka Fanda handles and protects your personal and project information.',
  alternates: { canonical: '/privacy-policy' },
}

const sections = [
  {
    h: 'Information We Collect',
    p: 'We collect information that you voluntarily provide when you submit a contact form on our website or contact us via email, WhatsApp, or other communication channels. This information may include your name, email address, phone number, and any details regarding your project that you share.',
  },
  {
    h: 'How We Use Your Information',
    p: 'We use the collected information solely to understand your project requirements, communicate with you, provide quotes, and deliver our services. We do not sell, rent, or share your personal or project details with third parties for marketing purposes.',
  },
  {
    h: 'Code and Infrastructure Ownership',
    p: 'All code, workflows, and infrastructure deployed during our engagements are delivered to your repositories, your cloud services, and your database accounts. We do not maintain backdoor access or proprietary dependencies on the solutions shipped to you.',
  },
  {
    h: 'Security',
    p: 'We implement appropriate technical and organizational measures to secure your personal and business data. However, no transmission over the Internet or electronic storage method can guarantee 100% security.',
  },
  {
    h: 'Contact Us',
    p: 'If you have any questions regarding this Privacy Policy, feel free to reach out to us by email.',
  },
]

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" updated="May 18, 2026" sections={sections} />
}
