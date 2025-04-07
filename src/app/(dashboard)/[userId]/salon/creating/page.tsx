// app/salon-setup/page.tsx
'use client';
import { ProgressStepper } from '@/Components/ProgressStepper';
import StepFive from '@/Components/StepFive';
import StepFour from '@/Components/StepFour';
import { StepOne } from '@/Components/StepOne';
import Stepthree from '@/Components/Stepthree';
import Steptwo from '@/Components/Steptwo';
import { useState } from 'react';


export default function SalonSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#fff9f7]">
      <ProgressStepper currentStep={currentStep} />
      
      <div className="pb-20">
        {currentStep === 1 && <StepOne setStep={setCurrentStep} />}
        {currentStep === 2 && <Steptwo setStep={setCurrentStep} />}
        {currentStep === 3 && <Stepthree setStep={setCurrentStep} />}
        {currentStep === 4 && <StepFour setStep={setCurrentStep} />}
        {currentStep === 5 && <StepFive setStep={setCurrentStep} />}
      </div>
    </div>
  );
}