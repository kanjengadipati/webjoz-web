"use client";

import { useState, useEffect, useRef } from "react";
import { Badge, Button } from "@/components/ui";

export function InteractiveMockup() {
  const [flowStep, setFlowStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D Parallax Tilt Effect on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;

    // Rotate maximum of 8 degrees for clean aesthetic
    const maxRotation = 8;
    const rx = -(y / (box.height / 2)) * maxRotation;
    const ry = (x / (box.width / 2)) * maxRotation;

    setRotate({ x: rx, y: ry });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  // Website Generation Flow Loop
  useEffect(() => {
    const sequence = [
      { step: 0, delay: 0 },       // Clean state
      { step: 1, delay: 1200 },    // AI greets
      { step: 2, delay: 2500 },    // User enters business name
      { step: 3, delay: 4000 },    // AI prompts for business type
      { step: 4, delay: 5500 },    // User chooses "Kuliner", progress changes to 40%
      { step: 5, delay: 6800 },    // Preview starts generating (progress 100%, 3D skeleton rises)
      { step: 6, delay: 8200 },    // 3D layers styled with accent colours
      { step: 7, delay: 9500 },    // Success banner active
    ];

    let timers: NodeJS.Timeout[] = [];

    const runSequence = () => {
      sequence.forEach((item) => {
        const timer = setTimeout(() => {
          setFlowStep(item.step);
        }, item.delay);
        timers.push(timer);
      });
    };

    runSequence();
    
    // Total cycle duration is 13.5 seconds
    const interval = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = [];
      setFlowStep(0);
      runSequence();
    }, 14500);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className="perspective-[1000px] w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: "preserve-3d",
          transition: isHovered ? "none" : "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
        className="relative rounded-[2rem] border border-border/60 bg-card/45 p-1.5 shadow-[0_40px_120px_rgba(0,0,0,0.3)] backdrop-blur-md ring-1 ring-white/5 transition-shadow duration-500 hover:shadow-[0_50px_140px_rgba(99,102,241,0.15)]"
      >
        {/* Browser Top Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 select-none">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
            <div className="h-3 w-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 rounded-full bg-muted/50 px-4 py-1.5 text-center text-xs text-muted-foreground font-mono">
            webjoz.com/create
          </div>
        </div>

        {/* Browser Content */}
        <div className="grid min-h-[300px] gap-0 md:grid-cols-2 sm:min-h-[340px] overflow-hidden rounded-b-[1.8rem]">
          
          {/* Left Chatbot Column */}
          <div className="flex flex-col gap-3 p-5 border-r border-border/30 bg-background/25">
            <div className="flex flex-col gap-2.5">
              
              {/* AI Bubble 1 */}
              <div 
                className={`flex gap-2 items-end transition-all duration-500 transform ${
                  flowStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] shrink-0 shadow-sm border border-primary/10">✨</div>
                <div className="rounded-2xl rounded-bl-sm bg-card border border-border/60 px-3 py-2 text-xs text-foreground max-w-[80%] shadow-sm">
                  Halo! Apa nama bisnis Anda?
                </div>
              </div>

              {/* User Bubble 1 */}
              <div 
                className={`flex justify-end transition-all duration-500 transform ${
                  flowStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="rounded-2xl rounded-br-sm bg-primary/15 border border-primary/20 px-3 py-2 text-xs text-foreground max-w-[75%] shadow-sm">
                  Toko Kopi Nusantara
                </div>
              </div>

              {/* AI Bubble 2 */}
              <div 
                className={`flex gap-2 items-end transition-all duration-500 transform ${
                  flowStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] shrink-0 shadow-sm border border-primary/10">✨</div>
                <div className="rounded-2xl rounded-bl-sm bg-card border border-border/60 px-3 py-2 text-xs text-foreground max-w-[80%] shadow-sm">
                  Nama yang keren! 👍 Sekarang, pilih jenis bisnis Anda:
                </div>
              </div>

              {/* Category Chips */}
              <div 
                className={`flex flex-wrap gap-1.5 ml-8 transition-all duration-500 transform ${
                  flowStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                {["Kuliner", "Jasa", "Produk"].map((t, i) => {
                  const isSelected = i === 0 && flowStep >= 4;
                  return (
                    <div 
                      key={t} 
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold border transition-all duration-300 ${
                        isSelected 
                          ? "bg-primary/25 border-primary/40 text-primary scale-105 shadow-sm" 
                          : "bg-card border-border/50 text-muted-foreground"
                      }`}
                    >
                      {t}
                    </div>
                  );
                })}
              </div>

              {/* Steps Progress */}
              <div 
                className={`mt-2 ml-8 transition-all duration-500 transform ${
                  flowStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="h-1 rounded-full bg-muted overflow-hidden w-32">
                  <div 
                    style={{
                      width: flowStep < 4 ? "0%" : flowStep === 4 ? "40%" : "100%"
                    }}
                    className="h-1 rounded-full bg-primary transition-all duration-700 ease-out" 
                  />
                </div>
                <p className="mt-1 text-[9px] text-muted-foreground">
                  Langkah {flowStep < 4 ? "1" : flowStep === 4 ? "2" : "5"} dari 5
                </p>
              </div>

            </div>
          </div>

          {/* Right Live-Generating Preview Column */}
          <div className="relative hidden md:block bg-muted/15 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_60%)]" />
            
            {/* Loading Grid Scan Line */}
            {flowStep === 5 && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-bounce opacity-70 top-0" />
            )}

            {/* Generated Header Nav */}
            <div 
              style={{
                transform: flowStep >= 6 ? "translateZ(18px) scale(1.02)" : "translateZ(0px)",
                opacity: flowStep >= 5 ? 1 : 0,
              }}
              className={`absolute left-4 top-4 right-4 h-8 rounded-xl border transition-all duration-500 ${
                flowStep >= 6 
                  ? "bg-primary/10 border-primary/20 shadow-md shadow-primary/5" 
                  : "bg-foreground/5 border-border/10"
              }`}
            />

            {/* Generated Hero Title */}
            <div 
              style={{
                transform: flowStep >= 6 ? "translateZ(28px)" : "translateZ(0px)",
                opacity: flowStep >= 5 ? 1 : 0,
              }}
              className={`absolute left-4 top-16 right-4 h-3 rounded-full transition-all duration-500 ${
                flowStep >= 6 ? "bg-foreground/20" : "bg-foreground/10"
              }`}
            />

            {/* Generated Hero Description */}
            <div 
              style={{
                transform: flowStep >= 6 ? "translateZ(20px)" : "translateZ(0px)",
                opacity: flowStep >= 5 ? 1 : 0,
              }}
              className={`absolute left-4 top-22 right-12 h-3 rounded-full transition-all duration-500 ${
                flowStep >= 6 ? "bg-foreground/12" : "bg-foreground/5"
              }`}
            />
            <div 
              style={{
                transform: flowStep >= 6 ? "translateZ(15px)" : "translateZ(0px)",
                opacity: flowStep >= 5 ? 1 : 0,
              }}
              className={`absolute left-4 top-27 w-20 h-3 rounded-full transition-all duration-500 ${
                flowStep >= 6 ? "bg-foreground/12" : "bg-foreground/5"
              }`}
            />

            {/* Generated Card Grid */}
            <div 
              className={`absolute left-4 top-36 right-4 grid grid-cols-2 gap-2 transition-all duration-700 ${
                flowStep >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              {/* Card 1: Featured Category */}
              <div 
                style={{
                  transform: flowStep >= 6 ? "translateZ(38px) scale(1.05)" : "translateZ(0px)",
                }}
                className={`h-14 rounded-xl border transition-all duration-500 ${
                  flowStep >= 6 
                    ? "bg-primary/15 border-primary/30 shadow-xl shadow-primary/10" 
                    : "bg-foreground/5 border-border/10"
                }`}
              />
              
              {/* Card 2: Secondary Category */}
              <div 
                style={{
                  transform: flowStep >= 6 ? "translateZ(12px)" : "translateZ(0px)",
                }}
                className={`h-14 rounded-xl border transition-all duration-500 ${
                  flowStep >= 6 
                    ? "bg-foreground/8 border-border/20 shadow-md" 
                    : "bg-foreground/5 border-border/10"
                }`}
              />
            </div>

            {/* Success Notification Bar */}
            <div 
              style={{
                transform: flowStep >= 7 ? "translateZ(30px) scale(1)" : "translateZ(0px) scale(0.95)",
                opacity: flowStep >= 7 ? 1 : 0,
              }}
              className="absolute bottom-4 left-4 right-4 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center px-3 transition-all duration-500 shadow-lg shadow-emerald-500/5 select-none"
            >
              <span className="text-[9px] font-semibold text-emerald-400 animate-pulse flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ✓ Preview siap di kanan &rarr;
              </span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
