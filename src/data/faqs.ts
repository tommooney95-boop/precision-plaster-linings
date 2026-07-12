import { siteConfig } from "@/lib/site-config";



export interface FAQ {

  question: string;

  answer: string;

}



export const faqs: FAQ[] = [

  {

    question: "How much does plastering cost?",

    answer:

      "Plastering costs vary depending on the scope of work, surface area and complexity. Small patch repairs typically start from $200–$500, while full room plastering can range from $1,500–$5,000+. Commercial projects are quoted individually. We provide free, no-obligation quotes so you know exactly what to expect before work begins.",

  },

  {

    question: "How long does plastering take?",

    answer:

      "Timelines depend on project size. Small patch repairs can often be completed in a single day. A standard room may take 2–3 days including drying time. Full home plastering typically takes 1–2 weeks. Commercial projects are scheduled based on scope. We always provide a clear timeline in your quote.",

  },

  {

    question: "Do you offer free quotes?",

    answer:

      "Yes! We offer completely free, no-obligation quotes for all plastering work. Simply fill out our online quote form, call us, or send an email. We aim to provide detailed quotes within 2 business days of your enquiry.",

  },

  {

    question: "Are you insured?",

    answer:

      "Absolutely. Precision Plaster Linings is fully insured with comprehensive public liability and workers compensation coverage. We can provide certificates of currency upon request for builders, property managers and commercial clients.",

  },

  {

    question: "Do you repair water damage?",

    answer:

      "Yes, water damage repair is one of our core services. We assess the extent of damage, remove affected plaster, treat any mould issues, install new board and finish to match existing surfaces. We also work with insurance companies and can provide documentation for claims.",

  },

  {

    question: "Do you do commercial work?",

    answer:

      `Yes, we specialise in both residential and commercial plastering. Our commercial services include office fit-outs, retail spaces, warehouses, suspended ceilings and multi-dwelling projects. We work with builders, developers and project managers across ${siteConfig.location.regionName} and the surrounding border region.`,

  },

  {

    question: "What areas do you service?",

    answer:

      `${siteConfig.location.serviceArea} Contact us to confirm we service your location.`,

  },

  {

    question: "Can you match existing textures and finishes?",

    answer:

      "Yes, texture matching is a specialty of ours. Whether you have orange peel, knockdown, smooth or custom textures, our experienced team can replicate existing finishes so repairs blend seamlessly with surrounding surfaces.",

  },

];


