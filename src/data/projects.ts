export interface Project {
  id: string;
  title: string;
  location: string;
  duration: string;
  services: string[];
  description: string;
  beforeImage: string;
  afterImage: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Heritage Home Restoration",
    location: "Albury, NSW",
    duration: "3 weeks",
    services: ["Wall Repairs", "Cornice Installation", "Renovations"],
    description:
      "Complete plaster restoration of a 1920s heritage home including cornice replication and wall repairs throughout.",
    beforeImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  {
    id: "2",
    title: "Commercial Office Fit-out",
    location: "Wodonga, VIC",
    duration: "2 weeks",
    services: ["Commercial Plastering", "Suspended Ceilings"],
    description:
      "Full plastering and suspended ceiling installation for a 500sqm commercial office fit-out.",
    beforeImage:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
  {
    id: "3",
    title: "Water Damage Insurance Repair",
    location: "Lavington, NSW",
    duration: "5 days",
    services: ["Ceiling Repairs", "Insurance Repairs", "Wall Repairs"],
    description:
      "Emergency ceiling and wall repairs following storm water damage, completed with full insurance documentation.",
    beforeImage:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600566753190-17f0baa0a3b5?w=600&q=80",
  },
  {
    id: "4",
    title: "New Home Build — Double Storey",
    location: "Thurgoona, NSW",
    duration: "2 weeks",
    services: ["New Homes", "Residential Plastering"],
    description:
      "Complete internal plastering for a new double-storey family home including all walls, ceilings and wet areas.",
    beforeImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
  {
    id: "5",
    title: "Kitchen & Bathroom Reno",
    location: "North Albury, NSW",
    duration: "1 week",
    services: ["Renovations", "Patch Repairs"],
    description:
      "Plastering for a complete kitchen and bathroom renovation including new board installation and finishing.",
    beforeImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  },
  {
    id: "6",
    title: "Retail Store Fit-out",
    location: "Corowa, NSW",
    duration: "10 days",
    services: ["Commercial Plastering", "Cornice Installation"],
    description:
      "Premium plaster finishes for a high-end retail store including feature walls and decorative cornice work.",
    beforeImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
  },
];
