import { useEffect, useRef, useState } from "react";
import { TrendingUp, BarChart3, PieChart, Zap } from "lucide-react";

const CounterValue = ({ value, label }: { value: number; label: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = value / 30;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(interval);
      }
      setCount(Math.floor(current));
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-blue-400">
        {count}
        {label.includes("%") ? "%" : "+"}
      </div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
};

export default function AnimatedDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Track mouse for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate canvas graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let progress = 0;

    const animate = () => {
      progress += 0.01;
      if (progress > 1) progress = 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = (canvas.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw animated line chart
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const points = [
        { x: 0, y: 0.7 },
        { x: 0.2, y: 0.6 },
        { x: 0.4, y: 0.5 },
        { x: 0.6, y: 0.3 },
        { x: 0.8, y: 0.2 },
        { x: 1, y: 0.1 },
      ];

      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const animatedY = point.y + (1 - point.y) * (1 - progress);
        const x = point.x * canvas.width;
        const y = animatedY * canvas.height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = gradient;
      ctx.fill();

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border border-blue-500/20 rounded-2xl" />

      {/* Cursor glow effect */}
      <div
        className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        style={{
          left: `${mousePos.current.x - 192}px`,
          top: `${mousePos.current.y - 192}px`,
          transition: "all 0.3s ease-out",
        }}
      />

      {/* Content */}
      <div className="relative p-8 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live Analytics</span>
          </div>
          <div className="flex gap-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-xs text-gray-400">Real-time</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 mb-6">
          <canvas
            ref={canvasRef}
            width={300}
            height={150}
            className="w-full h-full"
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <CounterValue value={250} label="ROI %" />
          <CounterValue value={1500} label="Leads" />
          <CounterValue value={85} label="Conversion" />
        </div>

        {/* Floating icons */}
        <div className="absolute top-4 right-4 animate-bounce">
          <BarChart3 size={24} className="text-blue-400/50" />
        </div>
        <div className="absolute bottom-4 left-4 animate-pulse">
          <TrendingUp size={24} className="text-green-400/50" />
        </div>
        <div
          className="absolute top-1/2 right-8 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        >
          <PieChart size={20} className="text-purple-400/50" />
        </div>
      </div>
    </div>
  );
}
