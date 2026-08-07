"""
Dashboard & Control Plane Service.
Provides aggregate cluster health, real-time KPI metrics, traffic stats, and event feeds.
"""

import time
import uuid
from typing import Dict, Any, List

class DashboardService:

    @staticmethod
    def get_services_health() -> List[Dict[str, Any]]:
        """Return health status of core DevOps infrastructure services."""
        return [
            {
                "id": "docker",
                "name": "Docker",
                "status": "HEALTHY",
                "detail": "7/9 containers running",
                "icon_type": "docker",
            },
            {
                "id": "kubernetes",
                "name": "Kubernetes",
                "status": "HEALTHY",
                "detail": "5/6 pods ready",
                "icon_type": "k8s",
            },
            {
                "id": "jenkins",
                "name": "Jenkins",
                "status": "WARNING",
                "detail": "2 running · 1 failed",
                "icon_type": "jenkins",
            },
            {
                "id": "github",
                "name": "GitHub",
                "status": "HEALTHY",
                "detail": "Webhook · main branch",
                "icon_type": "github",
            },
            {
                "id": "terraform",
                "name": "Terraform",
                "status": "HEALTHY",
                "detail": "7 resources managed",
                "icon_type": "terraform",
            },
            {
                "id": "prometheus",
                "name": "Prometheus",
                "status": "HEALTHY",
                "detail": "Scraping 24 targets",
                "icon_type": "prometheus",
            },
        ]

    @staticmethod
    def get_kpi_metrics() -> Dict[str, Any]:
        """Return real-time cluster KPI metrics."""
        return {
            "cpu_avg": 55.2,
            "memory_avg": 55.2,
            "network_mbps": 381.9,
            "deploys_24h": 6,
            "uptime_pct": 99.94,
            "cost_mtd": 262.50,
        }

    @staticmethod
    def get_traffic_data() -> List[Dict[str, Any]]:
        """Return time-series request traffic data points for the last 30 minutes."""
        now = int(time.time())
        points = []
        timestamps = [
            "15:53", "15:55", "15:57", "15:59", "16:01", "16:03",
            "16:05", "16:07", "16:09", "16:11", "16:13", "16:15",
            "16:17", "16:19", "16:21"
        ]
        values = [62, 74, 88, 95, 100, 98, 92, 85, 90, 99, 100, 96, 94, 98, 100]
        for ts, val in zip(timestamps, values):
            points.append({"timestamp": ts, "requests_per_sec": val})
        return points

    @staticmethod
    def get_live_events() -> List[Dict[str, Any]]:
        """Return live multi-channel event stream (Slack, Discord, Jenkins, GitHub)."""
        return [
            {
                "id": "evt-101",
                "channel": "SLACK",
                "message": "api v3.20.6 deployed to production by Admin",
                "timestamp": "09:35 PM",
                "level": "info",
            },
            {
                "id": "evt-102",
                "channel": "SLACK",
                "message": "api v2.14.3 deployed to production by sarah.chen",
                "timestamp": "06:21 PM",
                "level": "info",
            },
            {
                "id": "evt-103",
                "channel": "DISCORD",
                "message": "CPU on worker-jobs exceeded 80% (peak 88%)",
                "timestamp": "04:21 PM",
                "level": "warning",
            },
            {
                "id": "evt-104",
                "channel": "SLACK",
                "message": "Jenkins job frontend-ci #284 succeeded",
                "timestamp": "03:21 PM",
                "level": "success",
            },
            {
                "id": "evt-105",
                "channel": "SLACK",
                "message": "GitHub webhook received: push to main by james.wu",
                "timestamp": "12:21 PM",
                "level": "info",
            },
        ]

    @staticmethod
    def get_last_deployment() -> Dict[str, Any]:
        """Return last deployment hero summary."""
        return {
            "version": "api v3.20.6",
            "status": "SUCCESS",
            "author": "Admin",
            "commit_sha": "01fd63a",
            "duration": "6m 37s",
            "deployed_at": "6 minutes ago",
            "environment": "production",
        }
