"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Radio } from "lucide-react";
import type { DisasterType, SeverityLevel } from "@/lib/mock-data";

interface HeaderProps {
  disasterType: DisasterType;
  severity: SeverityLevel;
  onDisasterChange: (type: DisasterType) => void;
  onSeverityChange: (level: SeverityLevel) => void;
}

export function DashboardHeader({
  disasterType,
  severity,
  onDisasterChange,
  onSeverityChange,
}: HeaderProps) {
  // 🔒 Time state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  // ✅ Run ONLY on client (fixes hydration error)
  useEffect(() => {
    setMounted(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const severityColors = {
    low: "bg-status-stable text-primary-foreground",
    moderate: "bg-status-warning text-primary-foreground",
    severe: "bg-status-critical text-destructive-foreground",
  };

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                SafeRoute
              </h1>
              <p className="text-xs text-muted-foreground">
                Government Disaster Command Dashboard
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-md bg-destructive/20 px-3 py-1.5 md:flex">
            <Radio className="h-4 w-4 animate-pulse text-destructive" />
            <span className="text-sm font-medium text-destructive">
              LIVE OPERATIONS
            </span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Disaster selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Disaster:</span>
            <Select value={disasterType} onValueChange={onDisasterChange}>
              <SelectTrigger className="w-[140px] bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="cyclone">Cyclone</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="tsunami">Tsunami</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Severity:</span>
            <Select value={severity} onValueChange={onSeverityChange}>
              <SelectTrigger className="w-[130px] bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={severityColors[severity]}>
              {severity.toUpperCase()}
            </Badge>
          </div>

          {/* Time & date (hydration-safe) */}
          <div className="flex flex-col items-end text-right">
            <span className="font-mono text-lg font-semibold text-foreground">
              {mounted
                ? currentTime.toLocaleTimeString("en-IN", { hour12: false })
                : "--:--:--"}
            </span>
            <span className="text-xs text-muted-foreground">
              {mounted &&
                currentTime.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
