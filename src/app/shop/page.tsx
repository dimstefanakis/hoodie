import { ProductPage } from "@/components/product/ProductPage";
import { defaultSize } from "@/components/product/size-options";

const galleryImages = [
  {
    src: "/images/cloak.png",
    alt: "The Cloak silhouette",
    label: "Midnight Black",
  },
  {
    src: "/images/texture.png",
    alt: "Fabric texture detail",
    label: "Plush Interior",
  },
  {
    src: "/images/Gemini_Generated_Image_3xyiud3xyiud3xyi.webp",
    alt: "The Cloak - studio texture",
    label: "Soft Touch Finish",
    filtered: false,
  },
  {
    src: "/images/Gemini_Generated_Image_k32rq8k32rq8k32r.webp",
    alt: "The Cloak - silhouette",
    label: "Signature Drape",
    filtered: false,
  },
  {
    src: "/images/Gemini_Generated_Image_rtf4ndrtf4ndrtf4.webp",
    alt: "The Cloak - detail",
    label: "Atelier Detail",
    filtered: false,
  },
];

export default function ShopPage() {
  return (
    <ProductPage galleryImages={galleryImages} defaultSize={defaultSize} />
  );
}
