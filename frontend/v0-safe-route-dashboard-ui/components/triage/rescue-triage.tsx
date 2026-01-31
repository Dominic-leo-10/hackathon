"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Clock,
  Eye,
  Info,
  RefreshCw,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import type {
  HealthStatus,
  VulnerabilityType,
  RoleType,
  RiskLevel,
  PriorityCategory,
} from "@/lib/mock-data";
import { calculatePriorityScore } from "@/lib/mock-data";

interface TriageEntry {
  id: string;
  name: string;
  health: HealthStatus;
  vulnerability: VulnerabilityType;
  role: RoleType;
  risk: RiskLevel;
  score: number;
  category: PriorityCategory;
}

// Mock triage queue
const mockTriageQueue: TriageEntry[] = [
  {
    id: "1",
    name: "Patient A",
    health: "critical",
    vulnerability: "pregnant",
    role: "citizen",
    risk: "high",
    score: 90,
    category: "immediate",
  },
  {
    id: "2",
    name: "Patient B",
    health: "critical",
    vulnerability: "child",
    role: "citizen",
    risk: "medium",
    score: 78,
    category: "immediate",
  },
  {
    id: "3",
    name: "Dr. Kumar",
    health: "injured",
    vulnerability: "none",
    role: "doctor",
    risk: "high",
    score: 60,
    category: "immediate",
  },
  {
    id: "4",
    name: "Patient C",
    health: "injured",
    vulnerability: "elderly",
    role: "citizen",
    risk: "medium",
    score: 58,
    category: "delayed",
  },
  {
    id: "5",
    name: "Nurse Priya",
    health: "injured",
    vulnerability: "none",
    role: "nurse",
    risk: "low",
    score: 40,
    category: "delayed",
  },
  {
    id: "6",
    name: "Patient D",
    health: "healthy",
    vulnerability: "disabled",
    role: "citizen",
    risk: "medium",
    score: 43,
    category: "delayed",
  },
  {
    id: "7",
    name: "Patient E",
    health: "healthy",
    vulnerability: "child",
    role: "citizen",
    risk: "low",
    score: 35,
    category: "delayed",
  },
  {
    id: "8",
    name: "Patient F",
    health: "healthy",
    vulnerability: "none",
    role: "citizen",
    risk: "low",
    score: 5,
    category: "monitor",
  },
];

const categoryConfig: Record<
  PriorityCategory,
  { label: string; color: string; bgColor: string; icon: typeof Zap }
> = {
  immediate: {
    label: "Immediate Rescue",
    color: "text-status-critical",
    bgColor: "bg-status-critical",
    icon: Zap,
  },
  delayed: {
    label: "Delayed Rescue",
    color: "text-status-warning",
    bgColor: "bg-status-warning",
    icon: Clock,
  },
  monitor: {
    label: "Monitor",
    color: "text-status-stable",
    bgColor: "bg-status-stable",
    icon: Eye,
  },
};

export function RescueTriage() {
  const [health, setHealth] = useState<HealthStatus>("healthy");
  const [vulnerability, setVulnerability] = useState<VulnerabilityType>("none");
  const [role, setRole] = useState<RoleType>("citizen");
  const [risk, setRisk] = useState<RiskLevel>("low");
  const [result, setResult] = useState<{
    score: number;
    category: PriorityCategory;
    breakdown: { factor: string; points: number }[];
  } | null>(null);

  const handleCalculate = () => {
    const calcResult = calculatePriorityScore(health, vulnerability, role, risk);
    setResult(calcResult);
  };

  const handleReset = () => {
    setHealth("healthy");
    setVulnerability("none");
    setRole("citizen");
    setRisk("low");
    setResult(null);
  };

  const immediateCount = mockTriageQueue.filter((t) => t.category === "immediate").length;
  const delayedCount = mockTriageQueue.filter((t) => t.category === "delayed").length;
  const monitorCount = mockTriageQueue.filter((t) => t.category === "monitor").length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-status-critical/10 border-status-critical/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Immediate Rescue</p>
                <p className="text-3xl font-bold text-status-critical">{immediateCount}</p>
              </div>
              <div className="rounded-full bg-status-critical/20 p-3">
                <Zap className="h-6 w-6 text-status-critical" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-status-warning/10 border-status-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delayed Rescue</p>
                <p className="text-3xl font-bold text-status-warning">{delayedCount}</p>
              </div>
              <div className="rounded-full bg-status-warning/20 p-3">
                <Clock className="h-6 w-6 text-status-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-status-stable/10 border-status-stable/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monitor</p>
                <p className="text-3xl font-bold text-status-stable">{monitorCount}</p>
              </div>
              <div className="rounded-full bg-status-stable/20 p-3">
                <Eye className="h-6 w-6 text-status-stable" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Priority Calculator */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Priority Score Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Health Status</Label>
                <Select value={health} onValueChange={(v) => setHealth(v as HealthStatus)}>
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="injured">Injured</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Vulnerability</Label>
                <Select
                  value={vulnerability}
                  onValueChange={(v) => setVulnerability(v as VulnerabilityType)}
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="pregnant">Pregnant</SelectItem>
                    <SelectItem value="elderly">Elderly</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as RoleType)}>
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizen">Citizen</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Rescue Risk</Label>
                <Select value={risk} onValueChange={(v) => setRisk(v as RiskLevel)}>
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCalculate} className="flex-1">
                Calculate Priority
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Result Display */}
            {result && (
              <div className="rounded-lg border border-border bg-secondary p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Priority Score</p>
                    <p className="text-4xl font-bold text-foreground">{result.score}</p>
                  </div>
                  <Badge
                    className={`${categoryConfig[result.category].bgColor} text-primary-foreground px-3 py-1 text-sm`}
                  >
                    {categoryConfig[result.category].label}
                  </Badge>
                </div>

                <Progress
                  value={result.score}
                  className="h-3"
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    Score Breakdown
                  </div>
                  <TooltipProvider>
                    <div className="grid grid-cols-2 gap-2">
                      {result.breakdown.map((item) => (
                        <Tooltip key={item.factor}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-between rounded bg-background p-2 cursor-help">
                              <span className="text-xs text-muted-foreground">
                                {item.factor}
                              </span>
                              <span className="text-sm font-semibold text-foreground">
                                +{item.points}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {item.factor}: {item.points} points added to priority score
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>

                <div className="rounded-lg bg-background p-3">
                  <p className="text-sm text-muted-foreground">
                    {result.category === "immediate" &&
                      "Requires immediate evacuation. Deploy rescue team now."}
                    {result.category === "delayed" &&
                      "Schedule for rescue after immediate cases. Monitor condition."}
                    {result.category === "monitor" &&
                      "Stable condition. Provide shelter-in-place guidance."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Triage Queue */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Active Triage Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-auto pr-2">
              {mockTriageQueue
                .sort((a, b) => b.score - a.score)
                .map((entry, index) => {
                  const config = categoryConfig[entry.category];
                  const Icon = config.icon;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 rounded-lg border-l-4 bg-secondary p-3 ${
                        entry.category === "immediate"
                          ? "border-l-status-critical"
                          : entry.category === "delayed"
                            ? "border-l-status-warning"
                            : "border-l-status-stable"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          index < 3
                            ? "bg-status-critical/20 text-status-critical"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{entry.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.health}
                          </Badge>
                          {entry.vulnerability !== "none" && (
                            <Badge variant="outline" className="text-xs">
                              {entry.vulnerability}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>Role: {entry.role}</span>
                          <span>Risk: {entry.risk}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1">
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <span className={`text-lg font-bold ${config.color}`}>
                            {entry.score}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{config.label}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
