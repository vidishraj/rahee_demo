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

  const [rotationCount, setRotationCount] = useState(1); // Start with red (not white)
  const [isInitialGlow, setIsInitialGlow] = useState(false); // Start with rotating colors
  
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


  // Start rotation immediately on mount
  useEffect(() => {
    if (!hovered) {
      const directionInterval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      
      const colorInterval = setInterval(() => {
        setRotationCount(count => (count + 1) % 30);
      }, 300);
      
      // Start first interval immediately
      const immediateTimeout = setTimeout(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, 0);
      
      return () => {
        clearInterval(directionInterval);
        clearInterval(colorInterval);
        clearTimeout(immediateTimeout);
      };
    }
  }, [hovered, duration, clockwise]);

  useEffect(() => {
    if (hovered) {
      setIsInitialGlow(true);
    } else {
      setIsInitialGlow(false);
    }
  }, [hovered]);
  return (
    <Tag
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex border content-center transition duration-500 items-center justify-center overflow-visible p-[0.5px] decoration-clone w-fit focus:outline-none focus:ring-0 active:outline-none",
        containerClassName
      )}
      style={{backgroundColor: "#121212", borderRadius: "30px", outline: "none", boxShadow: "none", borderColor: "transparent"}}
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
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(130, 165, 255, 0.92) 6deg, rgba(130, 165, 255, 0.92) 354deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(140, 170, 255, 0.94) 10deg, rgba(140, 170, 255, 0.94) 350deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(150, 175, 255, 0.96) 15deg, rgba(150, 175, 255, 0.96) 345deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(160, 180, 255, 0.98) 20deg, rgba(160, 180, 255, 0.98) 340deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(170, 185, 255, 1) 25deg, rgba(170, 185, 255, 1) 335deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(180, 190, 255, 1) 30deg, rgba(180, 190, 255, 1) 330deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(190, 200, 255, 1) 35deg, rgba(190, 200, 255, 1) 325deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(200, 210, 255, 1) 40deg, rgba(200, 210, 255, 1) 320deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(210, 220, 255, 1) 45deg, rgba(210, 220, 255, 1) 315deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(220, 230, 255, 1) 50deg, rgba(220, 230, 255, 1) 310deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(230, 240, 255, 1) 60deg, rgba(230, 240, 255, 1) 300deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(240, 245, 255, 1) 70deg, rgba(240, 245, 255, 1) 290deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, rgba(245, 248, 255, 1) 80deg, rgba(245, 248, 255, 1) 280deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 90deg, white 270deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 100deg, white 260deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 110deg, white 250deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 120deg, white 240deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 130deg, white 230deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 140deg, white 220deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 150deg, white 210deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 160deg, white 200deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 165deg, white 195deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 170deg, white 190deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 173deg, white 187deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 175deg, white 185deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, transparent 0deg, white 177deg, white 183deg, transparent 360deg)",
                "conic-gradient(from 270deg at 50% 50%, rgba(255, 255, 255, 0.9) 0deg, white 178deg, white 182deg, rgba(255, 255, 255, 0.9) 360deg)",
                "conic-gradient(from 270deg at 50% 50%, rgba(255, 255, 255, 0.95) 0deg, white 179deg, white 181deg, rgba(255, 255, 255, 0.95) 360deg)",
                "conic-gradient(from 270deg at 50% 50%, rgba(255, 255, 255, 0.98) 0deg, white 180deg, rgba(255, 255, 255, 0.98) 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(120, 160, 255, 0.9) 3deg, rgba(120, 160, 255, 0.9) 357deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(130, 165, 255, 0.92) 6deg, rgba(130, 165, 255, 0.92) 354deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(140, 170, 255, 0.94) 10deg, rgba(140, 170, 255, 0.94) 350deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(150, 175, 255, 0.96) 15deg, rgba(150, 175, 255, 0.96) 345deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(160, 180, 255, 0.98) 20deg, rgba(160, 180, 255, 0.98) 340deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(170, 185, 255, 1) 25deg, rgba(170, 185, 255, 1) 335deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(180, 190, 255, 1) 30deg, rgba(180, 190, 255, 1) 330deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(190, 200, 255, 1) 35deg, rgba(190, 200, 255, 1) 325deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(200, 210, 255, 1) 40deg, rgba(200, 210, 255, 1) 320deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(210, 220, 255, 1) 45deg, rgba(210, 220, 255, 1) 315deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(220, 230, 255, 1) 50deg, rgba(220, 230, 255, 1) 310deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(230, 240, 255, 1) 60deg, rgba(230, 240, 255, 1) 300deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(240, 245, 255, 1) 70deg, rgba(240, 245, 255, 1) 290deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(245, 248, 255, 1) 80deg, rgba(245, 248, 255, 1) 280deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 90deg, white 270deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 100deg, white 260deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 110deg, white 250deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 120deg, white 240deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 130deg, white 230deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 140deg, white 220deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 150deg, white 210deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 160deg, white 200deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 165deg, white 195deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 170deg, white 190deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 173deg, white 187deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 175deg, white 185deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, transparent 0deg, white 177deg, white 183deg, transparent 360deg)",
                "conic-gradient(from 90deg at 50% 50%, rgba(255, 255, 255, 0.9) 0deg, white 178deg, white 182deg, rgba(255, 255, 255, 0.9) 360deg)",
                "conic-gradient(from 90deg at 50% 50%, rgba(255, 255, 255, 0.95) 0deg, white 179deg, white 181deg, rgba(255, 255, 255, 0.95) 360deg)",
                "conic-gradient(from 90deg at 50% 50%, rgba(255, 255, 255, 0.98) 0deg, white 180deg, rgba(255, 255, 255, 0.98) 360deg)",
                "radial-gradient(circle at 50% 50%, white 0%, white 15%, rgba(255, 255, 255, 0.9) 35%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 20%, rgba(255, 255, 255, 0.85) 45%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 25%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 30%, rgba(255, 255, 255, 0.8) 55%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 35%, rgba(255, 255, 255, 0.75) 60%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 40%, rgba(255, 255, 255, 0.7) 65%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 45%, rgba(255, 255, 255, 0.7) 70%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 50%, rgba(255, 255, 255, 0.65) 75%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 55%, rgba(255, 255, 255, 0.6) 80%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 60%, rgba(255, 255, 255, 0.6) 85%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 65%, rgba(255, 255, 255, 0.55) 90%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 70%, rgba(255, 255, 255, 0.5) 92%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 75%, rgba(255, 255, 255, 0.45) 94%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 80%, rgba(255, 255, 255, 0.4) 96%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 85%, rgba(255, 255, 255, 0.35) 97%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 90%, rgba(255, 255, 255, 0.3) 98%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 95%, rgba(255, 255, 255, 0.25) 99%, transparent 100%)",
                "radial-gradient(circle at 50% 50%, white 0%, white 100%)"
              ]
            : movingMap[direction],
        }}
        transition={{ 
          ease: isInitialGlow ? "easeInOut" : "linear", 
          duration: isInitialGlow ? 3.5 : (duration ?? 0.75),
          repeat: isInitialGlow ? 0 : undefined,
          repeatType: isInitialGlow ? undefined : undefined
        }}
      />
      {/* Track/path for the streak to travel on */}
      <div 
        className="absolute inset-0 rounded-[inherit] z-[-1]" 
        style={{
          borderRadius: "30px"
        }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
