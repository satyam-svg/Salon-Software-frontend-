export default function StepFive({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  return (
    <>
      <h1
        onClick={() => {
          setStep(1);
        }}
      >
        hey buddy
      </h1>
    </>
  );
}
