import { ProductPage } from "@/components/product/ProductPage";

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
    src: "/images/Gemini_Generated_Image_ohccd5ohccd5ohcc.webp",
    alt: "The Cloak - studio texture",
    label: "Soft Touch Finish",
    filtered: false,
  },
  {
    src: "/images/Gemini_Generated_Image_y5lhr3y5lhr3y5lh.webp",
    alt: "The Cloak - silhouette",
    label: "Signature Drape",
    filtered: false,
  },
];

export default function ShopPage() {
  return <ProductPage galleryImages={galleryImages} />;
}
