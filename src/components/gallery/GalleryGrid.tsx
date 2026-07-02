"use client";



import { galleryCategories, type GalleryImage } from "@/data/gallery";

import { cn } from "@/lib/utils";

import Image from "next/image";

import { useId, useState } from "react";



interface GalleryGridProps {

  images: GalleryImage[];

}



export function GalleryGrid({ images }: GalleryGridProps) {

  const [activeCategory, setActiveCategory] = useState<string>("All");

  const panelId = useId();



  const filtered =

    activeCategory === "All"

      ? images

      : images.filter((img) => img.category === activeCategory);



  return (

    <div>

      <div

        className="mb-8 flex flex-wrap justify-center gap-2"

        role="tablist"

        aria-label="Gallery categories"

      >

        {galleryCategories.map((category) => (

          <button

            key={category}

            type="button"

            role="tab"

            id={`tab-${category}`}

            aria-selected={activeCategory === category}

            aria-controls={panelId}

            onClick={() => setActiveCategory(category)}

            className={cn(

              "rounded-full px-4 py-2 text-sm font-medium transition-all",

              activeCategory === category

                ? "bg-accent text-white"

                : "bg-surface text-white/60 hover:bg-surface-elevated hover:text-white"

            )}

          >

            {category}

          </button>

        ))}

      </div>



      <div

        id={panelId}

        role="tabpanel"

        aria-label={`${activeCategory} gallery images`}

        className="columns-1 gap-4 sm:columns-2 lg:columns-3"

      >

        {filtered.map((image) => (

          <div

            key={image.id}

            className="mb-4 break-inside-avoid overflow-hidden rounded-2xl"

          >

            <Image

              src={image.src}

              alt={image.alt}

              width={image.width}

              height={image.height}

              className="w-full object-cover transition-transform duration-500 hover:scale-105"

              loading="lazy"

              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

            />

          </div>

        ))}

      </div>

    </div>

  );

}


