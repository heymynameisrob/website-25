import * as React from "react";
import useSWR from "swr";
import { ChevronDown } from "lucide-react";
import { PopoverAnchor } from "@radix-ui/react-popover";

import {
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxRoot,
} from "@/components/Combobox";
import { Popover, PopoverContent } from "@/components/Popover";
import { fetcher } from "@/lib/fetch";

type Product = {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
};

export function ComboboxBasic() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>("");
  const [query, setQuery] = React.useState("");
  const { data, isLoading } = useSWR<{ products: Product[] }>(
    `https://dummyjson.com/products`,
    fetcher,
  );

  const products = React.useMemo(() => {
    if (!data?.products) return [];
    return data.products
      .map((product) => ({
        id: product.id,
        title: product.title,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [data]);

  const productsByLetter = React.useMemo(() => {
    return products.reduce(
      (acc, product) => {
        const letter = product.title[0].toUpperCase();
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(product);
        return acc;
      },
      {} as Record<string, typeof products>,
    );
  }, [products]);

  const handleValueChange = (value: string) => {
    setSelected(value);
    const product = products.find((p) => String(p.id) === value);
    if (product) {
      setQuery(product.title);
    }
    setOpen(false);
  };

  return (
    <ComboboxRoot
      value={selected}
      onValueChange={handleValueChange}
      query={query}
      onQueryChange={setQuery}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-1">
          <label htmlFor="search" className="font-medium text-sm text-primary">
            Select product
          </label>
          <PopoverAnchor className="flex items-center justify-between w-[300px] h-9 bg-gray-2 border focus rounded-lg dark:bg-gray-3 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring focus-within:ring-offset-gray-1">
            <ComboboxInput
              onFocus={() => setOpen(true)}
              id="search"
              autoFocus={false}
              className="flex-1 bg-transparent rounded-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-10 text-primary"
            />
            <ChevronDown className="size-4 opacity-50 mr-2" />
          </PopoverAnchor>
        </div>
        <PopoverContent
          className="p-0 w-[300px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
        >
          <ComboboxList className="max-h-[280px] p-1 overflow-y-scroll">
            {Object.entries(productsByLetter).map(([letter, products]) => (
              <ComboboxGroup key={letter} label={letter}>
                {products.map((product) => (
                  <ComboboxItem
                    key={product.id}
                    value={String(product.id)}
                    keywords={[product.title]}
                  >
                    <span className="truncate">{product.title}</span>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            ))}
            <ComboboxEmpty>No products</ComboboxEmpty>
          </ComboboxList>
        </PopoverContent>
      </Popover>
    </ComboboxRoot>
  );
}
