"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  AlertTriangle,
  Users,
  CheckCircle
} from "lucide-react";

/**
 * BACKEND-ALIGNED STATS TYPE
 */
interface StatsCardsProps {
  stats: {
    totalShelters: number;
    fullShelters: number;
    usedCapacity: number;
    availableCapacity: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      label: "Total Shelters",
      value: stats.totalShelters?.toLocaleString("en-IN") ?? "0",
      icon: Building2,
      color: "text-status-info",
      bgColor: "bg-status-info/10",
    },
    {
      label: "Full Shelters",
      value: stats.fullShelters?.toLocaleString("en-IN") ?? "0",
      icon: AlertTriangle,
      color: "text-status-critical",
      bgColor: "bg-status-critical/10",
    },
    {
      label: "Used Capacity",
      value: stats.usedCapacity?.toLocaleString("en-IN") ?? "0",
      icon: Users,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      label: "Available Capacity",
      value: stats.availableCapacity?.toLocaleString("en-IN") ?? "0",
      icon: CheckCircle,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                  {item.value}
                </p>
              </div>
              <div className={`rounded-lg p-2 ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
