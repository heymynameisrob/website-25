import * as React from "react";
import useSWR from "swr";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/Button";
import {
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxRoot,
  useCombobox,
} from "@/components/Combobox";
import { cn, getAvatarColour, getInitialsFromFullName } from "@/lib/utils";
import { fetcher } from "@/lib/fetch";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

type ResponseUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export function ComboboxSidebar() {
  return (
    <ComboboxRoot>
      <div
        className={cn(
          "w-[320px] border-l border-t flex flex-col h-full bg-gray-2 rounded-xl",
          "mask-linear mask-b-to-transparent mask-b-from-50% mask-r-to-transparent mask-r-from-50%",
        )}
      >
        <header className="px-1.5 h-11 flex items-center border-b">
          <Button size="icon" variant="ghost" className="rounded-full">
            <ArrowLeftIcon className="size-4 opacity-70" />
          </Button>
        </header>
        <div className="p-4">
          <ComboboxInput
            autoFocus={false}
            className="h-9 bg-gray-2 border focus rounded-lg dark:bg-gray-3"
          />
          <ComboboxSidebarList />
        </div>
      </div>
    </ComboboxRoot>
  );
}

function ComboboxSidebarList() {
  const { query } = useCombobox();
  const [value] = useDebounce(query, 500);
  const { data, isLoading } = useSWR<{ users: ResponseUser[] }>(
    value.length > 1 ? `https://dummyjson.com/users/search?q=${value}` : null,
    fetcher,
  );

  if (isLoading)
    return (
      <div className="p-6 grid place-items-center w-full">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  if (!data && query.length === 0) {
    return (
      <div className="p-6 grid place-items-center w-full">
        <p className="text-sm text-gray-10">Search for users</p>
      </div>
    );
  }

  return (
    <ComboboxList className="max-h-[200px] px-1 overflow-y-scroll py-2">
      {!isLoading &&
        data &&
        data.users.map((item) => {
          const name = `${item.firstName} ${item.lastName}`;
          return (
            <ComboboxItem
              key={item.id}
              value={name}
              keywords={[name, item.email]}
              className="flex items-center gap-2 -mx-1"
            >
              <div
                className={cn(
                  "size-6 grid place-items-center rounded-full text-xs",
                  getAvatarColour(name),
                )}
              >
                {getInitialsFromFullName(name)}
              </div>
              <span className="truncate font-medium text-primary">{name}</span>
            </ComboboxItem>
          );
        })}
    </ComboboxList>
  );
}
