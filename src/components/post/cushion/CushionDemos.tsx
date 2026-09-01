import { Checkin } from "@/components/demos/Checkin";
import { CushionCommand } from "@/components/demos/CushionCommand";
import { Thinking } from "@/components/demos/motion/Thinking";
import { PostDemo } from "@/components/post/PostDemo";

function renderCheckin() {
  return <Checkin />;
}

function renderCommandPalette() {
  return <CushionCommand />;
}

function renderAgentFeedback() {
  return <Thinking />;
}

export function CheckinDemo() {
  return (
    <PostDemo initialOptions={null} caption="Tip: You can use Markdown when writing a checkin">
      {renderCheckin}
    </PostDemo>
  );
}

export function CommandPaletteDemo() {
  return <PostDemo initialOptions={null}>{renderCommandPalette}</PostDemo>;
}

export function AgentFeedbackDemo() {
  return <PostDemo initialOptions={null}>{renderAgentFeedback}</PostDemo>;
}
