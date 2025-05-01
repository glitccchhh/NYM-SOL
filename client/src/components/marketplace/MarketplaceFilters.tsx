import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MarketplaceFiltersProps {
  searchFilter: string;
  setSearchFilter: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  lengthFilter: string;
  setLengthFilter: (value: string) => void;
}

export default function MarketplaceFilters({
  searchFilter,
  setSearchFilter,
  sortOption,
  setSortOption,
  lengthFilter,
  setLengthFilter
}: MarketplaceFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <div className="flex-grow max-w-md">
        <Input 
          type="text" 
          className="w-full bg-white/5 border-white/20 rounded-lg" 
          placeholder="Search marketplace"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>
      
      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger className="bg-white/5 border-white/20 rounded-lg">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="recent">Recently Listed</SelectItem>
          <SelectItem value="alphabetical">Alphabetical</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={lengthFilter} onValueChange={setLengthFilter}>
        <SelectTrigger className="bg-white/5 border-white/20 rounded-lg">
          <SelectValue placeholder="Length" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Length</SelectItem>
          <SelectItem value="3-4">3-4 Characters</SelectItem>
          <SelectItem value="5-6">5-6 Characters</SelectItem>
          <SelectItem value="7+">7+ Characters</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
