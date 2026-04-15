import { MapPin, Phone } from "lucide-react";
import type { Business } from "../types";
import { getImageUrl } from "../utils/imageUrl";

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
}

const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  const primaryImage = getImageUrl(business.image?.[0]);
  const categoryText = Array.isArray(business.category)
    ? business.category.length
      ? business.category.join(", ")
      : "Uncategorized"
    : business.category || "Uncategorized";
  const fullAddress = [
    business.address,
    business.city,
    business.state,
    business.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left focus:outline-none focus:ring-2 focus:ring-bm-coral focus:ring-offset-2"
    >
      {/* Business Image Container */}
      <div className="h-44 w-full overflow-hidden bg-gray-100">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${business.name} storefront`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            No image available
          </div>
        )}
      </div>

      {/* Business Content Container */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-bm-dark line-clamp-1">
          {business.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">{categoryText}</p>

        {/* Business Address Row */}
        <div className="flex items-start gap-2 text-sm text-gray-700">
          <MapPin size={16} className="mt-0.5 shrink-0 text-bm-coral" />
          <span>{fullAddress || "Address not available"}</span>
        </div>

        {/* Business Phone Row */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone size={16} className="shrink-0 text-bm-coral" />
          <span>{business.phone || "Phone not available"}</span>
        </div>
      </div>
    </button>
  );
};

export default BusinessCard;
