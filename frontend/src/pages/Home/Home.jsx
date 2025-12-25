import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainHeader } from '../../components/layout/MainHeader';

export default function Home() {
  const navigate = useNavigate();
  const [quickEstimate, setQuickEstimate] = useState({
    location: 'United States',
    transport: 'car',
    homeEnergy: 150
  });

  const handleQuickEstimate = () => {
    navigate('/survey');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      <div className="layout-container flex h-full grow flex-col">
        <MainHeader />

        <main>
          {/* Hero Section */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="flex flex-col gap-6 text-left">
                <h1 className="text-[#111813] dark:text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
                  Know your footprint. Take action today.
                </h1>
                <h2 className="text-[#111813] dark:text-gray-300 text-base sm:text-lg font-normal leading-normal">
                  Get a quick estimate in under 60 seconds — then reduce, track and offset.
                </h2>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={handleQuickEstimate}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-[#111813] text-base font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Get Quick Estimate</span>
                  </button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <img
                  src="/hero-image.png"
                  alt="Hero image for carbon footprint calculator"
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-green-600 bg-opacity-20 rounded-xl"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl">eco</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Start Your Green Journey</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Track, reduce, and offset your carbon footprint</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why It Works Section */}
          <section className="bg-white dark:bg-background-dark/50 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#111813] dark:text-white">
                  Why It Works
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Our approach combines precise data with actionable insights to empower you.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: 'verified',
                    title: 'Accurate Methodology',
                    description: 'Calculations based on IPCC data and scientific consensus.'
                  },
                  {
                    icon: 'insights',
                    title: 'Personalized Insights',
                    description: 'Discover your biggest impact areas and get tailored tips.'
                  },
                  {
                    icon: 'track_changes',
                    title: 'Track & Set Goals',
                    description: 'Monitor your progress over time and stay motivated.'
                  },
                  {
                    icon: 'storefront',
                    title: 'Offset Marketplace',
                    description: 'Support verified carbon offset projects around the world.'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-6">
                    <div className="flex items-center justify-center size-14 rounded-full bg-primary/20 text-primary mb-4">
                      <span className="material-symbols-outlined !text-4xl">{benefit.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111813] dark:text-white">{benefit.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#111813] dark:text-white">
                  How It Works in 3 Simple Steps
                </h2>
              </div>
              <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden md:block"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
                  {[
                    {
                      number: 1,
                      title: 'Measure',
                      description: 'Take a quick estimate or complete our detailed survey for a precise footprint analysis.'
                    },
                    {
                      number: 2,
                      title: 'Understand',
                      description: 'Get personalized insights and set achievable goals to reduce your impact.'
                    },
                    {
                      number: 3,
                      title: 'Act',
                      description: 'Reduce emissions with our tips or offset your footprint via our marketplace.'
                    }
                  ].map((step) => (
                    <div key={step.number} className="flex flex-col items-center text-center">
                      <div className="flex items-center justify-center size-16 rounded-full bg-primary text-[#111813] mb-4 z-10 border-4 border-background-light dark:border-background-dark">
                        <span className="font-bold text-xl">{step.number}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#111813] dark:text-white">{step.title}</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Tips & Quick Wins */}
          <section className="bg-white dark:bg-background-dark/50 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#111813] dark:text-white">
                  Tips & Quick Wins
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Small changes that make a big difference. Start reducing your footprint today.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Try One Meatless Day',
                    description: 'Skipping meat once a week can significantly cut down your dietary emissions.',
                    savings: '~150 kg CO₂ saved / year'
                  },
                  {
                    title: 'Lower Thermostat by 2°C',
                    description: 'A small adjustment to your heating can lead to substantial energy savings.',
                    savings: '~300 kg CO₂ saved / year'
                  },
                  {
                    title: 'Switch to Public Transit',
                    description: 'Leave the car at home just twice a week for your commute.',
                    savings: '~500 kg CO₂ saved / year'
                  }
                ].map((tip, index) => (
                  <div key={index} className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-[#111813] dark:text-white">{tip.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{tip.description}</p>
                    <p className="mt-4 text-primary font-bold">{tip.savings}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#111813] dark:text-white">
                  What Our Users Say
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-background-dark/50 p-8 rounded-xl border border-gray-200 dark:border-gray-800">
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "CarbonCalc made it so easy to understand my impact. The personalized tips are fantastic and I've already made several changes to my daily routine!"
                  </p>
                  <div className="flex items-center mt-6">
                    <img
                      className="size-12 rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4hw7YUBTpKqQyBRzC2dogQXVOaUx98eoHpbTrt40xh1ymaLJAdil4Myd1l3ErE7kTilA8gzDtrHaPeVw9UPmj5GuTxOYcxaWtUuKOt-d7zlPfZR6aFer2ynRJ4G8dcfsxODSLLqhItowkFswqWvMcG5dHm_Vee9wMWjbxdwXdsZvd0CPq7G2mWA9uRFZyNbPRr9cjdmIomWZtmhHCJpGbKOuLNzoctuapzCBQH6xvP7nZByl0wNA3JVUVMWE-no9iC3ho-luCvkY"
                      alt="Portrait of Alex Johnson"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-[#111813] dark:text-white">Alex Johnson</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Eco-conscious Commuter</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-background-dark/50 p-8 rounded-xl border border-gray-200 dark:border-gray-800">
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "The marketplace is a game-changer. Being able to directly support projects that offset my unavoidable emissions gives me peace of mind."
                  </p>
                  <div className="flex items-center mt-6">
                    <img
                      className="size-12 rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ84j9GAm11SuoJVkDJZNXYRVJN3wsxuBZEwLuT4nHelyb1eoZ7695eEQfe1G2pOMwOeRrcOM-cDGBEK-iMng37v4OQl8vHb0RD8_-wt7RF0Y8rEseOPvg-GDVvKARXe1KMKM--vVTRqLXSTmzVS9_hA8BQPPRdOiHdEf72xbhm3mPBSZ28eVbS0JPY4Xcly8HoWOSCpxOeN0l9BmTqZfu67BEZR3Kia617kIjwiY-mwPl1Z9c-Zy6vsGlht0DKYOcgaZr697HbKY"
                      alt="Portrait of Maria Garcia"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-[#111813] dark:text-white">Maria Garcia</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Small Business Owner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-background-dark/50 border-t border-gray-200 dark:border-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <h2 className="text-[#111813] dark:text-white text-lg font-bold">CarbonCalc</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Measure, understand, and reduce your carbon footprint.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#111813] dark:text-white tracking-wider uppercase">
                    Product
                  </h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <Link to="/dashboard" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/survey" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        Calculator
                      </Link>
                    </li>
                    <li>
                      <Link to="/marketplace" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        Marketplace
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#111813] dark:text-white tracking-wider uppercase">
                    Resources
                  </h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        Learn
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        Methodology
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#111813] dark:text-white tracking-wider uppercase">
                    Legal
                  </h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-primary">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-gray-400 dark:text-gray-500">© 2024 CarbonCalc. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
