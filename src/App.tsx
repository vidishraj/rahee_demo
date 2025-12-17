import { Button } from "./components/ui/moving-border";
import { HoverBorderGradientDemo } from "./components/ui/main";
import React from "react";

function App() {
  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center gap-8"
      style={{ backgroundColor: "#121212" }}
    >
      <Button
        borderRadius="1.75rem"
        containerClassName="h-16 w-40 p-[2px] !p-[2px]"
        borderClassName=""
        className="bg-black text-white font-bold p-0 border-0"
      >
        Moving Border
      </Button>

      <HoverBorderGradientDemo />
    </div>
  );
}

export default App;
