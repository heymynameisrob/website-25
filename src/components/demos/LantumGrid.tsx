import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  DndContext,
  MouseSensor,
  useDraggable,
  useDroppable,
  useSensor,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { Loader2 } from "lucide-react";

export const LantumGrid = () => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [parent, setParent] = React.useState<number>(8);
  const [showToast, setShowToast] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const activationContraint = {
    distance: 10,
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: activationContraint,
  });

  const handleSave = () => {
    setShowToast(true);
    setSaving(true);

    setTimeout(() => setSaving(false), 1500);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden w-full max-w-3xl [box-shadow:var(--shadow-raised)]",
      )}
    >
      <DndContext
        sensors={[mouseSensor]}
        modifiers={[snapCenterToCursor]}
        onDragStart={() => {
          setIsDragging(true);
        }}
        onDragEnd={({ over, active }: any) => {
          if (!active.data.current.supports.includes(over.data.current.type))
            return;
          setParent(over ? over.id : parent);
          setIsDragging(false);
          handleSave();
        }}
        onDragCancel={() => setIsDragging(false)}
      >
        <DraggableGrid
          isDragging={isDragging}
          parent={parent}
          saving={saving}
        />
      </DndContext>
      <SaveToast saving={saving} showToast={showToast} />
    </div>
  );
};

const Dropzone = (props: any) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: props.id,
    data: {
      type: props.data,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-[90px] border-l border-r-0 border-b p-2",
        isOver ? "bg-gray-2" : "bg-background",
        isOver &&
          active &&
          active.data.current &&
          active.data.current.supports !== props.data &&
          "bg-red-50 border-red-500 border-2 border-r-2] dark:bg-red-500/10",
      )}
    >
      {props.children}
    </div>
  );
};

const Draggable = (props: any) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: {
      supports: props.data,
    },
  });

  return (
    <motion.button
      ref={setNodeRef}
      className={cn(
        "flex flex-col p-1 rounded h-10 w-full text-sm bg-teal-400 text-teal-950 shadow-none rotate-0 hover:cursor-grab active:cursor-grabbing",
        props.disabled && "pointer-events-none",
      )}
      layout="position"
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scale: props.isDragging ? 0.96 : 1,
              zIndex: props.isDragging ? 1 : 0,
              rotate: transform.x > 0 ? 5 : transform.x < 0 ? -5 : 0,
              boxShadow: props.isDragging
                ? "0 0 0 1px rgba(0, 0, 0, 0.05), 0px 15px 15px 0 rgba(0, 0, 0, 0.16)"
                : "0 0 0 1px rgba(0, 0, 0, 0), 0px 15px 15px 0 rgba(0, 0, 0, 0)",
            }
          : {
              x: 0,
              y: 0,
              scale: 1,
            }
      }
      transition={{
        duration: !props.isDragging ? 0.2 : 0,
        type: "spring",
        bounce: 0,
        zIndex: {
          delay: props.isDragging ? 0 : 0.25,
        },
      }}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </motion.button>
  );
};

const DraggableGrid = ({ parent, saving, isDragging }: any) => {
  return (
    <div
      className={cn(
        "grid justify-end grid-cols-7 gap-0",
        saving && "pointer-events-none opacity-50",
      )}
    >
      {[...Array(28)].map((_, id) => {
        if (id === 0 || id === 7 || id === 14 || id === 21)
          return <RowHeader key={id} id={id} />;
        return (
          <Dropzone id={id} key={id} data={id < 21 ? "FY1" : "SHO"}>
            {parent === id ? (
              <Draggable
                id={"draggable"}
                data="FY1"
                isDragging={isDragging}
                disabled={saving}
              >
                <small className="!text-xs font-medium">FY Long</small>
                <span className="text-xs opacity-80">Ward A</span>
              </Draggable>
            ) : null}
            {id % 2 ? (
              <div className="flex flex-col p-1 rounded bg-gray-1 h-10 w-full text-sm"></div>
            ) : null}
          </Dropzone>
        );
      })}
    </div>
  );
};

const RowHeader = ({ id }: any) => {
  return (
    <div className="h-[90px] p-2 bg-gray-2 text-xs flex flex-col border-b">
      <small className="!text-xs font-medium">
        {id === 0 && "J.Smith"}
        {id === 7 && "H.Goodman"}
        {id === 14 && "A.Jones"}
        {id === 21 && "O.Wilson"}
      </small>
      <span className="text-xs text-secondary">{id < 21 ? "FY1" : "SHO"}</span>
    </div>
  );
};

const SaveToast = ({ showToast, saving }: any) => {
  return (
    <AnimatePresence>
      {showToast ? (
        <motion.div
          key="toast"
          initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.2, bounce: 0, type: "spring" }}
          className="absolute bottom-4 left-4 bg-black text-white p-2 shadow-xl rounded-md flex items-center gap-1"
        >
          <motion.div
            transition={{
              type: "spring",
              duration: 0.2,
              bounce: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={String(saving)}
            className="flex items-center gap-1"
          >
            {saving ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={14}
                  color="rgba(255, 255, 255, 0.65)"
                />
                <small className="text-xs font-medium">Saving...</small>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <small className="text-xs font-medium">Saved!</small>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
