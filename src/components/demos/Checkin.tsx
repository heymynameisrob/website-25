import * as React from "react";
import {
  ChatBubbleBottomCenterIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  TableCellsIcon,
} from "@heroicons/react/16/solid";
import { EditorProvider, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn, fromNow } from "@/lib/utils";
import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { AnimatePresence, motion } from "motion/react";
import {
  GitBranchPlus,
  Loader2,
  RefreshCcw,
  SendIcon,
  SmilePlusIcon,
} from "lucide-react";
import { subHours } from "date-fns";
import { EmojiPicker } from "@/components/primitives/EmojiPicker";

type Checkin = {
  id: string;
  content: JSONContent;
  createdAt: Date;
};

type Comment = {
  id: string;
  content: JSONContent;
  createdAt: Date;
  reactions?: Array<{ emoji: string; userId: string }>;
};

type Reaction = { emoji: string };

interface CheckinContextType {
  content: JSONContent | undefined;
  checkin: Checkin | null;
  comments: Comment[];
  reactions: Reaction[];
  setContent: (content: JSONContent) => void;
  setCheckin: (checkin: Checkin | null) => void;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setReactions: React.Dispatch<React.SetStateAction<Reaction[]>>;
}

const CheckinContext = React.createContext<CheckinContextType | undefined>(
  undefined,
);

function useCheckin() {
  const context = React.useContext(CheckinContext);
  if (!context) {
    throw new Error("useCheckin must be used within a CheckinProvider");
  }
  return context;
}

export function Checkin() {
  const [content, setContent] = React.useState<JSONContent>();
  const [checkin, setCheckin] = React.useState<Checkin | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [reactions, setReactions] = React.useState<Reaction[]>([]);

  return (
    <CheckinContext.Provider
      value={{
        content,
        setContent,
        checkin,
        setCheckin,
        comments,
        setComments,
        reactions,
        setReactions,
      }}
    >
      {checkin ? <CheckinView /> : <CheckinSubmit />}
    </CheckinContext.Provider>
  );
}

function CheckinSubmit() {
  const { content, setContent, checkin, setCheckin } = useCheckin();
  const [showActivity, setShowActivity] = React.useState(false);
  const editorRef = React.useRef<Editor | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (content) {
        setCheckin({
          id: "temp",
          content,
          createdAt: new Date(),
        });
      }
      return true;
    }
  };

  React.useEffect(() => {
    return () => {
      editorRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.commands.focus();
    }
  }, []);

  return (
    <div className="flex flex-col gap-3 p-3 w-[480px] bg-gray-2 shadow-[0_1px_0_0_rgba(0,0,0,0.01),0_1px_3px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.01),0_1px_3px_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.1)] rounded-lg">
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full bg-green-500" />
        <p className="text-sm font-medium !text-primary my-0">Rob Hough</p>
      </div>
      <TextEditor
        content={content}
        onUpdate={(content) => setContent(content)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowActivity(true)}
        onMount={(editor) => (editorRef.current = editor)}
        placeholder="What did you accomplish today?"
        className="max-h-[200px] min-h-[88px] overflow-y-scroll outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex items-center justify-between gap-2">
        {showActivity ? (
          <div className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span className="text-xs font-medium text-secondary">
              Gathering todays activty...
            </span>
          </div>
        ) : (
          <div />
        )}
        <Tooltip content="Post checkin • ⌘Enter">
          <Button
            size="sm"
            variant="default"
            disabled={!content}
            className="h-7 text-sm"
            onClick={() => {
              if (!content) return null;
              setCheckin({
                id: "temp",
                content,
                createdAt: new Date(),
              });
            }}
          >
            Post
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

function CheckinView() {
  const { checkin } = useCheckin();

  if (!checkin) return null;

  return (
    <article className="flex flex-col bg-gray-2 w-[480px] shadow-[0_1px_0_0_rgba(0,0,0,0.01),0_1px_3px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.01),0_1px_3px_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.1)] rounded-lg">
      <section className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-4 rounded-full bg-green-500" />
          <div className="flex items-baseline gap-1">
            <p className="text-sm font-medium !text-primary my-0">Rob Hough</p>
            <p className="text-xs text-primary my-0">
              {fromNow(checkin.createdAt)}
            </p>
          </div>
        </div>
        <TextEditor readOnly={true} content={checkin.content} />
      </section>
      <section className="px-4 pb-4">
        <CheckinActivity />
      </section>
      <section className="px-4">
        <CheckinReactions />
      </section>
    </article>
  );
}

function CheckinComments() {
  const { comments, setComments } = useCheckin();
  const [content, setContent] = React.useState<JSONContent | undefined>();
  const editorRef = React.useRef<Editor | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (content) {
        setContent(content);
      }
      return true;
    }
  };

  React.useEffect(() => {
    return () => {
      editorRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.commands.focus();
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 divide-y" data-testid="checkin-post">
      <AnimatePresence mode="popLayout" initial={false}>
        {comments?.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <CheckinComment comment={comment} key={comment.id} />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="w-full flex items-center justify-between gap-2 px-2 min-h-[44px] overflow-hidden">
        <TextEditor
          content={content}
          onUpdate={(content) => setContent(content)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          className="min-w-[300px] px-2 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Tooltip content="Post">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setComments((prev: Comment[]) => [
                ...prev,
                {
                  id: Math.random().toString(36).substring(2),
                  content: content!,
                  createdAt: new Date(),
                },
              ])
            }
          >
            <SendIcon className="w-4 h-4 opacity-70" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

function CheckinComment({ comment }: { comment: Comment }) {
  return (
    <div className="relative group z-10 flex flex-col justify-center gap-2 p-4">
      <div className="flex items-center gap-3">
        <div className="size-4 rounded-full bg-green-500" />
        <div className="flex items-baseline gap-1.5">
          <p className="text-sm font-medium text-primary my-0">Rob Hough</p>
          <p className="text-xs text-secondary my-0">
            {fromNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <TextEditor content={comment.content} readOnly={true} />
    </div>
  );
}

function TextEditor({
  content,
  onUpdate,
  onMount,
  onKeyDown,
  onFocus,
  placeholder,
  className,
  readOnly = false,
}: {
  content: JSONContent | undefined;
  onUpdate?: (content: JSONContent) => void;
  onMount?: (props: Editor) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}) {
  const handleOnUpdate = ({ editor }: { editor: Editor }) => {
    if (!onUpdate) return;
    const content = editor.getJSON();
    onUpdate(content);
  };

  return (
    <EditorProvider
      extensions={[StarterKit, Placeholder.configure({ placeholder })]}
      content={content}
      onUpdate={handleOnUpdate}
      onCreate={(props) => onMount?.(props.editor)}
      editable={!readOnly}
      immediatelyRender={false}
      editorProps={{
        attributes: {
          class: cn("prose dark:prose-invert", className),
          role: "textbox",
          "aria-multiline": "true",
          "aria-label": "textbox",
          "aria-description": "Write rich text",
        },
        handleDOMEvents: {
          keydown: (_view, event) => {
            onKeyDown?.(event);
          },
          focus: (_view, event) => {
            onFocus?.(event);
          },
        },
      }}
    />
  );
}

type Activity = {
  type: "github" | "cushion" | "google";
  icon: React.ReactNode;
  action: string;
  item: Array<{
    title: string;
    emoji?: string;
    tip?: string;
  }>;
  createdAt: Date;
};

const ACTIVITY: Activity[] = [
  // {
  //   type: "github",
  //   icon: <RefreshCcw className="size-4" />,
  //   action: "github_review",
  //   item: [
  //     {
  //       title: "#124",
  //       tip: "New table layout",
  //     },
  //     {
  //       title: "#125",
  //       tip: "Refactor API queries",
  //     },
  //   ],
  //   createdAt: subHours(new Date(), 1),
  // },
  {
    type: "cushion",
    icon: <CheckCircleIcon className="size-4" />,
    action: "cushion_resolved",
    item: [
      {
        title: "Should we refactor the API queries for posts?",
        emoji: "📦",
      },
    ],
    createdAt: subHours(new Date(), 4),
  },
  {
    type: "google",
    icon: <ChatBubbleLeftRightIcon className="size-4" />,
    action: "cushion_feedback",
    item: [
      {
        title: "User Interviews Q4",
        emoji: "🔍",
      },
    ],
    createdAt: subHours(new Date(), 3),
  },
  {
    type: "github",
    icon: <GitBranchPlus className="size-4" />,
    action: "github_merge",
    item: [
      {
        title: "#122",
        tip: "Bug fix on Sentry",
      },
      {
        title: "#123",
        tip: "Replace old dropdown menus",
      },
    ],
    createdAt: subHours(new Date(), 4),
  },
];

function CheckinActivity() {
  function getActionStyle(action: string) {
    switch (action) {
      case "github_merge":
        return "bg-purple-200 dark:bg-purple-200 text-purple-500";
      case "cushion_resolved":
        return "bg-cyan-200 dark:bg-cyan-200 text-cyan-500";
      case "cushion_feedback":
        return "bg-red-200 dark:bg-red-200 text-red-500";
      case "github_review":
        return "bg-emerald-200 dark:bg-emerald-200 text-emerald-500";
      default:
        return "bg-gray-200 dark:bg-gray-200 text-gray-500";
    }
  }

  function getActionStatus(action: string) {
    switch (action) {
      case "github_merge":
        return "merged branches";
      case "cushion_resolved":
        return "resolved post";
      case "cushion_feedback":
        return "left feedback on";
      case "github_review":
        return "marked for review";
      default:
        return "updated";
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-1 bottom-1 left-2.5 w-px bg-gray-4 z-0"></div>
      <AnimatePresence mode="popLayout">
        <ul className="flex flex-col p-0 m-0 gap-3">
          {ACTIVITY.map((activity, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.2,
                delay: index * 0.1,
              }}
              className="flex items-center gap-2 p-0 m-0"
            >
              <div
                className={cn(
                  "relative flex items-center justify-center size-5 rounded-md ring-2 ring-gray-2 z-10",
                  getActionStyle(activity.action),
                  "bg-gray-2 dark:bg-gray-2",
                )}
              >
                {activity.icon}
              </div>
              <div className="flex items-center gap-1.5 text-sm flex-wrap">
                <span className="font-medium text-primary">Rob Hough</span>
                <span className="text-secondary">
                  {getActionStatus(activity.action)}
                </span>
                {activity.type !== "github" &&
                  activity.item.map((item, index) => {
                    return (
                      <button
                        key={index}
                        className="px-1 py-0.5 h-6 leading-none rounded-md bg-gray-3 hover:bg-gray-4 text-primary font-medium text-sm flex items-center justify-center"
                      >
                        {item.emoji && (
                          <span className="mr-1">{item.emoji}</span>
                        )}
                        <span className="truncate max-w-[190px]">
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                {activity.type === "github" &&
                  activity.item.map((item, index) => {
                    return (
                      <Tooltip content={item.tip}>
                        <a
                          href="https://github.com"
                          key={index}
                          className="text-sm font-medium text-primary underline"
                        >
                          {item.title}
                        </a>
                      </Tooltip>
                    );
                  })}
              </div>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
}
function CheckinReactions() {
  const { reactions, setReactions } = useCheckin();

  // Group reactions by emoji and count them
  const groupedReactions = React.useMemo(() => {
    if (!reactions) return [];
    return reactions.reduce(
      (acc, { emoji }) => {
        acc[emoji] = (acc[emoji] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [reactions]);

  return (
    <div className="relative z-10 flex items-center gap-1.5 mb-4">
      {Object.entries(groupedReactions).map(([emoji, count]) => (
        <div key={emoji}>
          <Tooltip
            content={
              <div className="flex flex-col">
                <span className="text-xs">Rob Hough</span>
              </div>
            }
          >
            <Button
              variant="ghost"
              className={cn(
                "w-auto bg-gray-3 border border-primary/10 h-7 px-2 rounded-full hover:bg-gray-4",
              )}
              onClick={() => setReactions((prev) => [...prev, { emoji }])}
            >
              {emoji} <span className="ml-1 text-xs">{count}</span>
            </Button>
          </Tooltip>
        </div>
      ))}

      <EmojiPicker
        onEmojiSelect={(emoji) => setReactions((prev) => [...prev, { emoji }])}
        className="rounded-full bg-gray-2 border border-primary/10 hover:bg-gray-4"
        fallback={<SmilePlusIcon className="w-4 h-4 opacity-70" />}
      />
    </div>
  );
}
