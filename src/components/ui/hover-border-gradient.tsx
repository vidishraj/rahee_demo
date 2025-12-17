"use client";
import React, { useState, useEffect, useRef } from "react";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 0.75,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const [rotationCount, setRotationCount] = useState(0);
  const [isInitialGlow, setIsInitialGlow] = useState(true);
  const [pulsationCount, setPulsationCount] = useState(0);
  
  // Color sequence: White -> Red -> Blue -> Green -> Purple (repeat) 
  const getColorsForRotation = (count: number) => {
    const cycle = count % 5;
    switch(cycle) {
      case 0: return {
        main: "hsl(0, 0%, 100%)", // White
        light: "hsl(0, 0%, 90%)" // Light white
      };
      case 1: return {
        main: "hsl(0, 100%, 50%)", // Bright Red
        light: "hsl(0, 100%, 70%)" // Light red
      };
      case 2: return {
        main: "hsl(240, 100%, 50%)", // Bright Blue
        light: "hsl(240, 100%, 70%)" // Light blue
      };
      case 3: return {
        main: "hsl(120, 100%, 40%)", // Bright Green
        light: "hsl(120, 100%, 60%)" // Light green
      };
      case 4: return {
        main: "hsl(280, 100%, 50%)", // Bright Purple
        light: "hsl(280, 100%, 70%)" // Light purple
      };
      default: return {
        main: "hsl(0, 0%, 100%)",
        light: "hsl(0, 0%, 90%)"
      };
    }
  };

  // White glow pattern for initial pulsation
  const whiteGlowMap: Record<Direction, string> = {
    TOP: "radial-gradient(100% 100% at 50% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0.8) 70%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(100% 100% at 50% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0.8) 70%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM: "radial-gradient(100% 100% at 50% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0.8) 70%, rgba(255, 255, 255, 0) 100%)",
    RIGHT: "radial-gradient(100% 100% at 50% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0.8) 70%, rgba(255, 255, 255, 0) 100%)",
  };

  const currentColors = getColorsForRotation(rotationCount);
  const coloredMovingMap: Record<Direction, string> = {
    TOP: `radial-gradient(30% 65% at 50% 0%, ${currentColors.light} 0%, ${currentColors.main} 50%, ${currentColors.light} 80%, rgba(255, 255, 255, 0) 100%)`,
    LEFT: `radial-gradient(28% 60% at 0% 50%, ${currentColors.light} 0%, ${currentColors.main} 50%, ${currentColors.light} 80%, rgba(255, 255, 255, 0) 100%)`,
    BOTTOM: `radial-gradient(30% 65% at 50% 100%, ${currentColors.light} 0%, ${currentColors.main} 50%, ${currentColors.light} 80%, rgba(255, 255, 255, 0) 100%)`,
    RIGHT: `radial-gradient(28% 60% at 100% 50%, ${currentColors.light} 0%, ${currentColors.main} 50%, ${currentColors.light} 80%, rgba(255, 255, 255, 0) 100%)`,
  };

  const movingMap = isInitialGlow ? whiteGlowMap : coloredMovingMap;

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      if (isInitialGlow) {
        // Transition to color rotation after 2 pulsations (1.6 seconds)
        const transitionTimer = setTimeout(() => {
          setIsInitialGlow(false);
          setRotationCount(0); // Reset to start with white
        }, 1600); // 2 pulsations at 0.8s each
        
        return () => clearTimeout(transitionTimer);
      } else {
        // Start intervals immediately when transitioning out of initial glow
        const directionInterval = setInterval(() => {
          setDirection((prevState) => rotateDirection(prevState));
        }, duration * 1000);
        
        const colorInterval = setInterval(() => {
          setRotationCount(count => count + 1);
        }, 300);
        
        return () => {
          clearInterval(directionInterval);
          clearInterval(colorInterval);
        };
      }
    }
  }, [hovered, duration, clockwise, isInitialGlow]);
  return (
    <Tag
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex border content-center transition duration-500 items-center justify-center overflow-visible p-[0.5px] decoration-clone w-fit",
        containerClassName
      )}
      style={{backgroundColor: "#121212", borderRadius: "30px"}}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: "30px 30px 30px 30px !important",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: isInitialGlow 
            ? [
                "radial-gradient(100% 100% at 50% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%)",
                "radial-gradient(100% 100% at 50% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0.9) 70%, rgba(255, 255, 255, 0) 100%)",
                "radial-gradient(100% 100% at 50% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%)"
              ]
            : (hovered
                ? [movingMap[direction], highlight]
                : movingMap[direction]),
        }}
        transition={{ 
          ease: isInitialGlow ? "easeInOut" : "linear", 
          duration: isInitialGlow ? 0.8 : (duration ?? 0.75),
          repeat: isInitialGlow ? 1 : undefined, // Repeat once (2 total cycles)
          repeatType: isInitialGlow ? "loop" : undefined
        }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
