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
    // Step 2: Diet
    dietType: 'vegetarian',
    // Step 3: Energy
    electricityUsage: '',
    electricityUnit: 'kWh',
    naturalGasUsage: '',
    naturalGasUnit: 'therms',
    heatingOilUsage: '',
    heatingOilUnit: 'gallons per year',
    // Step 4: Habits
    useReusableBags: false,
    recycleWaste: true,
    compostFood: false,
    unplugElectronics: false,
    buyLocalProduce: false,
    // Step 5 will be added later
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
    2: 'Food & Diet',
    3: 'Home Energy',
    4: 'Your Habits',
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

          {/* Step 2: Diet Type */}
          {currentStep === 2 && (
            <>
              {/* Page Heading */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                  Tell us about your eating habits.
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Select the option that most closely matches your typical diet.
                </p>
              </div>

              {/* Radio List with Illustrations */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Vegan Option */}
                <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 ring-2 ring-transparent transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:ring-primary/20 dark:border-slate-700 dark:bg-slate-800">
                  <input
                    type="radio"
                    name="diet-type"
                    value="vegan"
                    checked={formData.dietType === 'vegan'}
                    onChange={(e) => handleInputChange('dietType', e.target.value)}
                    className="h-5 w-5 shrink-0 border-2 border-slate-300 bg-transparent text-primary focus:ring-primary dark:border-slate-600 checked:border-primary"
                  />
                  <div className="flex grow flex-col">
                    <p className="text-base font-medium text-slate-900 dark:text-white">Vegan</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No animal products</p>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-green-500">eco</span>
                  <div className="tooltip absolute -top-12 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible">
                    Plant-based diets typically have the lowest carbon footprint.
                  </div>
                </label>

                {/* Vegetarian Option */}
                <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 ring-2 ring-transparent transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:ring-primary/20 dark:border-slate-700 dark:bg-slate-800">
                  <input
                    type="radio"
                    name="diet-type"
                    value="vegetarian"
                    checked={formData.dietType === 'vegetarian'}
                    onChange={(e) => handleInputChange('dietType', e.target.value)}
                    className="h-5 w-5 shrink-0 border-2 border-slate-300 bg-transparent text-primary focus:ring-primary dark:border-slate-600 checked:border-primary"
                  />
                  <div className="flex grow flex-col">
                    <p className="text-base font-medium text-slate-900 dark:text-white">Vegetarian</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No meat</p>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-lime-500">grass</span>
                  <div className="tooltip absolute -top-12 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible">
                    Low carbon impact, excludes meat products.
                  </div>
                </label>

                {/* Pescatarian Option */}
                <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 ring-2 ring-transparent transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:ring-primary/20 dark:border-slate-700 dark:bg-slate-800">
                  <input
                    type="radio"
                    name="diet-type"
                    value="pescatarian"
                    checked={formData.dietType === 'pescatarian'}
                    onChange={(e) => handleInputChange('dietType', e.target.value)}
                    className="h-5 w-5 shrink-0 border-2 border-slate-300 bg-transparent text-primary focus:ring-primary dark:border-slate-600 checked:border-primary"
                  />
                  <div className="flex grow flex-col">
                    <p className="text-base font-medium text-slate-900 dark:text-white">Pescatarian</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Vegetarian + seafood</p>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-blue-400">phishing</span>
                  <div className="tooltip absolute -top-12 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible">
                    Lower impact than diets with red meat.
                  </div>
                </label>

                {/* Omnivore Option */}
                <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 ring-2 ring-transparent transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:ring-primary/20 dark:border-slate-700 dark:bg-slate-800">
                  <input
                    type="radio"
                    name="diet-type"
                    value="omnivore"
                    checked={formData.dietType === 'omnivore'}
                    onChange={(e) => handleInputChange('dietType', e.target.value)}
                    className="h-5 w-5 shrink-0 border-2 border-slate-300 bg-transparent text-primary focus:ring-primary dark:border-slate-600 checked:border-primary"
                  />
                  <div className="flex grow flex-col">
                    <p className="text-base font-medium text-slate-900 dark:text-white">Omnivore</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Plants and animals</p>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-amber-500">restaurant</span>
                  <div className="tooltip absolute -top-12 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible">
                    Carbon impact varies based on consumption.
                  </div>
                </label>
              </div>
            </>
          )}

          {/* Step 3: Home Energy */}
          {currentStep === 3 && (
            <>
              {/* Page Heading */}
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                  Step 3: Home Energy
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Let's look at your home energy use. Check your utility bills for the most accurate numbers.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50 sm:p-8">
                <div className="flex flex-col gap-6">
                  {/* Electricity Section */}
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white pb-3">
                      Electricity
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <label className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2 pb-2">
                          <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                            Average monthly usage
                          </p>
                          <div className="group relative">
                            <span className="material-symbols-outlined cursor-pointer text-base text-slate-500 dark:text-slate-400">
                              info
                            </span>
                            <div className="pointer-events-none absolute bottom-full mb-2 w-60 rounded-lg bg-slate-800 p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-900">
                              Kilowatt-hours (kWh) are the standard unit for electricity. Find this on your monthly bill. More kWh means a higher carbon impact.
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          value={formData.electricityUsage}
                          onChange={(e) => handleInputChange('electricityUsage', e.target.value)}
                          className="form-input h-14 w-full rounded-xl border border-slate-200 bg-slate-50 p-[15px] text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                          placeholder="e.g., 500"
                        />
                      </label>
                      <label className="flex flex-1 flex-col">
                        <p className="text-base font-medium text-slate-800 dark:text-slate-200 pb-2">
                          Unit
                        </p>
                        <select
                          value={formData.electricityUnit}
                          onChange={(e) => handleInputChange('electricityUnit', e.target.value)}
                          className="form-select h-14 w-full rounded-xl border border-slate-200 bg-slate-50 p-[15px] text-base text-slate-900 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          <option>kWh</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-200 dark:border-slate-700"></div>

                  {/* Heating Section */}
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white pb-3">
                      Heating
                    </h2>
                    
                    {/* Natural Gas */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                      <label className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2 pb-2">
                          <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                            Natural gas usage
                          </p>
                          <div className="group relative">
                            <span className="material-symbols-outlined cursor-pointer text-base text-slate-500 dark:text-slate-400">
                              info
                            </span>
                            <div className="pointer-events-none absolute bottom-full mb-2 w-60 rounded-lg bg-slate-800 p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-900">
                              Usually measured in therms or cubic feet (CCF). Burning natural gas for heat is a major source of emissions.
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          value={formData.naturalGasUsage}
                          onChange={(e) => handleInputChange('naturalGasUsage', e.target.value)}
                          className="form-input h-14 w-full rounded-xl border border-slate-200 bg-slate-50 p-[15px] text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                          placeholder="e.g., 70"
                        />
                      </label>
                      <label className="flex flex-1 flex-col">
                        <p className="text-base font-medium text-slate-800 dark:text-slate-200 pb-2">
                          Unit
                        </p>
                        <select
                          value={formData.naturalGasUnit}
                          onChange={(e) => handleInputChange('naturalGasUnit', e.target.value)}
                          className="form-select h-14 w-full rounded-xl border border-slate-200 bg-slate-50 p-[15px] text-base text-slate-900 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          <option>therms</option>
                          <option>cubic feet (CCF)</option>
                        </select>
                      </label>
                    </div>

                    {/* Heating Oil */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <label className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2 pb-2">
                          <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                            Heating oil usage
                          </p>
                          <div className="group relative">
                            <span className="material-symbols-outlined cursor-pointer text-base text-slate-500 dark:text-slate-400">
                              info
                            </span>
                            <div className="pointer-events-none absolute bottom-full mb-2 w-60 rounded-lg bg-slate-800 p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-900">
                              Enter your total usage for the year, usually found on your supplier's statements.
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          value={formData.heatingOilUsage}
                          onChange={(e) => handleInputChange('heatingOilUsage', e.target.value)}
                          className="form-input h-14 w-full rounded-xl border border-slate-200 bg-slate-50 p-[15px] text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                          placeholder="e.g., 250"
                        />
                      </label>
                      <label className="flex flex-1 flex-col">
                        <p className="text-base font-medium text-slate-800 dark:text-slate-200 pb-2">
                          Unit
                        </p>
                        <select
                          value={formData.heatingOilUnit}
                          onChange={(e) => handleInputChange('heatingOilUnit', e.target.value)}
                          className="form-select h-14 w-full rounded-xl border border-slate-200 bg-slate-50 p-[15px] text-base text-slate-900 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          <option>gallons per year</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Your Habits */}
          {currentStep === 4 && (
            <>
              {/* Page Heading */}
              <div className="flex w-full flex-col gap-3 text-center mt-8">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                  Which of these do you do regularly?
                </h1>
                <p className="mx-auto max-w-lg text-base text-primary/70 dark:text-primary/80">
                  Select all the habits that apply to you. This helps us calculate your footprint more accurately.
                </p>
              </div>

              {/* Checkbox List */}
              <div className="mt-6 space-y-2">
                {/* Reusable Shopping Bags */}
                <label className="flex items-center gap-x-3 rounded-lg border-2 border-transparent bg-white p-4 transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:bg-white/5">
                  <input
                    type="checkbox"
                    checked={formData.useReusableBags}
                    onChange={(e) => handleInputChange('useReusableBags', e.target.checked)}
                    className="h-5 w-5 rounded border-2 border-slate-300 bg-transparent text-primary checked:border-primary checked:bg-primary focus:border-primary focus:ring-0 focus:ring-offset-0 dark:border-white/20"
                  />
                  <p className="flex-1 text-base text-slate-900 dark:text-white/90">
                    I use reusable shopping bags
                  </p>
                  <div className="group relative">
                    <span className="material-symbols-outlined cursor-pointer text-slate-400 dark:text-white/40">
                      help
                    </span>
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 p-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Using reusable bags reduces plastic waste, which requires energy to produce and transport, lowering your carbon footprint.
                      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </label>

                {/* Recycle Waste */}
                <label className="flex items-center gap-x-3 rounded-lg border-2 border-transparent bg-white p-4 transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:bg-white/5">
                  <input
                    type="checkbox"
                    checked={formData.recycleWaste}
                    onChange={(e) => handleInputChange('recycleWaste', e.target.checked)}
                    className="h-5 w-5 rounded border-2 border-slate-300 bg-transparent text-primary checked:border-primary checked:bg-primary focus:border-primary focus:ring-0 focus:ring-offset-0 dark:border-white/20"
                  />
                  <p className="flex-1 text-base text-slate-900 dark:text-white/90">
                    I recycle paper, glass, and plastic
                  </p>
                  <div className="group relative">
                    <span className="material-symbols-outlined cursor-pointer text-slate-400 dark:text-white/40">
                      help
                    </span>
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 p-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Recycling conserves energy and natural resources, reducing greenhouse gas emissions from manufacturing new materials.
                      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </label>

                {/* Compost Food */}
                <label className="flex items-center gap-x-3 rounded-lg border-2 border-transparent bg-white p-4 transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:bg-white/5">
                  <input
                    type="checkbox"
                    checked={formData.compostFood}
                    onChange={(e) => handleInputChange('compostFood', e.target.checked)}
                    className="h-5 w-5 rounded border-2 border-slate-300 bg-transparent text-primary checked:border-primary checked:bg-primary focus:border-primary focus:ring-0 focus:ring-offset-0 dark:border-white/20"
                  />
                  <p className="flex-1 text-base text-slate-900 dark:text-white/90">
                    I compost my food scraps
                  </p>
                  <div className="group relative">
                    <span className="material-symbols-outlined cursor-pointer text-slate-400 dark:text-white/40">
                      help
                    </span>
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 p-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Composting diverts organic waste from landfills, where it would produce methane, a potent greenhouse gas.
                      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </label>

                {/* Unplug Electronics */}
                <label className="flex items-center gap-x-3 rounded-lg border-2 border-transparent bg-white p-4 transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:bg-white/5">
                  <input
                    type="checkbox"
                    checked={formData.unplugElectronics}
                    onChange={(e) => handleInputChange('unplugElectronics', e.target.checked)}
                    className="h-5 w-5 rounded border-2 border-slate-300 bg-transparent text-primary checked:border-primary checked:bg-primary focus:border-primary focus:ring-0 focus:ring-offset-0 dark:border-white/20"
                  />
                  <p className="flex-1 text-base text-slate-900 dark:text-white/90">
                    I unplug electronics when not in use
                  </p>
                  <div className="group relative">
                    <span className="material-symbols-outlined cursor-pointer text-slate-400 dark:text-white/40">
                      help
                    </span>
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 p-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Many electronics draw "phantom" power even when off. Unplugging them saves energy and reduces your electricity-related emissions.
                      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </label>

                {/* Buy Local Produce */}
                <label className="flex items-center gap-x-3 rounded-lg border-2 border-transparent bg-white p-4 transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:bg-white/5">
                  <input
                    type="checkbox"
                    checked={formData.buyLocalProduce}
                    onChange={(e) => handleInputChange('buyLocalProduce', e.target.checked)}
                    className="h-5 w-5 rounded border-2 border-slate-300 bg-transparent text-primary checked:border-primary checked:bg-primary focus:border-primary focus:ring-0 focus:ring-offset-0 dark:border-white/20"
                  />
                  <p className="flex-1 text-base text-slate-900 dark:text-white/90">
                    I buy local produce when possible
                  </p>
                  <div className="group relative">
                    <span className="material-symbols-outlined cursor-pointer text-slate-400 dark:text-white/40">
                      help
                    </span>
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 p-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Buying local reduces "food miles"—the distance food travels from farm to plate—which cuts down on transportation emissions.
                      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </label>
              </div>
            </>
          )}

          {/* Future steps placeholder */}
          {currentStep > 4 && (
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
