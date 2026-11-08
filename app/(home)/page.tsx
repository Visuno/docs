import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShowcaseCard } from "@/components/home/showcase-card";
import { FrameworkSlider } from "@/components/home/framework-slider";
import { appName } from "@/lib/shared";
import "./home.css";

// Live, self-animating examples — the real Visuno components.
// NOTE: this list is kept in sync with every shipped component that has a live
// example and a docs page. See the repo guide ("Always keep the landing page's
// component list complete") before editing by hand.
import { StatusPillExample } from "@/components/examples/status-pill";
import { StepLoaderExample } from "@/components/examples/step-loader";
import { ThinkingStatesExample } from "@/components/examples/thinking-states";
import { ReasoningTrailExample } from "@/components/examples/reasoning-trail";
import { ThinkingExample } from "@/components/examples/thinking";
import { AgentPhasesExample } from "@/components/examples/agent-phases";
import { ContextMeterExample } from "@/components/examples/context-meter";
import { ActionLogExample } from "@/components/examples/action-log";
import { BrowserSessionExample } from "@/components/examples/browser-session";
import { WebSearchExample } from "@/components/examples/web-search";
import { TraceViewExample } from "@/components/examples/trace-view";
import { RunQueueExample } from "@/components/examples/run-queue";
import { RunCostExample } from "@/components/examples/run-cost";
import { ToastExample } from "@/components/examples/toast";
import { ToastStackExample } from "@/components/examples/toast-stack";
import { RunSummaryExample } from "@/components/examples/run-summary";
import { ErrorRecoveryExample } from "@/components/examples/error-recovery";
import { AgentLanesExample } from "@/components/examples/agent-lanes";
import { AgentTreeExample } from "@/components/examples/agent-tree";
import { AgentInboxExample } from "@/components/examples/agent-inbox";
import { AgentRunTimelineExample } from "@/components/examples/agent-run-timeline";
import { LiveAnswerExample } from "@/components/examples/live-answer";
import { ThreadPanelExample } from "@/components/examples/thread-panel";
import { ComposerExample } from "@/components/examples/composer";
import { ModelPickerExample } from "@/components/examples/model-picker";
import { VoiceCaptureExample } from "@/components/examples/voice-capture";
import { VoiceOrbExample } from "@/components/examples/voice-orb";
import { ToolCallExample } from "@/components/examples/tool-call";
import { ArtifactCardExample } from "@/components/examples/artifact-card";
import { ImageGenerationExample } from "@/components/examples/image-generation";
import { RichTextEditorExample } from "@/components/examples/rich-text-editor";
import { PromptStartersExample } from "@/components/examples/prompt-starters";
import { PromptLibraryExample } from "@/components/examples/prompt-library";
import { AttachmentTrayExample } from "@/components/examples/attachment-tray";
import { ResponseVersionsExample } from "@/components/examples/response-versions";
import { AnswerActionBarExample } from "@/components/examples/answer-action-bar";
import { FeedbackSheetExample } from "@/components/examples/feedback-sheet";
import { DecisionPromptExample } from "@/components/examples/decision-prompt";
import { ProposalCardExample } from "@/components/examples/proposal-card";
import { RewriteToolbarExample } from "@/components/examples/rewrite-toolbar";
import { DesignTunerExample } from "@/components/examples/design-tuner";
import { PermissionGateExample } from "@/components/examples/permission-gate";
import { HumanHandoffExample } from "@/components/examples/human-handoff";
import { LaunchChecklistExample } from "@/components/examples/launch-checklist";
import { DraftReviewExample } from "@/components/examples/draft-review";
import { SteeringExample } from "@/components/examples/steering";
import { EvalResultsExample } from "@/components/examples/eval-results";
import { InlineTextDiffExample } from "@/components/examples/inline-text-diff";
import { DesignReviewExample } from "@/components/examples/design-review";
import { PlanReviewExample } from "@/components/examples/plan-review";
import { ChangeReviewExample } from "@/components/examples/change-review";
import { SourceStackExample } from "@/components/examples/source-stack";
import { MetricInsightExample } from "@/components/examples/metric-insight";
import { TaskTableExample } from "@/components/examples/task-table";
import { CodeViewerExample } from "@/components/examples/code-viewer";
import { TerminalStreamExample } from "@/components/examples/terminal-stream";
import { DetailsPanelExample } from "@/components/examples/details-panel";
import { CitationHoverCardExample } from "@/components/examples/citation-hover-card";
import { FieldExtractionExample } from "@/components/examples/field-extraction";
import { LineChartExample } from "@/components/examples/line-chart";
import { BarChartExample } from "@/components/examples/bar-chart";
import { DonutChartExample } from "@/components/examples/donut-chart";
import { RadialGoalsExample } from "@/components/examples/radial-goals";
import { FunnelChartExample } from "@/components/examples/funnel-chart";
import { TopPagesExample } from "@/components/examples/top-pages";
import { HealthScoreExample } from "@/components/examples/health-score";
import { ScoreBreakdownExample } from "@/components/examples/score-breakdown";
import { RadarChartExample } from "@/components/examples/radar-chart";
import { ScatterChartExample } from "@/components/examples/scatter-chart";
import { ActivityHeatmapExample } from "@/components/examples/activity-heatmap";
import { StatCardsExample } from "@/components/examples/stat-cards";
import { AccountTableExample } from "@/components/examples/account-table";
import { SegmentedControlExample } from "@/components/examples/segmented-control";
import { ButtonsExample } from "@/components/examples/buttons";
import { BadgeExample } from "@/components/examples/badge";
import { IconExample } from "@/components/examples/icon";
import { ProgressExample } from "@/components/examples/progress";
import { TooltipExample } from "@/components/examples/tooltip";
import { ModalExample } from "@/components/examples/modal";
import { SliderExample } from "@/components/examples/slider";
import { SearchInputExample } from "@/components/examples/search-input";
import { NumberFieldExample } from "@/components/examples/number-field";
import { OtpFieldExample } from "@/components/examples/otp-field";

export const metadata: Metadata = {
  // `absolute` so the layout's "%s · Visuno" template doesn't append a second
  // "Visuno" — the title bar reads exactly "Visuno — components …".
  title: { absolute: `${appName} — components for agent-powered products` },
  description:
    "Visuno is a documented UI component library for AI-agent products, shipped natively for React, Angular, and Flutter from one shared set of design tokens.",
};

/**
 * Landing page in the spirit of the component-library index it documents: a
 * marketing-forward hero that puts the Visuno name and promise up front, a
 * black & white slider of the frameworks and React meta-frameworks it works
 * with, and the FULL library — every shipped component advertised as a live
 * preview card that links into its docs. Page chrome uses Fumadocs
 * --color-fd-* tokens for strong contrast in both themes; live stages use the
 * Visuno --vo-* system so the components look exactly as they ship.
 *
 * The CATEGORIES list below is the landing page's copy of the shipped library
 * and must stay complete: whenever a component lands in all three frameworks
 * with a docs page, add it here too (see the repo guide).
 */

type Entry = { title: string; slug: string; demo: React.ReactNode };
type Category = { n: string; title: string; blurb: string; items: Entry[] };

const CATEGORIES: Category[] = [
  {
    n: "01",
    title: "Agent status",
    blurb:
      "Show what the agent is doing, how far along it is, and what it just did.",
    items: [
      {
        title: "Status pill",
        slug: "status-pill",
        demo: <StatusPillExample />,
      },
      {
        title: "Step loader",
        slug: "step-loader",
        demo: <StepLoaderExample />,
      },
      {
        title: "Thinking states",
        slug: "thinking-states",
        demo: <ThinkingStatesExample />,
      },
      {
        title: "Reasoning trail",
        slug: "reasoning-trail",
        demo: <ReasoningTrailExample />,
      },
      { title: "Thinking", slug: "thinking", demo: <ThinkingExample /> },
      {
        title: "Agent phases",
        slug: "agent-phases",
        demo: <AgentPhasesExample />,
      },
      {
        title: "Context meter",
        slug: "context-meter",
        demo: <ContextMeterExample />,
      },
      { title: "Action log", slug: "action-log", demo: <ActionLogExample /> },
      {
        title: "Browser session",
        slug: "browser-session",
        demo: <BrowserSessionExample />,
      },
      { title: "Web search", slug: "web-search", demo: <WebSearchExample /> },
      { title: "Trace view", slug: "trace-view", demo: <TraceViewExample /> },
      { title: "Run queue", slug: "run-queue", demo: <RunQueueExample /> },
      { title: "Run cost", slug: "run-cost", demo: <RunCostExample /> },
      { title: "Toast", slug: "toast", demo: <ToastExample /> },
      {
        title: "Toast stack",
        slug: "toast-stack",
        demo: <ToastStackExample />,
      },
      {
        title: "Run summary",
        slug: "run-summary",
        demo: <RunSummaryExample />,
      },
      {
        title: "Error and recovery",
        slug: "error-recovery",
        demo: <ErrorRecoveryExample />,
      },
      {
        title: "Agent lanes",
        slug: "agent-lanes",
        demo: <AgentLanesExample />,
      },
      { title: "Agent tree", slug: "agent-tree", demo: <AgentTreeExample /> },
      {
        title: "Agent inbox",
        slug: "agent-inbox",
        demo: <AgentInboxExample />,
      },
      {
        title: "Agent run timeline",
        slug: "agent-run-timeline",
        demo: <AgentRunTimelineExample />,
      },
    ],
  },
  {
    n: "02",
    title: "Conversation",
    blurb:
      "Everything people say to the agent and get back — threads, voice, tools and artifacts.",
    items: [
      {
        title: "Live answer",
        slug: "live-answer",
        demo: <LiveAnswerExample />,
      },
      {
        title: "Thread panel",
        slug: "thread-panel",
        demo: <ThreadPanelExample />,
      },
      { title: "Composer", slug: "composer", demo: <ComposerExample /> },
      {
        title: "Model picker",
        slug: "model-picker",
        demo: <ModelPickerExample />,
      },
      {
        title: "Voice capture",
        slug: "voice-capture",
        demo: <VoiceCaptureExample />,
      },
      { title: "Voice orb", slug: "voice-orb", demo: <VoiceOrbExample /> },
      { title: "Tool call", slug: "tool-call", demo: <ToolCallExample /> },
      {
        title: "Artifact card",
        slug: "artifact-card",
        demo: <ArtifactCardExample />,
      },
      {
        title: "Image generation",
        slug: "image-generation",
        demo: <ImageGenerationExample />,
      },
      {
        title: "Rich text editor",
        slug: "rich-text-editor",
        demo: <RichTextEditorExample />,
      },
      {
        title: "Prompt starters",
        slug: "prompt-starters",
        demo: <PromptStartersExample />,
      },
      {
        title: "Prompt library",
        slug: "prompt-library",
        demo: <PromptLibraryExample />,
      },
      {
        title: "Attachment tray",
        slug: "attachment-tray",
        demo: <AttachmentTrayExample />,
      },
      {
        title: "Response versions",
        slug: "response-versions",
        demo: <ResponseVersionsExample />,
      },
      {
        title: "Answer action bar",
        slug: "answer-action-bar",
        demo: <AnswerActionBarExample />,
      },
      {
        title: "Feedback sheet",
        slug: "feedback-sheet",
        demo: <FeedbackSheetExample />,
      },
    ],
  },
  {
    n: "03",
    title: "Review and approve",
    blurb: "The moments a person steps in: approve, edit, steer or hand off.",
    items: [
      {
        title: "Decision prompt",
        slug: "decision-prompt",
        demo: <DecisionPromptExample />,
      },
      {
        title: "Proposal card",
        slug: "proposal-card",
        demo: <ProposalCardExample />,
      },
      {
        title: "Rewrite toolbar",
        slug: "rewrite-toolbar",
        demo: <RewriteToolbarExample />,
      },
      {
        title: "Design tuner",
        slug: "design-tuner",
        demo: <DesignTunerExample />,
      },
      {
        title: "Permission gate",
        slug: "permission-gate",
        demo: <PermissionGateExample />,
      },
      {
        title: "Hand-off to a person",
        slug: "human-handoff",
        demo: <HumanHandoffExample />,
      },
      {
        title: "Launch checklist",
        slug: "launch-checklist",
        demo: <LaunchChecklistExample />,
      },
      {
        title: "Draft review",
        slug: "draft-review",
        demo: <DraftReviewExample />,
      },
      { title: "Steering", slug: "steering", demo: <SteeringExample /> },
      {
        title: "Eval results",
        slug: "eval-results",
        demo: <EvalResultsExample />,
      },
      {
        title: "Inline text diff",
        slug: "inline-text-diff",
        demo: <InlineTextDiffExample />,
      },
      {
        title: "Design review",
        slug: "design-review",
        demo: <DesignReviewExample />,
      },
      {
        title: "Plan review",
        slug: "plan-review",
        demo: <PlanReviewExample />,
      },
      {
        title: "Change review",
        slug: "change-review",
        demo: <ChangeReviewExample />,
      },
    ],
  },
  {
    n: "04",
    title: "Sources and output",
    blurb:
      "What the agent produced and where it came from — code, data, citations.",
    items: [
      {
        title: "Source stack",
        slug: "source-stack",
        demo: <SourceStackExample />,
      },
      {
        title: "Metric insight",
        slug: "metric-insight",
        demo: <MetricInsightExample />,
      },
      { title: "Task table", slug: "task-table", demo: <TaskTableExample /> },
      {
        title: "Code viewer",
        slug: "code-viewer",
        demo: <CodeViewerExample />,
      },
      {
        title: "Terminal stream",
        slug: "terminal-stream",
        demo: <TerminalStreamExample />,
      },
      {
        title: "Details panel",
        slug: "details-panel",
        demo: <DetailsPanelExample />,
      },
      {
        title: "Citation hover card",
        slug: "citation-hover-card",
        demo: <CitationHoverCardExample />,
      },
      {
        title: "Field extraction",
        slug: "field-extraction",
        demo: <FieldExtractionExample />,
      },
    ],
  },
  {
    n: "05",
    title: "Charts and tables",
    blurb:
      "Compact ways to show the numbers the agent produced or is tracking.",
    items: [
      { title: "Line chart", slug: "line-chart", demo: <LineChartExample /> },
      { title: "Bar chart", slug: "bar-chart", demo: <BarChartExample /> },
      {
        title: "Donut chart",
        slug: "donut-chart",
        demo: <DonutChartExample />,
      },
      {
        title: "Radial goals",
        slug: "radial-goals",
        demo: <RadialGoalsExample />,
      },
      {
        title: "Funnel chart",
        slug: "funnel-chart",
        demo: <FunnelChartExample />,
      },
      { title: "Top pages", slug: "top-pages", demo: <TopPagesExample /> },
      {
        title: "Health score",
        slug: "health-score",
        demo: <HealthScoreExample />,
      },
      {
        title: "Score breakdown",
        slug: "score-breakdown",
        demo: <ScoreBreakdownExample />,
      },
      { title: "Eval radar", slug: "radar-chart", demo: <RadarChartExample /> },
      {
        title: "Cost vs quality",
        slug: "scatter-chart",
        demo: <ScatterChartExample />,
      },
      {
        title: "Activity heatmap",
        slug: "activity-heatmap",
        demo: <ActivityHeatmapExample />,
      },
      { title: "Stat cards", slug: "stat-cards", demo: <StatCardsExample /> },
      {
        title: "Account table",
        slug: "account-table",
        demo: <AccountTableExample />,
      },
    ],
  },
  {
    n: "06",
    title: "Dates",
    blurb: "Switches and ranges for time and selection.",
    items: [
      {
        title: "Segmented control",
        slug: "segmented-control",
        demo: <SegmentedControlExample />,
      },
    ],
  },
  {
    n: "07",
    title: "Core",
    blurb: "The building blocks everything else is made of: layout, buttons, badges, icons.",
    items: [
      { title: "Buttons", slug: "buttons", demo: <ButtonsExample /> },
      { title: "Badge", slug: "badge", demo: <BadgeExample /> },
      { title: "Icon", slug: "icon", demo: <IconExample /> },
      {
        title: "Progress and meter",
        slug: "progress",
        demo: <ProgressExample />,
      },
      { title: "Tooltip", slug: "tooltip", demo: <TooltipExample /> },
      { title: "Modal", slug: "modal", demo: <ModalExample /> },
      { title: "Slider", slug: "slider", demo: <SliderExample /> },
      {
        title: "Search input",
        slug: "search-input",
        demo: <SearchInputExample />,
      },
      {
        title: "Number field",
        slug: "number-field",
        demo: <NumberFieldExample />,
      },
      { title: "OTP field", slug: "otp-field", demo: <OtpFieldExample /> },
    ],
  },
];

const COMPONENT_COUNT = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

export default function HomePage() {
  return (
    <main className="visuno-home">
      {/* Hero */}
      <section className="vh-hero">
        <div className="vh-hero-copy">
          <h1 className="vh-h1">
            Visuno — ship agent UIs in <em>every</em> stack, from one design.
          </h1>
          <p className="vh-sub">
            <strong>{COMPONENT_COUNT}+ documented components</strong> in
            React, Angular, and Flutter — built from one shared
            set of design tokens, so the look and behavior stay identical
            wherever you build. Copy, paste, ship.
          </p>
          <div className="vh-actions">
            <Link href="/docs" className="vh-cta">
              Open the docs
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a
              href="https://github.com/Visuno/components"
              className="vh-cta-ghost"
              target="_blank"
              rel="noreferrer"
            >
              Star on GitHub
            </a>
          </div>
        </div>

        <div className="vh-mark" aria-hidden="true">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo.png`}
            alt=""
            width={520}
            height={460}
            priority
            className="vh-mark-img"
          />
        </div>
      </section>

      {/* Frameworks — auto-scrolling black & white logo slider */}
      <FrameworkSlider />

      {/* Full library — every component advertised as a live preview */}
      <section className="vh-lib">
        <div className="vh-lib-intro">
          <h2 className="vh-lib-h2">The whole library, live.</h2>
          <p className="vh-lib-lead">
            Every one of the {COMPONENT_COUNT} components below is running right
            here — the real Visuno component on a soft stage. Click any card to
            open its docs, with code tabs for React, Angular, and Flutter.
          </p>
        </div>
        {CATEGORIES.map((cat) => (
          <div key={cat.n}>
            <div className="vh-lib-head">
              <span className="vh-lib-n">{cat.n}</span>
              <h2 className="vh-lib-title">{cat.title}</h2>
              <span className="vh-lib-blurb">{cat.blurb}</span>
            </div>
            <ul className="vh-sc-grid">
              {cat.items.map((it) => (
                <li key={it.slug}>
                  <ShowcaseCard title={it.title} slug={it.slug}>
                    {it.demo}
                  </ShowcaseCard>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <footer className="vh-footer">
        <div>
          Open source under the MIT licence.{" "}
          <a
            href="https://github.com/Visuno/components"
            className="vh-footer-link"
          >
            Star on GitHub
          </a>
          .{" "}
          <Link href="/docs/imprint" className="vh-footer-link">
            Imprint
          </Link>
        </div>
        <a
          href="https://sdkindustries.de"
          target="_blank"
          rel="noreferrer"
          className="vh-poweredby"
        >
          <span>Powered by</span>
          {/* Theme-aware: dark-ink mark on light background, light mark on dark. */}
          <img
            className="vh-sdk-logo vh-sdk-logo-dark-ink"
            src="https://sdkindustries.de/logo-dark.svg"
            alt="SDK Industries"
            height={20}
          />
          <img
            className="vh-sdk-logo vh-sdk-logo-light-ink"
            src="https://sdkindustries.de/logo.svg"
            alt="SDK Industries"
            height={20}
          />
        </a>
      </footer>
    </main>
  );
}
