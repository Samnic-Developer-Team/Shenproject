"use client";

import type { Salon } from "@/types/salon.types";

interface SalonGalleryProps {
  salon: Salon;
}

const GALLERY_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8jIjcewQOlbL9STApz1t9beN3IwWPUIoEIRIKP5Cb2r_opdIIwk4I2c4ULnLTbFOFtNfpqUjq2CNHdtTzofWp6h1CVcNP54G_keqqjeiT5ua5ybIeNEuUTw3RTMIGassT7TUEuLa00_1HMFB5VLAUnzOPzBiLE8UPb_5Kb0MMNebwYdboi9rhGDz2NHiAGEhr_iJX0oVqwsWp_GHOVtu1pO3RUV876hEC5E2ro2n0x4xWrwJQh8WYkSWtux6_FNl-ewovf936g",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB3U--B6Fg150P23L0X7vArxGc3SEsTB22EKyAJ8I5CiVuYSdeCvR1sM7IL9O6N5Req9Pn76s1jSh4_F-WLwVbJb0S4ZynaanN8A0avba9tW25W3TKZ1tIG8wCRsSAw95udWGCjbwg8xTuiddoMO6DoxV0eY0HBQqg8-ec8K5k7qHeUwEvWBFgcmsp72y-7i0ZEPWUyYl0cmmVji-5kXvBqkpn--WayanFFq9EQwYMYhMmRZRV-ea1PBQvpHc5eoeo5rPSsjixt9Q",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1Uq283fQAvkGLcyMSiaOE6EmUbautwm8ke4HgH2IuUT2s8-HFSDFlcm2QzQnF-LMpGft6VhB2MgVcK4GLft_FOOPStTUQZWkVhCtT5mppAqRyvmBIr1IUiPxbkQ80LASBj8pfX-zgzMUb_YHgS3p3j1aKOjUnk0QBQzVZV61_6QKZ5pqE1dirmypaQctkchjyvSB0PRyztwNHpBD7enW4wL8RAiS5a-RmzxFpgs5QXW9uLVrzj-pP7YUAH7kizy1LZzvPQQ9P7A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDTiZkBArq0KoSUCTCCNizTzBLU55r_VJOaY7XOUaZwwW2HzdfNKtzX8QfShDGVN6aA5WGu2aOk0MdR70LNX0vZvMeXN8FBI6Hvf3FQElGLXFA0nBgjiXyrEFSoruadIvwSjTvLKyh7PncYkPejreKrjmkJcLEk_fI8BcAd4tyYARXmc_mXb0UiGmhSQGhuGYJJKIQDSe49j0tW1ajrIE3Xy_iZ2kEdfsbEfYy-RtAIbiwiUD4Guh-x4wS9ekVKh9mCOxAQ8WPOvA",
];

export function SalonGallery({ salon }: SalonGalleryProps) {
  return (
    <div className="space-y-6 select-none">
      <h3 className="text-lg font-bold text-on-surface">Inside our Atelier</h3>

      {/* Grid of gallery assets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Large Main Feature */}
        <div className="sm:col-span-2 aspect-[16/10] rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10 bg-surface-container-low group">
          <img
            alt={`${salon.name} interior feature`}
            src={salon.image || GALLERY_IMAGES[0]}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Column of 2 smaller images */}
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-outline-variant/5 bg-surface-container-low group">
            <img
              alt="Interior detail"
              src={GALLERY_IMAGES[1]}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-outline-variant/5 bg-surface-container-low group">
            <img
              alt="Styling detail"
              src={GALLERY_IMAGES[2]}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalonGallery;
