# Load on intent

`useLoadOnIntent` loads data once when a pointer approaches an element, enters it, or the element receives focus.

```text
useLoadOnIntent({ ref, cb, options })
│
├── cbRef
│   └── always contains the latest callback
│
├── onRadiusChangeRef
│   └── always contains the latest radius callback
│
└── useEffect: start observation
    │
    ├── element does not exist
    │   └── stop setup
    │
    ├── publish minRadius
    │
    ├── window pointermove
    │   └── handlePointerMove
    │       │
    │       ├── getPointerSnapshot
    │       │   └── { x, y, time }
    │       │
    │       ├── no previous snapshot
    │       │   └── store current snapshot and wait
    │       │
    │       ├── getVelocity
    │       │   └── movement in pixels per second
    │       │
    │       ├── getAlignment
    │       │   └── movement towards the nearest point on the element
    │       │
    │       ├── getRadius
    │       │   └── calculate a value from minRadius to maxRadius
    │       │
    │       ├── pointer inside active radius?
    │       │   ├── yes → hold or increase radius, then start timer
    │       │   └── no  → clear active radius and cancel timer
    │       │
    │       ├── publish displayed radius
    │       └── store snapshot for the next movement
    │
    ├── element pointerenter
    │   └── start timer
    │
    ├── element pointerleave
    │   └── cancel timer
    │
    ├── element focus
    │   └── confirm intent immediately
    │
    └── timer completes
        └── handleCallback
            ├── prevent a second call
            ├── stop observation unless keepObserving is true
            └── call cbRef.current()
```

## Options

```ts
interface LoadOnIntentOptions {
  minRadius?: number;
  maxRadius?: number;
  dwellTime?: number;
  keepObserving?: boolean;
  onRadiusChange?: (radius: number) => void;
}
```

| Option | Default | Purpose |
| --- | ---: | --- |
| `minRadius` | `10` | Sets the smallest intent area around the element. |
| `maxRadius` | `50` | Sets the largest intent area around the element. |
| `dwellTime` | `50` ms | Sets how long the pointer must remain in the area. |
| `keepObserving` | `false` | Keeps pointer observation active after the callback runs. The callback still runs once. |
| `onRadiusChange` | None | Reports the real radius for a visual display or diagnostic tool. |

## How the dynamic radius changes

```text
Pointer movement              Speed factor   Alignment   Calculated radius
─────────────────────────────────────────────────────────────────────────
Stopped                       0.0            0.0         minimum
Fast, moving sideways         1.0            0.0         minimum
Slow, moving towards target   0.3            1.0         partial
Fast, moving towards target   1.0            1.0         maximum
Fast, moving away             1.0            0.0         minimum
```

```text
calculatedRadius =
  minRadius
  + speedFactor
  × alignment
  × (maxRadius - minRadius)
```

`FULL_RADIUS_SPEED` is `1,000` pixels per second. Movement at or above this speed produces a speed factor of `1`.

Alignment has a value from `0` to `1`:

```text
1 → directly towards the element
0 → sideways or away from the element
```

The hook compares pointer movement with the direction to the nearest point on the element. It does not require the pointer to aim at the element centre.

## Holding the active radius

The radius must not shrink while the pointer remains inside it. A user often slows down near a target, which reduces the calculated radius. Immediate reduction could place the pointer outside the new area and cancel valid intent.

```text
Pointer outside the radius
  use the calculated radius

Pointer enters the radius
  store it as the active radius
  start the dwell timer

Pointer remains inside
  allow the radius to grow
  do not allow it to shrink

Pointer leaves the active radius
  clear the active radius
  cancel the dwell timer
  resume dynamic calculation
```

## Rejecting a fast pass-through

```text
Pointer enters intent area
  start 50 ms timer

Pointer leaves before 50 ms
  cancel timer
  do not load

Pointer remains for 50 ms
  call callback once
```

Focus is a direct intent signal, so it calls the callback without a dwell delay.

## Observation after loading

Normal use removes all listeners after the callback runs:

```ts
useLoadOnIntent({
  ref: buttonRef,
  cb: loadData,
});
```

The visual demo keeps pointer observation active so it can continue to show radius changes:

```ts
useLoadOnIntent({
  ref: buttonRef,
  cb: loadData,
  options: {
    minRadius: 40,
    maxRadius: 130,
    keepObserving: true,
    onRadiusChange: handleRadiusChange,
  },
});
```

`hasLoaded` still prevents more callbacks and timers. Only radius calculation continues.

## Demo presentation

The demo updates the radius element through a DOM ref. This avoids a React render for each pointer event. It expands immediately and uses a short demo-only timer before it shrinks. The hook still reports the real radius without a delay.

The button contains its loading state. `AnimatePresence` and a keyed `motion.span` cross-fade the labels with a `2px` blur over `150ms`:

```text
Load data
  ↓
Loading…
  ↓
Data loaded
```

Reduced-motion mode removes the blur and transition duration. The button uses `aria-live="polite"` to announce its status changes.

## Effect dependencies

The effect depends on primitive option values rather than the complete `options` object:

```ts
[ref, minRadius, maxRadius, dwellTime, keepObserving]
```

The callback refs do not belong in the dependency list. Their identity remains stable, and each handler reads the latest `.current` value when it runs.
