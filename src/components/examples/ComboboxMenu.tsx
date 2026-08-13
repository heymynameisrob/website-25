import useSWR from "swr";

import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/fetch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxRoot,
} from "@/components/Combobox";
import React from "react";
import { Tooltip } from "@/components/Tooltip";

type ResponseCountry = {
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
};

export function ComboboxPopoverMenu() {
  const { data } = useSWR<ResponseCountry[]>(
    `https://restcountries.com/v3.1/all?fields=name,flags`,
    fetcher,
  );
  const [selected, setSelected] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const countries = React.useMemo(() => {
    if (!data) return [];
    return data
      .map((country) => ({
        value: country.name.common.toLowerCase(),
        label: country.name.common,
        flag: country.flags.svg,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  const countriesByLetter = React.useMemo(() => {
    return countries.reduce(
      (acc, country) => {
        const letter = country.label[0].toUpperCase();
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(country);
        return acc;
      },
      {} as Record<string, typeof countries>,
    );
  }, [countries]);

  const selectedCountry = countries.find(
    (country) => country.value === selected,
  );
  return (
    <ComboboxRoot
      value={selected}
      onValueChange={setSelected}
      onValueSelected={() => setOpen(false)}
    >
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger
          className={cn(
            "px-2 w-[200px] inline-flex items-center justify-between h-9 gap-2 bg-gray-1 shadow-container rounded-lg text-sm font-medium",
            "focus-visible:ring-2 ring-ring focus-visible:ring-offset-2 ring-offset-gray-1",
            "transition-all hover:bg-gray-2 data-[state=open]:ring-2 data-[state=open]:ring-offset-2",
            "dark:bg-gray-2 dark:hover:bg-gray-3",
          )}
        >
          <div className="flex items-center gap-2">
            {selectedCountry ? (
              <>
                <img
                  src={selectedCountry.flag}
                  alt={selectedCountry.label}
                  loading="lazy"
                  className="w-5 h-auto"
                />
                <span className="truncate text-primary">
                  {selectedCountry.label}
                </span>
              </>
            ) : (
              <span className="truncate text-gray-10">Select a country</span>
            )}
          </div>
          <ChevronDownIcon className="w-4 h-4 opacity-60" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <ComboboxInput className="dark:bg-gray-2 border-b" />
          <ComboboxList
            className="max-h-[300px] px-1 overflow-y-scroll"
            autoFocus={true}
          >
            {Object.entries(countriesByLetter).map(([letter, countries]) => {
              return (
                <ComboboxGroup key={letter} label={letter}>
                  {countries.map((country) => (
                    <ComboboxItem
                      key={country.value}
                      value={country.value}
                      keywords={[country.label]}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={country.flag}
                          alt={country.label}
                          loading="lazy"
                          className="w-5 h-auto"
                        />
                        <span className="truncate text-primary">
                          {country.label}
                        </span>
                      </div>
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              );
            })}
            <ComboboxEmpty>No results found</ComboboxEmpty>
          </ComboboxList>
        </PopoverContent>
      </Popover>
    </ComboboxRoot>
  );
}
