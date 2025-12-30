import { LandingPage } from "@/components/landing/LandingPage";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Default to 149 if not provided or invalid
  let price = 149;
  
  if (params.price) {
    const parsedPrice = parseInt(Array.isArray(params.price) ? params.price[0] : params.price);
    if (!isNaN(parsedPrice)) {
      price = parsedPrice;
    }
  }

  return <LandingPage price={price} />;
}