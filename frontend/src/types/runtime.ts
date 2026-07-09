export type Status = 'available' | 'occupied' | 'unavailable' | 'failed';
export type MissionStatus = 'normal' | 'in-progress' | 'delayed' | 'recovered' | 'diverged';
export type TaskStatus = 'pending' | 'active' | 'complete' | 'rejected';
export type EventSeverity = 'info' | 'warning' | 'critical';
export type ValidationStatus = 'PASS' | 'REJECTED';

export interface Resource {
  id: string;
  type: string;
  status: Status;
  name: string;
  currentAssignment?: string;
}

export interface Task {
  id: string;
  name: string;
  type: string;
  status: TaskStatus;
  duration: number; // in minutes
  assignedResourceId?: string;
  dependencies: string[]; // Task IDs that must complete first
}

export interface Mission {
  id: string;
  name: string;
  type: string;
  status: MissionStatus;
  priority: number;
  deadline: string; // ISO timestamp
  tasks: Task[];
}

export interface RuntimeEvent {
  id: string;
  type: string;
  timestamp: string; // ISO timestamp
  severity: EventSeverity;
  description: string;
  affectedMissions: string[];
}

export interface Divergence {
  id: string;
  eventId: string;
  expectedState: string;
  actualState: string;
  severity: EventSeverity;
  detectedAt: string;
}

export interface RepairPolicy {
  id: string;
  divergenceSignature: string;
  strategy: string;
  confidence: number; // 0-1
  successRate: number; // 0-1
}

export interface Adapter {
  id: string;
  name: string;
  description: string;
  status: 'live' | 'coming-soon';
  href: string;
}

export interface Memory {
  id: string;
  type: string;
  strategy: string;
  confidence: number;
  outcome: 'success' | 'failure';
  date: string;
}

export interface RecoveryStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete' | 'failed';
  metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
  codeSnippet?: string;
  duration?: number;
}

export interface Scenario {
  id: string;
  name: string;
  missions: Mission[];
  resources: Resource[];
  nodes: any[]; // Using any to avoid importing Node from @xyflow/react here
  edges: any[];
  divergences: Divergence[];
  memories: Memory[];
  confidenceData: { strategy: string; confidence: number }[];
  recovery: {
    eventType: string;
    affectedMissions: string[];
    confidence: number;
    steps: RecoveryStep[];
  };
}
