# Run queue (/docs/components/run-queue)

A run queue shows a batch of agent jobs moving through three parts. The job running is raised on
its own card with its agent, its steps, a progress bar and the time left. The jobs up next wait
below, each with when it should start, and the jobs done sit under them with how long each took and
a green tick. A failed step turns its job red and offers a Retry; a Detailed / Compact switch folds
the running job's steps away; and once every job is done a summary takes the running job's place.

<Preview>
  <RunQueueExample />
</Preview>

## Usage [#usage]

<Tabs items={['React', 'Angular', 'Flutter']}>

<Tab value="React">

```tsx
import { RunQueue } from './run-queue/RunQueue';

const jobs = [
  { id: 'email', title: 'Draft the launch email', agent: 'Copy agent', state: 'running', time: '4.2s',
    steps: [
      { label: 'Outline', state: 'done', meta: 'done' },
      { label: 'Draft', state: 'running' },
      { label: 'Proofread', state: 'queued' },
    ] },
  { id: 'post', title: 'Schedule the posts', agent: 'Social agent', state: 'queued', time: 'in ~4s' },
];

<RunQueue title="Launch prep" jobs={jobs} summary="12.8s in all" onRetry={(j, s) => retry(j, s)} />
```

</Tab>

<Tab value="Angular">

```html
<!-- imports: [RunQueueComponent] -->
jobs: RunJob[] = [
  { id: 'email', title: 'Draft the launch email', agent: 'Copy agent', state: 'running', time: '4.2s',
    steps: [
      { label: 'Outline', state: 'done', meta: 'done' },
      { label: 'Draft', state: 'running' },
      { label: 'Proofread', state: 'queued' },
    ] },
  { id: 'post', title: 'Schedule the posts', agent: 'Social agent', state: 'queued', time: 'in ~4s' },
];
```

```html
<RunQueue
  title="Launch prep"
  [jobs]="jobs"
  summary="12.8s in all"
  (retry)="onRetry($event)"
  (densityChange)="onDensity($event)"
></RunQueue>
```

</Tab>

<Tab value="Flutter">

```dart
import 'components/run_queue.dart';

RunQueue(
  title: 'Launch prep',
  summary: '12.8s in all',
  onRetry: (job, step) => retry(job, step),
  jobs: const [
    RunJob(id: 'email', title: 'Draft the launch email', agent: 'Copy agent', state: RunState.running, time: '4.2s', steps: [
      RunStep(label: 'Outline', state: RunState.done, meta: 'done'),
      RunStep(label: 'Draft', state: RunState.running),
      RunStep(label: 'Proofread', state: RunState.queued),
    ]),
    RunJob(id: 'post', title: 'Schedule the posts', agent: 'Social agent', state: RunState.queued, time: 'in ~4s'),
  ],
),
```

</Tab>

</Tabs>

## Properties [#properties]

| Name | Type | Description |
| --- | --- | --- |
| `jobs` | `RunJob[]` | The jobs in the queue. Each has a title, an agent, an icon, a state, an optional progress, a time, a note, and its steps. |
| `title` | `string` | The queue's name over its status line. |
| `status` | `string` | Overrides the status line. Defaults to "1 of 4 done" or "All 4 done". |
| `summary` | `string` | The line under "All N jobs done" once every job is done, like "18.4s in all · 1 retry". |
| `density` | `detailed \| compact` | detailed lists the running job's steps, compact folds them away. Left out, the switch changes it. |
| `onDensityChange` / `densityChange` | `callback` | Fires when the Detailed / Compact switch changes. |
| `onRetry` / `retry` | `callback` | Called by a failed step's Retry button with the job's and the step's index. Without it, failed steps show no button. |
| `bare` | `boolean` | Sits flat in a chat thread, with no card. False by default. |

A `RunJob` state is queued, running, failed, or done. A `RunStep` has a label, a state, and an
optional meta shown once the step is done. Progress defaults to the share of a job's steps that are
done.

## Theming [#theming]

Works in light and dark (`data-theme="dark"`) and in the Soft style (`data-style="soft"`). In
Blueprint the running job gets a hairline in the accent and the progress bars fill in steps. A
failed job turns red with a hatched fill; the step glyphs are a spinner while running, a tick when
done, and a cross on failure.
