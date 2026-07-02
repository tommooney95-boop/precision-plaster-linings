export interface Testimonial {

  id: string;

  name: string;

  role: string;

  location: string;

  rating: number;

  text: string;

  service: string;

}



export const testimonials: Testimonial[] = [

  {

    id: "1",

    name: "Michael Thompson",

    role: "Homeowner",

    location: "Albury, NSW",

    rating: 5,

    text: "Precision Plaster Linings transformed our renovation. The walls and ceilings are absolutely flawless. They were professional, on time and left the site spotless. Highly recommend!",

    service: "Renovations",

  },

  {

    id: "2",

    name: "Sarah Chen",

    role: "Property Manager",

    location: "Wodonga, VIC",

    rating: 5,

    text: "We use Precision Plaster for all our maintenance and insurance repair work. They're reliable, communicate well and always deliver quality results. Our tenants are always happy.",

    service: "Insurance Repairs",

  },

  {

    id: "3",

    name: "David Walsh",

    role: "Builder",

    location: "Thurgoona, NSW",

    rating: 5,

    text: "As a builder, I need plasterers I can trust on every job. Precision Plaster consistently delivers on time and to spec. They're my go-to team for all residential and commercial projects.",

    service: "Commercial Plastering",

  },

  {

    id: "4",

    name: "Emma Rodriguez",

    role: "Homeowner",

    location: "Lavington, NSW",

    rating: 5,

    text: "Had water damage to our ceiling after a storm. They came out quickly, handled the insurance paperwork and the repair is completely invisible. Couldn't be happier with the service.",

    service: "Ceiling Repairs",

  },

  {

    id: "5",

    name: "James O'Brien",

    role: "Real Estate Agent",

    location: "North Albury, NSW",

    rating: 5,

    text: "Before every listing, I call Precision Plaster for patch repairs and touch-ups. They make properties look their best and always work within tight pre-auction deadlines.",

    service: "Patch Repairs",

  },

  {

    id: "6",

    name: "Lisa Nguyen",

    role: "Renovator",

    location: "Corowa, NSW",

    rating: 5,

    text: "Our kitchen and bathroom reno needed extensive plastering work. The team was meticulous, friendly and the finish quality exceeded our expectations. Worth every dollar.",

    service: "Renovations",

  },

];


