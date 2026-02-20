import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import About from '../components/home/About';
import Stats from '../components/home/Stats';
import Testimonials from '../components/home/Testimonials';
import Whoweare from '../components/home/Whoweare';
import CTA from '../components/home/CTA';
import { Page } from '../lib/types';
import React, { useState } from 'react';
import SplashScreen from '../components/home/SplashScreen';
import ClientsMarquee from '../components/home/ClientsMarquee';
interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <>
    <div className="bg-[#D91E36] min-h-screen">
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Hero  />
      <Whoweare />
      <ClientsMarquee />
      <Services onNavigate={onNavigate} />
      <About onNavigate={onNavigate} />
      <Stats />
      <Testimonials />
      <CTA onNavigate={onNavigate}
       />
       </div>
    </>
  );
}
