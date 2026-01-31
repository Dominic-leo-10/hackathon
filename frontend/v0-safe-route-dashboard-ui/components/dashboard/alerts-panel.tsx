"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, CheckCircle, MapPin, Clock } from "lucide-react";
import type { Alert } from "@/lib/mock-data";

interface AlertsPanelProps {
  alerts: Alert[];
}

function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const alertConfig = {
    critical: {
      icon: AlertCircle,
      color: "text-status-critical",
      bgColor: "bg-status-critical/10",
      borderColor: "border-l-status-critical",
      badge: "bg-status-critical text-destructive-foreground",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
      borderColor: "border-l-status-warning",
      badge: "bg-status-warning text-primary-foreground",
    },
    stable: {
      icon: CheckCircle,
      color: "text-status-stable",
      bgColor: "bg-status-stable/10",
      borderColor: "border-l-status-stable",
      badge: "bg-status-stable text-primary-foreground",
    },
  };

  const criticalCount = alerts.filter((a) => a.type === "critical").length;
  const warningCount = alerts.filter((a) => a.type === "warning").length;

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Active Alerts
          </CardTitle>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge className="bg-status-critical text-destructive-foreground">
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-status-warning text-primary-foreground">
                {warningCount} Warning
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4 pb-4">
          <div className="space-y-3">
            {alerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;

              return (
                <div
                  key={alert.id}
                  className={`rounded-lg border-l-4 ${config.borderColor} ${config.bgColor} p-3`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {alert.title}
                        </h4>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
