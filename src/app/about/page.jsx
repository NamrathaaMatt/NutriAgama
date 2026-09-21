import dynamic from 'next/dynamic';

export const metadata = {
  title: 'About Us · Nutri Agama',
  description: 'Learn about our story, our founders and our mission.',
};

const About = dynamic(() => import('./about'));

export default function AboutPage() {
  return <About />;
}