import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/primitives/Input";
import { TextEditor } from "@/components/primitives/TextEditor";
import { useArtificialInboxStore, type ArtificialTask } from "./Store";
import { AssigneeField, StatusField, DueDateField } from "./TaskFormFields";
import { Badge } from "@/components/primitives/Badge";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ArtificialSkeletonActivity } from "@/components/demos/ArtificialInbox/Skeletons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/Button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Tooltip } from "@/components/primitives/Tooltip";

// Define form options
const ASSIGNEE_OPTIONS = [
  { value: "rob_hough", label: "Rob Hough" },
  { value: "dave_hawkins", label: "Dave Hawkins" },
  { value: "jimi_hendrix", label: "Jimi Hendrix" },
];

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

// Create zod schema for the form
const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assignee: z.string(),
  status: z.string(),
  policyId: z.string(),
  dueDate: z.date(),
  content: z.any(), // JSONContent type from TipTap or string
});

type TaskFormData = z.infer<typeof taskFormSchema>;

export function ArtificialTasks() {
  return (
    <div className="relative top-10 left-10  max-w-full max-h-full rounded-md overflow-hidden bg-background shadow-floating">
      <div className="grid grid-rows-[44px_1fr] h-full">
        <TasksHeader />
        <div className="w-full max-w-prose mx-auto p-6 lg:py-12">
          <TasksForm />
          <div className="flex flex-col gap-3 mt-6 px-2">
            <Separator />
            <h3 className="text-sm font-medium">Activity</h3>
            <ArtificialSkeletonActivity />
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksForm() {
  const { task, setTask } = useArtificialInboxStore();
  const [isSaving, setIsSaving] = React.useState(false);
  const isFirstRender = React.useRef(true);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      assignee: task.assignee,
      status: task.status,
      policyId: task.policyId,
      dueDate: task.dueDate,
      content: task.content,
    },
  });

  const watchedData = watch();

  // Debounced autosave callback
  const debouncedSave = useDebouncedCallback((data: TaskFormData) => {
    setIsSaving(true);

    // Mock async save with 800ms delay
    setTimeout(() => {
      setTask(data as ArtificialTask);
      setIsSaving(false);
    }, 800);
  }, 500);

  // Trigger save on data change (skip first render)
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    debouncedSave(watchedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedData)]);

  const onSubmit = (data: TaskFormData) => {
    setTask(data as ArtificialTask);
  };

  return (
    <>
      {isSaving && (
        <div className="absolute top-1.5 right-12 z-10">
          <Badge>Saving...</Badge>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col gap-4 transition-opacity",
          isSaving && "pointer-events-none opacity-50",
        )}
      >
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              {...field}
              className="font-semibold text-xl border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-gray-3 bg-transparent -mx-2 lg:text-2xl"
              placeholder="Task title"
              aria-invalid={errors.title ? "true" : "false"}
            />
          )}
        />
        <dl className="grid grid-cols-[120px_1fr] gap-1 px-2">
          <AssigneeField
            control={control}
            name="assignee"
            options={ASSIGNEE_OPTIONS}
          />
          <StatusField
            control={control}
            name="status"
            options={STATUS_OPTIONS}
          />
          <DueDateField control={control} name="dueDate" />
        </dl>
        <div className="mt-4 px-2">
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <TextEditor
                content={field.value}
                onContentChange={field.onChange}
                placeholder="Add description..."
                className="!prose-sm !prose-p:text-secondary"
              />
            )}
          />
        </div>
        <button type="submit" className="sr-only">
          Save Task
        </button>
      </form>
    </>
  );
}

function TasksHeader() {
  return (
    <header className="flex items-center gap-2 border-b px-3 h-[44px]">
      <div className="flex items-center gap-1">
        <Button size="icon">
          <ChevronUp className="size-4 opacity-70" />
        </Button>
        <Button size="icon">
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </div>
      <div className="flex items-center gap-1 select-none">
        <span className="text-sm font-medium text-gray-10">#001</span>
        <p className="text-sm font-medium text-primary">Coca Cola</p>
      </div>
      <Tooltip content="Close">
        <Button size="icon" className="ml-auto">
          <XMarkIcon className="size-4 opacity-70" />
        </Button>
      </Tooltip>
    </header>
  );
}
