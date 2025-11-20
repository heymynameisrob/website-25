import * as React from "react";

import {
  ArtificialSkeletonTopBar,
  ArtificialSkeletonTable,
  type ArtificialTableOptionsProps,
} from "@/components/demos/ArtificialInbox/Skeletons";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/primitives/Tabs";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Sortable, SortableItem } from "@/components/primitives/Sortable";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/primitives/ContextMenu";
import { GlobeAltIcon, PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useArtificialInboxStore } from "@/components/demos/ArtificialInbox/Store";

const OPTIONS_TAB_MAP: Record<string, ArtificialTableOptionsProps> = {
  all: {
    draft: 4,
    quoted: 2,
    bound: 2,
    activeTab: "all",
  },
  renewals: {
    draft: 2,
    quoted: 0,
    bound: 0,
    activeTab: "renewals",
  },
  at_risk: {
    draft: 0,
    quoted: 1,
    bound: 0,
    activeTab: "at_risk",
  },
  marine: {
    draft: 3,
    quoted: 1,
    bound: 1,
  },
  custom: {
    draft: 2,
    quoted: 3,
    bound: 1,
  },
} as const;

export type ArtificialInboxTypes = "all" | "renewals" | "at_risk";

export function ArtificialInboxTabs() {
  const [activeTab, setActiveTab] = useLocalStorage<string>(
    "artificial-inbox-state",
    "all",
  );
  const [tabListOrder, setTabListOrder] = React.useState<string[]>([
    "renewals",
    "at_risk",
    "marine",
    "custom",
  ]);

  const name = useArtificialInboxStore((state) => state.name);
  const emoji = useArtificialInboxStore((state) => state.emoji);

  const tabConfig = {
    renewals: { label: "🔄 Renewals", value: "renewals" },
    at_risk: { label: "🚨 At Risk", value: "at_risk" },
    marine: { label: "🚢 Marine", value: "marine" },
    ...(name && { custom: { label: `${emoji} ${name}`, value: "custom" } }),
  };

  return (
    <div className="relative left-10 flex rounded-md overflow-hidden bg-background w-full shadow-floating aspect-video">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col">
          <ArtificialSkeletonTopBar />
          <div className="flex items-center px-4 h-12 border-b">
            <TabsList className="-mx-2">
              <TabsTrigger size="sm" value="all">
                All policies
              </TabsTrigger>
              <div className="w-1 h-6 bg-gray-3 rounded-full" />
              <Sortable
                items={tabListOrder}
                onSort={(newOrder) => setTabListOrder(newOrder)}
                orientation="horizontal"
              >
                {tabListOrder.map((tabId) => {
                  const tab = tabConfig[tabId as keyof typeof tabConfig];
                  if (!tab) return null;
                  return (
                    <>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <div>
                            <SortableItem key={tabId} id={tabId}>
                              <TabsTrigger size="sm" value={tab.value}>
                                {tab.label}
                              </TabsTrigger>
                            </SortableItem>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem className="gap-2">
                            <PencilIcon className="size-4 opacity-70" />
                            Edit
                          </ContextMenuItem>
                          <ContextMenuItem className="gap-2">
                            <GlobeAltIcon className="size-4 opacity-70" />
                            Share
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem className="gap-2 text-red-600">
                            <TrashIcon className="size-4 opacity-70" />
                            Delete
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </>
                  );
                })}
              </Sortable>
            </TabsList>
          </div>
          <TabsContent value="all">
            <ArtificialSkeletonTable options={OPTIONS_TAB_MAP["all"]} />
          </TabsContent>
          <TabsContent value="renewals">
            <ArtificialSkeletonTable options={OPTIONS_TAB_MAP["renewals"]} />
          </TabsContent>
          <TabsContent value="at_risk">
            <ArtificialSkeletonTable options={OPTIONS_TAB_MAP["at_risk"]} />
          </TabsContent>
          <TabsContent value="marine">
            <ArtificialSkeletonTable options={OPTIONS_TAB_MAP["marine"]} />
          </TabsContent>
          <TabsContent value="custom">
            <ArtificialSkeletonTable options={OPTIONS_TAB_MAP["custom"]} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
