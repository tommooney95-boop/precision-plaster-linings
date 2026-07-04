export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    alt: "Smooth plaster finish on residential living room walls",
    category: "Residential",
    width: 800,
    height: 600,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    alt: "New home plastering interior with clean white walls",
    category: "New Homes",
    width: 800,
    height: 1000,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    alt: "Commercial office space with professional plaster finishes",
    category: "Commercial",
    width: 800,
    height: 600,
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    alt: "Renovated bedroom with flawless ceiling and wall plaster",
    category: "Renovations",
    width: 800,
    height: 600,
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    alt: "Modern kitchen renovation with premium plaster work",
    category: "Renovations",
    width: 800,
    height: 1000,
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    alt: "Decorative cornice installation in heritage home",
    category: "Cornice",
    width: 800,
    height: 600,
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    alt: "Construction site plastering work in progress",
    category: "Commercial",
    width: 800,
    height: 600,
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    alt: "Residential home exterior ready for plastering completion",
    category: "Residential",
    width: 800,
    height: 1000,
  },
  {
    id: "9",
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    alt: "Ceiling repair work showing professional craftsmanship",
    category: "Repairs",
    width: 800,
    height: 600,
  },
  {
    id: "10",
    src: "https://images.unsplash.com/photo-1581094793769-4107200a6143?w=800&q=80",
    alt: "Wall repair and patching with seamless finish",
    category: "Repairs",
    width: 800,
    height: 600,
  },
  {
    id: "11",
    src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    alt: "Large scale commercial plastering project",
    category: "Commercial",
    width: 800,
    height: 1000,
  },
  {
    id: "12",
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    alt: "Bathroom renovation plastering with moisture-resistant finish",
    category: "Renovations",
    width: 800,
    height: 600,
  },
];

export const galleryCategories = [
  "All",
  "Residential",
  "Commercial",
  "Renovations",
  "New Homes",
  "Repairs",
  "Cornice",
] as const;
