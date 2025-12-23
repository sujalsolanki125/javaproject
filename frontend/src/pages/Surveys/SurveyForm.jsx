import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SurveyForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Transportation
    transportMode: '',
    commuteFrequency: '',
    commuteDistance: 50,
    shortHaulFlights: 0,
    longHaulFlights: 0,
    // Step 2-5 will be added later
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit survey
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async () => {
    // TODO: Integrate with backend API
    console.log('Survey data:', formData);
    navigate('/dashboard');
  };

  const stepTitles = {
    1: 'Transportation',
    2: 'Energy & Home',
    3: 'Food & Diet',
    4: 'Shopping & Consumption',
    5: 'Review & Submit'
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light dark:bg-background-dark">
      {/* Top Nav Bar */}
      <header className="flex w-full max-w-5xl items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-4 py-4 md:px-10">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="h-8 w-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Carbon Footprint Tracker</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>Progress saved</span>
        </div>
      </header>

      <main className="w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <div className="flex flex-col gap-10">
          {/* Progress Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Step {currentStep} of {totalSteps}: {stepTitles[currentStep]}
              </p>
            </div>
            <div className="w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div 
                className="h-2 rounded-full bg-primary transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step 1: Transportation */}
          {currentStep === 1 && (
            <>
              {/* Page Heading */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                  Your Transportation Habits
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Let's start by understanding how you get around.
                </p>
              </div>

              <div className="flex flex-col gap-8">
                {/* Commute Information Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-background-dark/50">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Commute Information
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Primary mode of transport */}
                    <label className="flex flex-col col-span-2 md:col-span-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                        Primary mode of transport
                      </span>
                      <select
                        value={formData.transportMode}
                        onChange={(e) => handleInputChange('transportMode', e.target.value)}
                        className="form-select w-full rounded-lg border-slate-300 bg-background-light text-slate-700 focus:border-primary/50 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-primary/50 dark:focus:ring-primary/20"
                      >
                        <option value="">Select an option</option>
                        <option value="car">Car (Gasoline)</option>
                        <option value="ev">Car (Electric)</option>
                        <option value="bus">Bus</option>
                        <option value="train">Train / Subway</option>
                        <option value="bicycle">Bicycle</option>
                        <option value="walk">Walk</option>
                      </select>
                    </label>

                    {/* Daily commute frequency */}
                    <label className="flex flex-col col-span-2 md:col-span-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                        How often do you commute?
                      </span>
                      <select
                        value={formData.commuteFrequency}
                        onChange={(e) => handleInputChange('commuteFrequency', e.target.value)}
                        className="form-select w-full rounded-lg border-slate-300 bg-background-light text-slate-700 focus:border-primary/50 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-primary/50 dark:focus:ring-primary/20"
                      >
                        <option value="">Select frequency</option>
                        <option value="5-days">5 days a week</option>
                        <option value="3-days">3 days a week</option>
                        <option value="1-day">1 day a week</option>
                        <option value="rarely">Rarely</option>
                      </select>
                    </label>

                    {/* Average weekly commute */}
                    <div className="flex flex-col col-span-2">
                      <div className="flex items-center justify-between pb-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="commute-distance">
                          Average weekly commute distance (km)
                        </label>
                        <span className="font-semibold text-primary">{formData.commuteDistance} km</span>
                      </div>
                      <input
                        id="commute-distance"
                        type="range"
                        min="0"
                        max="200"
                        value={formData.commuteDistance}
                        onChange={(e) => handleInputChange('commuteDistance', parseInt(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-primary dark:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Air Travel Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-background-dark/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Air Travel (Annual)
                    </h2>
                    <div className="group relative">
                      <span className="material-symbols-outlined cursor-help text-slate-400">help</span>
                      <div className="absolute bottom-full right-0 mb-2 hidden w-60 rounded-lg bg-slate-800 p-2 text-center text-xs text-white group-hover:block dark:bg-slate-700">
                        Air travel is a significant contributor to carbon emissions. Provide your yearly estimates to help us calculate its impact.
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Short-haul flights */}
                    <label className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                        Short-haul flights (&lt; 3 hours)
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={formData.shortHaulFlights}
                        onChange={(e) => handleInputChange('shortHaulFlights', parseInt(e.target.value) || 0)}
                        className="form-input w-full rounded-lg border-slate-300 bg-background-light text-slate-700 placeholder:text-slate-400 focus:border-primary/50 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-primary/50 dark:focus:ring-primary/20"
                        placeholder="e.g., 2"
                      />
                    </label>

                    {/* Long-haul flights */}
                    <label className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                        Long-haul flights (&gt; 3 hours)
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={formData.longHaulFlights}
                        onChange={(e) => handleInputChange('longHaulFlights', parseInt(e.target.value) || 0)}
                        className="form-input w-full rounded-lg border-slate-300 bg-background-light text-slate-700 placeholder:text-slate-400 focus:border-primary/50 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-primary/50 dark:focus:ring-primary/20"
                        placeholder="e.g., 1"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Future steps placeholder */}
          {currentStep > 1 && (
            <div className="flex flex-col items-center justify-center py-20">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Step {currentStep}: {stepTitles[currentStep]}
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                This step will be implemented next
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
            <button
              onClick={handleBack}
              className="rounded-full px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-slate-900 hover:bg-primary/80"
            >
              {currentStep === totalSteps ? 'Submit' : 'Next Step'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
