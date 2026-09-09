'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import IndustrySolutions from '@/components/IndustrySolutions';
import MobilityInYourHands from '@/components/MobilityInYourHands';
import EnterpriseIntegrations from '@/components/EnterpriseIntegrations';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import SocialProof from '@/components/SocialProof';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import DemoModal from '@/components/DemoModal';
import VideoModal from '@/components/VideoModal';

export default function SaaSWebsiteHome() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleOpenDemo = (planName?: string) => {
    setSelectedPlan(planName);
    setDemoModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header & Navigation */}
      <Navbar onRequestDemo={() => handleOpenDemo()} />

      <main style={{ flex: 1 }}>
        {/* 2. Hero Section with Real Fleet & Mobile Mockups */}
        <Hero
          onRequestDemo={() => handleOpenDemo()}
          onWatchVideo={() => setVideoModalOpen(true)}
        />

        {/* 3. Enterprise Features (8 Cards) */}
        <Features onRequestDemo={() => handleOpenDemo()} />

       

        {/* 5. Mobility In Your Hands (App Store, Google Play, 3 Mobile Mockups) */}
        <MobilityInYourHands onRequestDemo={() => handleOpenDemo()} />

        {/* 6. Enterprise Ready: Open APIs. Seamless Integrations & Transform Banner */}
        <EnterpriseIntegrations onRequestDemo={() => handleOpenDemo()} />

        {/* 7. How It Works (4-Step Workflow) */}
        <HowItWorks />

        {/* 8. Simple, Transparent Pricing */}
        <Pricing onRequestDemo={handleOpenDemo} />

        {/* 9. Social Proof, Verified Metrics & Partner Logos */}
        <SocialProof />

        {/* 10. Contact CTA Banner */}
        <ContactCTA onRequestDemo={() => handleOpenDemo()} />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* Interactive Modals */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        initialPlan={selectedPlan}
      />

      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  );
}
