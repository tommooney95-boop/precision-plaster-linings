"use client";



import { cn } from "@/lib/utils";

import { ChevronDown } from "lucide-react";

import { useId, useState } from "react";



interface FAQItemProps {

  question: string;

  answer: string;

  defaultOpen?: boolean;

}



export function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {

  const [open, setOpen] = useState(defaultOpen);

  const answerId = useId();



  return (

    <div className="border-b border-surface-border">

      <button

        type="button"

        className="flex w-full items-center justify-between gap-4 py-5 text-left"

        onClick={() => setOpen(!open)}

        aria-expanded={open}

        aria-controls={answerId}

      >

        <span className="text-base font-semibold text-white md:text-lg">

          {question}

        </span>

        <ChevronDown

          className={cn(

            "h-5 w-5 shrink-0 text-accent transition-transform duration-300",

            open && "rotate-180"

          )}

          aria-hidden="true"

        />

      </button>

      <div

        id={answerId}

        role="region"

        aria-labelledby={answerId}

        hidden={!open}

        className={cn(

          "grid transition-all duration-300",

          open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"

        )}

      >

        <div className="overflow-hidden">

          <p className="text-sm leading-relaxed text-white/60 md:text-base">

            {answer}

          </p>

        </div>

      </div>

    </div>

  );

}


