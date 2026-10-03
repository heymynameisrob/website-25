import { titleShaderConfig } from "@/lib/shader";
import { ShaderLabComposition } from "@basementstudio/shader-lab";

export function ShaderTitle() {
  return (
    <div className="mask-b from-background to transparent" style={{ mixBlendMode: "screen" }}>
      <h1 className="sr-only">heymynameisrob</h1>
      <ShaderLabComposition config={titleShaderConfig} />
    </div>
  );
}
