// app/salon-setup/page.tsx
'use client';
import { ProgressStepper } from '@/Components/ProgressStepper';
import StepFive from '@/Components/StepFive';
import StepFour from '@/Components/StepFour';
import { StepOne } from '@/Components/StepOne';
import Stepthree from '@/Components/Stepthree';
import Steptwo from '@/Components/Steptwo';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function SalonSetupPage() {
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(1);
  const router=useRouter()
  // Extract userId from pathname like /1234 or /5678/anything
  const userId = pathname.split('/')[1];
  useEffect(() => {
    const checkSalonStatus = async () => {
      try {
        const response = await axios.get(`https://salon-backend-3.onrender.com/api/users/${userId}`);
        const data = response.data;
        setCurrentStep(data.user.step)
        
      } catch (error) {
        console.error('Error checking salon status:', error);
        router.push('/error');
      }
    };

    if (userId) {
      checkSalonStatus();
    }
    
  }, [userId, router]);
 

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