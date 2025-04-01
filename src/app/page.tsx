import FinancialManagement from "@/Components/FinancialManagement";
import HomeHero from "@/Components/HomeHero";
import ProductsSection from "@/Components/ProductsSection";
import ResourceManagement from "@/Components/ResourceManagement";
import StaffManagement from "@/Components/StaffManagement";

export default function Home() {
  return (
    <>
    <HomeHero/>
    <ProductsSection/>
    <StaffManagement/>
    <ResourceManagement/>
    <FinancialManagement/>
    </>
  );
}
