import { useEffect, useRef } from 'react';
import { Sparkles, Database, Wifi } from 'lucide-react';

interface AnimatedGlobeProps {
  className?: string;
}

export function AnimatedGlobe({ className = '' }: AnimatedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0.8;
    let isDragging = false;
    let startX = 0;
    let dragVelocity = 0;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 520);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 520);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 520;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 520;
    };

    window.addEventListener('resize', handleResize);

    // Mouse & Touch Drag Controls for interactive spinning
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      dragVelocity = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      dragVelocity = deltaX * 0.003;
      rotation += dragVelocity;
      startX = e.clientX;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        dragVelocity = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - startX;
      dragVelocity = deltaX * 0.003;
      rotation += dragVelocity;
      startX = e.touches[0].clientX;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Major Global Telecom & AI Hubs (Lat, Lon in radians)
    const hubs = [
      { name: 'Colombo HQ', lat: 0.12, lon: 1.39, isHQ: true, color: '#00A651' }, // Sri Lanka (Lat 6.9°N, Lon 79.8°E)
      { name: 'Singapore', lat: 0.02, lon: 1.81, color: '#00A9E0' },
      { name: 'Tokyo', lat: 0.62, lon: 2.43, color: '#0057A8' },
      { name: 'London', lat: 0.89, lon: 0.00, color: '#0057A8' },
      { name: 'Frankfurt', lat: 0.87, lon: 0.15, color: '#00A9E0' },
      { name: 'Dubai', lat: 0.44, lon: 0.96, color: '#00A651' },
      { name: 'Silicon Valley', lat: 0.65, lon: -2.13, color: '#00A9E0' },
      { name: 'Sydney', lat: -0.59, lon: 2.64, color: '#0057A8' },
      { name: 'Mumbai', lat: 0.33, lon: 1.27, color: '#00A9E0' },
    ];

    // Data Arcs connecting hubs
    const hubArcs = [
      { from: 0, to: 1, progress: 0.0, speed: 0.009, color: '#00A651' }, // Colombo -> Singapore
      { from: 0, to: 5, progress: 0.4, speed: 0.008, color: '#00A9E0' }, // Colombo -> Dubai
      { from: 0, to: 8, progress: 0.7, speed: 0.011, color: '#0057A8' }, // Colombo -> Mumbai
      { from: 1, to: 2, progress: 0.2, speed: 0.007, color: '#00A9E0' }, // Singapore -> Tokyo
      { from: 5, to: 4, progress: 0.5, speed: 0.008, color: '#00A651' }, // Dubai -> Frankfurt
      { from: 4, to: 3, progress: 0.8, speed: 0.010, color: '#0057A8' }, // Frankfurt -> London
      { from: 3, to: 6, progress: 0.1, speed: 0.006, color: '#00A9E0' }, // London -> Silicon Valley
      { from: 1, to: 7, progress: 0.6, speed: 0.007, color: '#00A651' }, // Singapore -> Sydney
    ];

    // Generate Continent-Like Spherical Particle Grid (Fibonacci + Continent Clusters)
    const points: { phi: number; theta: number; weight: number; color?: string }[] = [];
    const numPoints = 280;

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const weight = Math.random() > 0.85 ? 2.5 : 1.2;
      points.push({ phi, theta, weight });
    }

    // Concentric Radar Ripple state for Colombo HQ
    let radarRadius = 0;

    const render = () => {
      // Smooth majestic slow rotation (User requested comfortable speed)
      if (!isDragging) {
        dragVelocity *= 0.95; // Inertia damping
        rotation += 0.0028 + dragVelocity; // Gentle slow rotation
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      // 1. Draw glowing outer atmosphere halo
      const atmosphereGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.8,
        centerX,
        centerY,
        radius * 1.3
      );
      atmosphereGlow.addColorStop(0, 'rgba(0, 87, 168, 0.04)');
      atmosphereGlow.addColorStop(0.5, 'rgba(0, 169, 224, 0.09)');
      atmosphereGlow.addColorStop(0.85, 'rgba(0, 166, 81, 0.04)');
      atmosphereGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw crisp clean white/light-blue inner sphere
      const sphereGradient = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.35,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphereGradient.addColorStop(0, '#FFFFFF');
      sphereGradient.addColorStop(0.7, '#F0F7FF');
      sphereGradient.addColorStop(1, '#E2EFFF');

      ctx.fillStyle = sphereGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sphere subtle border
      ctx.strokeStyle = 'rgba(0, 87, 168, 0.2)';
      ctx.lineWidth = 1.5 * window.devicePixelRatio;
      ctx.stroke();

      // 3. Draw latitude & longitude grid rings
      ctx.lineWidth = 0.8 * window.devicePixelRatio;
      for (let lat = -60; lat <= 60; lat += 30) {
        const latRad = (lat * Math.PI) / 180;
        const rLat = radius * Math.cos(latRad);
        const yLat = centerY + radius * Math.sin(latRad) * Math.cos(0.2);

        ctx.strokeStyle = 'rgba(0, 87, 168, 0.06)';
        ctx.beginPath();
        ctx.ellipse(centerX, yLat, rLat, rLat * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Project 3D points
      const projectedGrid: { x: number; y: number; z: number; size: number; alpha: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const rotTheta = p.theta + rotation;

        const x3d = radius * Math.sin(p.phi) * Math.sin(rotTheta);
        const y3d = radius * Math.cos(p.phi);
        const z3d = radius * Math.sin(p.phi) * Math.cos(rotTheta);

        const tilt = 0.22;
        const tiltedY = y3d * Math.cos(tilt) - z3d * Math.sin(tilt);
        const tiltedZ = y3d * Math.sin(tilt) + z3d * Math.cos(tilt);

        if (tiltedZ > -radius * 0.2) {
          const alpha = Math.max(0.08, (tiltedZ + radius) / (2 * radius));
          projectedGrid.push({
            x: centerX + x3d,
            y: centerY + tiltedY,
            z: tiltedZ,
            size: p.weight * window.devicePixelRatio * Math.max(0.8, (tiltedZ + radius) / (2 * radius)),
            alpha,
          });
        }
      }

      // Draw grid points
      for (const pt of projectedGrid) {
        ctx.fillStyle = `rgba(0, 87, 168, ${pt.alpha * 0.45})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Project Global Telecom Hubs
      const projectedHubs: {
        x: number;
        y: number;
        z: number;
        name: string;
        isHQ?: boolean;
        color: string;
        visible: boolean;
      }[] = [];

      for (const hub of hubs) {
        const phi = Math.PI / 2 - hub.lat;
        const theta = hub.lon + rotation;

        const x3d = radius * Math.sin(phi) * Math.sin(theta);
        const y3d = radius * Math.cos(phi);
        const z3d = radius * Math.sin(phi) * Math.cos(theta);

        const tilt = 0.22;
        const tiltedY = y3d * Math.cos(tilt) - z3d * Math.sin(tilt);
        const tiltedZ = y3d * Math.sin(tilt) + z3d * Math.cos(tilt);

        projectedHubs.push({
          x: centerX + x3d,
          y: centerY + tiltedY,
          z: tiltedZ,
          name: hub.name,
          isHQ: hub.isHQ,
          color: hub.color,
          visible: tiltedZ > 0, // In front hemisphere
        });
      }

      // 6. Draw Connecting 3D Data Arcs between Hubs
      for (const arc of hubArcs) {
        const h1 = projectedHubs[arc.from];
        const h2 = projectedHubs[arc.to];

        if (h1 && h2 && (h1.visible || h2.visible)) {
          ctx.strokeStyle = `${arc.color}33`;
          ctx.lineWidth = 1.5 * window.devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(h1.x, h1.y);

          // Bulging 3D midpoint
          const midX = (h1.x + h2.x) / 2;
          const midY = (h1.y + h2.y) / 2 - 30 * window.devicePixelRatio;
          ctx.quadraticCurveTo(midX, midY, h2.x, h2.y);
          ctx.stroke();

          // Animated flying data packet beam
          arc.progress = (arc.progress + arc.speed) % 1;
          const t = arc.progress;
          const beamX = (1 - t) * (1 - t) * h1.x + 2 * (1 - t) * t * midX + t * t * h2.x;
          const beamY = (1 - t) * (1 - t) * h1.y + 2 * (1 - t) * t * midY + t * t * h2.y;

          // Glowing pulse light packet
          ctx.fillStyle = arc.color;
          ctx.beginPath();
          ctx.arc(beamX, beamY, 3 * window.devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `${arc.color}44`;
          ctx.beginPath();
          ctx.arc(beamX, beamY, 7 * window.devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 7. Draw Global Hub Pins & Colombo HQ Radar Wave
      radarRadius = (radarRadius + 0.4) % (35 * window.devicePixelRatio);

      for (const hub of projectedHubs) {
        if (!hub.visible) continue;

        if (hub.isHQ) {
          // Colombo HQ Radar Pulse Rings
          ctx.strokeStyle = `rgba(0, 166, 81, ${Math.max(0, 1 - radarRadius / (35 * window.devicePixelRatio)) * 0.7})`;
          ctx.lineWidth = 2 * window.devicePixelRatio;
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, radarRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Outer halo
          ctx.fillStyle = 'rgba(0, 166, 81, 0.25)';
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, 9 * window.devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();

          // Central solid beacon
          ctx.fillStyle = '#00A651';
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, 4.5 * window.devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();

          // Pin Label
          ctx.font = `bold ${10 * window.devicePixelRatio}px 'Plus Jakarta Sans', sans-serif`;
          ctx.fillStyle = '#0057A8';
          ctx.fillText('📍 SLT-MOBITEL Colombo HQ', hub.x + 12 * window.devicePixelRatio, hub.y - 6 * window.devicePixelRatio);
        } else {
          // Regular Hub Node
          ctx.fillStyle = `${hub.color}44`;
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, 6 * window.devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = hub.color;
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, 3 * window.devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();

          // Small text tag for key hubs
          if (hub.name === 'Singapore' || hub.name === 'London' || hub.name === 'Dubai') {
            ctx.font = `${8.5 * window.devicePixelRatio}px 'Plus Jakarta Sans', sans-serif`;
            ctx.fillStyle = '#475569';
            ctx.fillText(hub.name, hub.x + 8 * window.devicePixelRatio, hub.y + 3 * window.devicePixelRatio);
          }
        }
      }

      // 8. Outer Satellite Orbit Track
      const orbitAngle = rotation * 1.8;
      const orbitR = radius * 1.25;

      ctx.strokeStyle = 'rgba(0, 87, 168, 0.15)';
      ctx.lineWidth = 1.2 * window.devicePixelRatio;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, orbitR, orbitR * 0.32, 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite 1
      const satX = centerX + orbitR * Math.cos(orbitAngle);
      const satY = centerY + orbitR * 0.32 * Math.sin(orbitAngle) + (satX - centerX) * 0.35;

      ctx.fillStyle = '#00A651';
      ctx.beginPath();
      ctx.arc(satX, satY, 4 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0, 166, 81, 0.3)';
      ctx.beginPath();
      ctx.arc(satX, satY, 8 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* HTML5 Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
      />

      {/* Floating Glassmorphic Telemetry Card 1 (Top Right) */}
      <div className="absolute -top-2 right-2 sm:right-6 p-3 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-1 max-w-[210px] transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#0057A8] uppercase tracking-wider">
            <Wifi className="w-3 h-3 text-[#0057A8] animate-pulse" />
            5G Core Stream
          </span>
          <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
            Active
          </span>
        </div>
        <p className="font-mono text-xs font-extrabold text-slate-900">10.4 Gbps Telemetry</p>
        <p className="text-[10px] text-slate-500 font-medium">Real-time Kafka ingestion</p>
      </div>

      {/* Floating Glassmorphic Telemetry Card 2 (Bottom Left) */}
      <div className="absolute -bottom-3 left-2 sm:left-4 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-1.5 max-w-[225px] transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-900 leading-tight">AI Prediction Engine</p>
            <p className="text-[9px] text-emerald-700 font-bold">99.98% Model Health</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 font-mono text-slate-600">
          <span>Inference Latency:</span>
          <span className="text-emerald-700 font-bold">4.2 ms</span>
        </div>
      </div>

      {/* Floating Central Node Badge (Middle Right) */}
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-md text-xs font-semibold">
        <Database className="w-4 h-4 text-[#0057A8]" />
        <div>
          <p className="text-[10px] text-slate-500 font-normal">Active AI Pipelines</p>
          <p className="text-xs font-bold text-slate-900 font-mono">12 Production Tracks</p>
        </div>
      </div>
    </div>
  );
}
