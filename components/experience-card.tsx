"use client";

import Image from "next/image";

interface Experience {
  _id: string;
  title: string;
  location: string;
  image: string;
  description: string;
  price: number;
  rating?: number;
}

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="experience-card cursor-pointer hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={experience.image || "/placeholder.svg"}
          alt={experience.title}
          fill
          className="object-cover"
          priority={false}
          unoptimized={experience.image?.includes('unsplash.com')}
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {experience.title}
        </h3>
        <p className="text-xs text-gray-600 mb-3">{experience.location}</p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {experience.description}
        </p>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-600">From </span>
            <span className="font-semibold text-gray-900">
              ₹{experience.price.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            style={{
              backgroundColor: "#ffd700",
              color: "black",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontWeight: "500",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e6c200")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffd700")
            }
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}