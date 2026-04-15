import { Globe, MapPin, Phone, Star, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { Business } from "../types";
import { HashLink } from "react-router-hash-link";
import { getImageUrl } from "../utils/imageUrl";

interface BusinessCardModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

const BusinessCardModal = ({
  business,
  isOpen,
  onClose,
}: BusinessCardModalProps) => {
  const navigate = useNavigate();
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  if (!isOpen || !business) return null;

  const primaryImage = getImageUrl(business.image?.[0]);
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  let parsedUser: { isBusinessOwner?: boolean } | null = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      parsedUser = null;
    }
  }
  const isBusinessOwner = Boolean(parsedUser?.isBusinessOwner);
  const canWriteReview = isLoggedIn && !isBusinessOwner;
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

  const openImage = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const closeImage = () => {
    setExpandedImage(null);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Image Section */}
          <div className="relative h-64 w-full overflow-hidden bg-gray-100 sm:h-80">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={business.name}
                className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 hover:scale-[1.02]"
                role="button"
                tabIndex={0}
                onClick={() => openImage(primaryImage)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openImage(primaryImage);
                  }
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-500">
                No image available
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:text-bm-coral"
              aria-label="Close business details"
            >
              <X size={20} />
            </button>
            {/* Hero Overlay Content */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex flex-wrap items-center gap-3 text-white/90">
                <span className="rounded-full bg-bm-coral px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Business Details
                </span>
                {business.averageReviewScore !== undefined && (
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                    <Star size={14} className="fill-current text-yellow-300" />
                    {business.averageReviewScore.toFixed(1)} average rating
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {business.name}
              </h2>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.9fr]">
            {/* Left Content Column */}
            <div className="space-y-5">
              <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Category
                </h3>
                <p className="text-base text-gray-800">{categoryText}</p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </h3>
                <p className="leading-7 text-gray-700">
                  {business.description || "No description provided."}
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Images
                </h3>
                {/* Thumbnail Gallery Grid */}
                {business.image?.length ? (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {business.image.map((image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={getImageUrl(image)}
                        alt={`${business.name} ${index + 1}`}
                        className="h-24 w-full cursor-zoom-in rounded-xl object-cover transition-transform duration-300 hover:scale-105"
                        role="button"
                        tabIndex={0}
                        onClick={() => openImage(image)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openImage(image);
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No additional images available.
                  </p>
                )}
              </section>
            </div>

            <aside className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Business Info
              </h3>

              {/* Business Info List */}
              <div className="space-y-4 text-sm text-gray-700">
                {/* Address Row */}
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-bm-coral" />
                  <span>{fullAddress || "Address not available"}</span>
                </div>

                {/* Phone Row */}
                <div className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-bm-coral" />
                  {business.phone ? (
                    <a
                      href={`tel:${business.phone}`}
                      className="text-bm-coral hover:underline"
                    >
                      {business.phone}
                    </a>
                  ) : (
                    <span>Phone not available</span>
                  )}
                </div>

                {/* Website Row */}
                <div className="flex items-start gap-3">
                  <Globe size={16} className="mt-0.5 shrink-0 text-bm-coral" />
                  {business.websiteLink ? (
                    <a
                      href={business.websiteLink}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-bm-coral hover:underline"
                    >
                      {business.websiteLink}
                    </a>
                  ) : (
                    <span>Website not available</span>
                  )}
                </div>

                {/* Rating Row */}
                <div className="flex items-start gap-3">
                  <Star size={16} className="mt-0.5 shrink-0 text-bm-coral" />
                  <span>
                    {business.averageReviewScore !== undefined
                      ? `${business.averageReviewScore.toFixed(1)} average rating`
                      : "No ratings yet"}
                  </span>
                </div>
              </div>

              {canWriteReview && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/review/${business._id}`);
                  }}
                  className="mt-2 w-full rounded-lg bg-bm-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-bm-coral-dark"
                >
                  Write a Review
                </button>
              )}

              <HashLink to={`/business/${business._id}/#reviews`}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    //navigate(`/business/${business._id}/#reviews`);
                  }}
                  className="mt-0 w-full rounded-lg bg-bm-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-bm-coral-dark"
                >
                  View Reviews
                </button>
              </HashLink>
            </aside>
          </div>
        </div>

        {/* Expanded Image Backdrop */}
        {expandedImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-6"
            onClick={(e) => {
              e.stopPropagation();
              closeImage();
            }}
          >
            {/* Expanded Image Container */}
            <div
              className="relative max-h-[90vh] max-w-[95vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeImage}
                className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-colors hover:text-bm-coral"
                aria-label="Close expanded image"
              >
                <X size={20} />
              </button>
              <img
                src={expandedImage}
                alt={`${business.name} expanded view`}
                className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BusinessCardModal;
