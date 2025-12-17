"use client";
import React, { useState, useEffect } from "react";

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
  const [direction, setDirection] = useState<Direction>("LEFT");

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
  const [cycleCount, setCycleCount] = useState(0);
  
  // Color sequence: Intense neon colors 
  const getColorsForRotation = (count: number) => {
    const cycle = count % 6;
    switch(cycle) {
      case 0: return {
        main: "hsl(0, 0%, 100%)", // Pure White
        light: "hsl(0, 0%, 85%)" // Light white
      };
      case 1: return {
        main: "hsl(0, 100%, 60%)", // Intense Red
        light: "hsl(0, 100%, 80%)" // Bright red
      };
      case 2: return {
        main: "hsl(280, 100%, 60%)", // Electric Purple
        light: "hsl(280, 100%, 80%)" // Bright purple
      };
      case 3: return {
        main: "hsl(240, 100%, 60%)", // Electric Blue
        light: "hsl(240, 100%, 80%)" // Bright blue
      };
      case 4: return {
        main: "hsl(180, 100%, 50%)", // Electric Cyan
        light: "hsl(180, 100%, 70%)" // Bright cyan
      };
      case 5: return {
        main: "hsl(120, 100%, 50%)", // Electric Green
        light: "hsl(120, 100%, 70%)" // Bright green
      };
      default: return {
        main: "hsl(0, 0%, 100%)",
        light: "hsl(0, 0%, 85%)"
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
        // Transition to color rotation immediately after loading animation completes (2.5 seconds)
        const transitionTimer = setTimeout(() => {
          setIsInitialGlow(false);
          setRotationCount(0); // Reset to start with white
        }, 2500); // Start rotation right after loading completes
        
        return () => clearTimeout(transitionTimer);
      } else {
        // Start intervals immediately when transitioning out of initial glow
        let directionInterval: ReturnType<typeof setInterval>;
        let colorInterval: ReturnType<typeof setInterval>;
        
        // Small delay to ensure smooth transition timing
        const startTimeout = setTimeout(() => {
          directionInterval = setInterval(() => {
            setDirection((prevState) => rotateDirection(prevState));
          }, duration * 1000);
          
          colorInterval = setInterval(() => {
            setRotationCount(count => {
              const newCount = count + 1;
              // After 5 complete color rotations (30 total changes: 6 colors * 5 cycles), restart the pattern
              if (newCount >= 30) {
                setTimeout(() => {
                  setIsInitialGlow(true);
                  setCycleCount(prev => prev + 1);
                }, 100); // Small delay to ensure smooth transition
                return 0;
              }
              return newCount;
            });
          }, 300);
          
          // Start first rotation immediately
          setRotationCount(1);
        }, 50); // Small delay for better timing sync
        
        return () => {
          clearTimeout(startTimeout);
          if (directionInterval) clearInterval(directionInterval);
          if (colorInterval) clearInterval(colorInterval);
        };
      }
    }
  }, [hovered, duration, clockwise, isInitialGlow, cycleCount]);
  return (
    <Tag
      onMouseEnter={() => {
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
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(120, 160, 255, 0.9) 3deg, rgba(120, 160, 255, 0.9) 357deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(150, 180, 255, 0.95) 8deg, rgba(150, 180, 255, 0.95) 352deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(180, 200, 255, 1) 15deg, rgba(180, 200, 255, 1) 345deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(210, 225, 255, 1) 25deg, rgba(210, 225, 255, 1) 335deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(240, 245, 255, 1) 35deg, rgba(240, 245, 255, 1) 325deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 50deg, white 310deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 70deg, white 290deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 90deg, white 270deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 115deg, white 245deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 140deg, white 220deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 170deg, white 190deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, rgba(255, 255, 255, 0.95) 0deg, white 180deg, rgba(255, 255, 255, 0.95) 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(120, 160, 255, 0.9) 3deg, rgba(120, 160, 255, 0.9) 357deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(150, 180, 255, 0.95) 8deg, rgba(150, 180, 255, 0.95) 352deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(180, 200, 255, 1) 15deg, rgba(180, 200, 255, 1) 345deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(210, 225, 255, 1) 25deg, rgba(210, 225, 255, 1) 335deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(240, 245, 255, 1) 35deg, rgba(240, 245, 255, 1) 325deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 50deg, white 310deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 70deg, white 290deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 90deg, white 270deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 115deg, white 245deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 140deg, white 220deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 170deg, white 190deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, rgba(255, 255, 255, 0.95) 0deg, white 180deg, rgba(255, 255, 255, 0.95) 360deg)"
              ]
            : (hovered
                ? [movingMap[direction], highlight]
                : movingMap[direction]),
        }}
        transition={{ 
          ease: isInitialGlow ? "easeInOut" : "linear", 
          duration: isInitialGlow ? 2.5 : (duration ?? 0.75),
          repeat: isInitialGlow ? 0 : undefined,
          repeatType: isInitialGlow ? "loop" : undefined
        }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
