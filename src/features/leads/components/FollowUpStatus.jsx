import { CheckCircle, Clock, Circle, AlertCircle } from 'lucide-react';

const STAGES = [
  { stage: 1, label: 'Welcome Email', subLabel: 'Initial outreach' },
  { stage: 2, label: 'Follow-up #1: Diagnostic Framework', subLabel: 'Value-add follow-up' },
  { stage: 3, label: 'Follow-up #2: Client Case Study', subLabel: 'Social proof' },
  { stage: 4, label: 'Final Follow-up: Availability Close', subLabel: 'Closing sequence' },
];

function StageIcon({ status }) {
  if (status === 'SENT') return <CheckCircle className="h-4 w-4 text-success shrink-0" />;
  if (status === 'SCHEDULED') return <Clock className="h-4 w-4 text-warning shrink-0" />;
  if (status === 'SKIPPED') return <AlertCircle className="h-4 w-4 text-text-secondary shrink-0" />;
  return <Circle className="h-4 w-4 text-border shrink-0" />;
}

function statusLabel(status) {
  if (status === 'SENT') return 'Sent';
  if (status === 'SCHEDULED') return 'Scheduled';
  if (status === 'SKIPPED') return 'Skipped';
  return 'Pending sequence progression';
}

function statusColor(status) {
  if (status === 'SENT') return 'text-success';
  if (status === 'SCHEDULED') return 'text-warning';
  return 'text-text-secondary';
}

export default function FollowUpStatus({ lead, followups = [], onAdvanceStage, advancing = false }) {
  const isBooked = lead.status === 'BOOKED';

  // Map followup stage to status
  function getStageStatus(stageNum) {
    // Stage 1 = Welcome (stage 0 in followup = sent welcome)
    const followup = followups?.find((f) => f.stage === stageNum);
    if (followup) return followup.status;
    // If lead follow_up_stage covers it, mark sent
    if (lead.follow_up_stage >= stageNum) return 'SENT';
    return 'PENDING';
  }

  const completedStages = lead.follow_up_stage || 0;
  // 4 milestones: Welcome (25%), Follow-up 1 (50%), Follow-up 2 (75%), Final Follow-up (100%)
  const progressPercent = Math.min(((completedStages + 1) / 4) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
        <span className="font-medium text-text-primary">High-Touch Advisory Nurture</span>
        <span className="text-accent font-medium">Stage {completedStages} / 3 Completed</span>
      </div>
      <div className="w-full bg-border rounded-full h-1.5">
        <div
          className="bg-accent h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stages */}
      <div className="space-y-2 mt-3">
        {STAGES.map(({ stage, label }) => {
          const status = getStageStatus(stage - 1); // Adjust since followups are 0-indexed
          return (
            <div key={stage} className="flex items-start gap-3 py-2">
              <StageIcon status={status} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${status === 'PENDING' ? 'text-text-secondary' : 'text-text-primary'}`}>
                  {label}
                </p>
                <p className={`text-xs mt-0.5 ${statusColor(status)}`}>
                  {statusLabel(status)}
                </p>
              </div>
            </div>
          );
        })}
      </div>


      {/* Booked notice */}
      {isBooked && (
        <div className="flex items-start gap-2 bg-success-light border border-success/20 rounded-btn p-3">
          <AlertCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
          <p className="text-xs text-success">
            If a consultation is booked, subsequent automated follow-ups are automatically paused.
          </p>
        </div>
      )}
    </div>
  );
}
