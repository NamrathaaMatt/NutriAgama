import dynamic from 'next/dynamic';
import './contactForm.css';

export const metadata = {
  title: 'Contact Us · Nutri Agama',
  description: 'Get in touch with the Nutri Agama team.',
};

const ContactPage = dynamic(() => import('./ContactPageClient'));

export default function Page() {
  return <ContactPage />;
}