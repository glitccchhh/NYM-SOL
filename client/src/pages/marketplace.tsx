import { useState } from "react";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MarketplaceListing from "@/components/marketplace/MarketplaceListing";
import ListDomainForm from "@/components/marketplace/ListDomainForm";
import { Card } from "@/components/ui/card";

// Domain data based on realistic Solana domain names and pricing
const marketplaceListings = [
  {
    id: "1",
    name: "nft.sol",
    owner: "BvzKvn6nUUAYNFGFzqfQ9tBFUdpkADAGzAZFXQqJimJN",
    price: 42,
    isPremium: true,
  },
  {
    id: "2",
    name: "defi.sol",
    owner: "9PNuLzqt3GhS79p3CztrBQbYFLPgC9qrM5x5eMtN3W7n",
    price: 35,
    isPremium: true,
  },
  {
    id: "3",
    name: "meta.sol",
    owner: "DxSuBGBH2L6WdvJiNyiDQgLMqYY5yVPkFNbkfqrVK5Kb", 
    price: 60,
    isPremium: true,
  },
  {
    id: "4",
    name: "wallet.sol",
    owner: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    price: 27.5,
    isPremium: true,
  },
  {
    id: "5",
    name: "token.sol",
    owner: "74NxRGwPhyBJ8xkkytxCgBP4XVhWu38Df4wY6Fh2jMjX",
    price: 39.99,
    isPremium: true,
  },
  {
    id: "6",
    name: "dao.sol",
    owner: "2SGJsaYBP5UTUVwuAVuGkYnFTj43UBaPd3zvosdKJFpe", 
    price: 24.5,
    isPremium: true,
  }
];

export default function Marketplace() {
  const [listings] = useState(marketplaceListings);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [lengthFilter, setLengthFilter] = useState("all");

  // Filter and sort listings based on filters
  const filteredListings = listings
    .filter(listing => {
      // Apply search filter
      if (searchFilter && !listing.name.toLowerCase().includes(searchFilter.toLowerCase())) {
        return false;
      }
      
      // Apply length filter
      if (lengthFilter === "3-4" && (listing.name.length < 3 || listing.name.length > 4)) {
        return false;
      } else if (lengthFilter === "5-6" && (listing.name.length < 5 || listing.name.length > 6)) {
        return false;
      } else if (lengthFilter === "7+" && listing.name.length < 7) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sort option
      if (sortOption === "price-low") {
        return a.price - b.price;
      } else if (sortOption === "price-high") {
        return b.price - a.price;
      } else if (sortOption === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      
      // Default: recent
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Domain Marketplace</h1>
        <p className="text-gray-400">Buy and sell premium .sol domains</p>
      </div>

      <MarketplaceFilters 
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        lengthFilter={lengthFilter}
        setLengthFilter={setLengthFilter}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredListings.map(listing => (
          <MarketplaceListing key={listing.id} listing={listing} />
        ))}
      </div>

      <Card className="bg-darkBg/60 border-solana-purple p-6 shadow-lg shadow-[hsl(var(--solana-purple))/10]">
        <ListDomainForm />
      </Card>
    </div>
  );
}
