import ResetPasswordClient from './ResetPasswordClient'

export const metadata = {
  title: { absolute: 'Reset Password · Ruya AI' },
  description: 'Reset the password for your Ruya AI account.',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
