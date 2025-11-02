import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/primitives/Button";
import { cn, waitFor } from "@/lib/utils";
import { Input } from "@/components/primitives/Input";
import { Label } from "@/components/primitives/Label";
import { Loader2 } from "lucide-react";

export function Form() {
  const [state, setState] = React.useState<
    "default" | "submitting" | "success"
  >("default");

  const content = React.useMemo(() => {
    switch (state) {
      case "submitting":
        return <Loader2 className="animate-spin w-5 h-5" />;
      case "success":
        return "Login link sent!";
      default:
        return "Send me a login link";
    }
  }, [state]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    // Simulates API request
    waitFor(2000).then(() => {
      setState("success");
    });
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[360px] space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          required
          name="email"
          placeholder="Enter email address"
        />
      </div>
      <Button
        type="submit"
        disabled={state !== "default"}
        className={cn(
          "w-full overflow-hidden",
          state === "success"
            ? "bg-green-700 dark:bg-green-700 disabled:opacity-100 text-white"
            : null,
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            initial={{
              opacity: 0,
              transform: "translateY(-20px)",
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              transform: "translateY(0px)",
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              transform: "translateY(20px)",
              filter: "blur(4px)",
            }}
            key={state}
            className="drop-shadow-xs"
          >
            {content}
          </motion.span>
        </AnimatePresence>
      </Button>
      <div
        className={cn(
          "text-xs! text-secondary! text-center opacity-0",
          state === "success" && "opacity-100",
        )}
      >
        Give it 2 minutes. If no link arrives, then try again
      </div>
    </form>
  );
}
