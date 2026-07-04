"use client";



import { useMounted } from "@/hooks/useMounted";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

import { type ReactNode } from "react";



interface AnimatedSectionProps {

  children: ReactNode;

  className?: string;

  delay?: number;

  id?: string;

}



const variants: Variants = {

  hidden: { opacity: 0, y: 24 },

  visible: (delay: number) => ({

    opacity: 1,

    y: 0,

    transition: {

      duration: 0.6,

      delay,

      ease: [0.25, 0.1, 0.25, 1],

    },

  }),

};



export function AnimatedSection({

  children,

  className,

  delay = 0,

  id,

}: AnimatedSectionProps) {

  const mounted = useMounted();

  const prefersReducedMotion = useReducedMotion();



  return (

    <motion.section

      id={id}

      initial={mounted && !prefersReducedMotion ? "hidden" : false}

      whileInView={prefersReducedMotion ? undefined : "visible"}

      viewport={{ once: true, margin: "-80px" }}

      custom={delay}

      variants={variants}

      className={cn(className)}

    >

      {children}

    </motion.section>

  );

}


