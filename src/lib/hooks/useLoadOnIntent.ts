import * as React from "react";

interface Point {
  x: number;
  y: number;
}

interface PointerSnapshot extends Point {
  time: number;
}

interface LoadOnIntentProps {
  ref: React.RefObject<HTMLElement | null>;
  cb: () => void;
  options?: LoadOnIntentOptions;
}

interface LoadOnIntentOptions {
  maxRadius?: number;
  minRadius?: number;
  dwellTime?: number;
  keepObserving?: boolean;
  onRadiusChange?: (radius: number) => void;
}

const DEFAULT_MAX_RADIUS = 50;
const DEFAULT_MIN_RADIUS = 10;
const DEFAULT_DWELL_TIME = 50;

/** The pointer speed that produces the maximum intent radius. */
const FULL_RADIUS_SPEED = 1_000;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function getPointerSnapshot(event: PointerEvent) {
  return {
    x: event.clientX,
    y: event.clientY,
    /** For each pointer event, we need x/y pos as well as the time so we can calculate the velocity */
    time: event.timeStamp,
  };
}

function getVelocity(prev: PointerSnapshot, current: PointerSnapshot) {
  const elapsedSeconds = (current.time - prev.time) / 1_000;

  if (elapsedSeconds <= 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: (current.x - prev.x) / elapsedSeconds,
    y: (current.y - prev.y) / elapsedSeconds,
  };
}

function getClosestPoint(pointer: Point, rect: DOMRect) {
  return {
    x: clamp(pointer.x, rect.left, rect.right),
    y: clamp(pointer.y, rect.top, rect.bottom),
  };
}

/** Returns 1 for movement toward the element and 0 for sideways or outward movement. */
function getAlignment(pointer: Point, velocity: Point, rect: DOMRect) {
  const target = getClosestPoint(pointer, rect);

  const directionToTarget = {
    x: target.x - pointer.x,
    y: target.y - pointer.y,
  };

  const targetDistance = Math.hypot(directionToTarget.x, directionToTarget.y);

  const speed = Math.hypot(velocity.x, velocity.y);

  if (targetDistance === 0 || speed === 0) {
    return 0;
  }

  const alignment =
    (velocity.x * directionToTarget.x + velocity.y * directionToTarget.y) /
    (speed * targetDistance);

  return clamp(alignment, 0, 1);
}

function getRadius(
  velocity: Point,
  alignment: number,
  minimumRadius: number,
  maximumRadius: number
) {
  const speed = Math.hypot(velocity.x, velocity.y);
  const speedFactor = clamp(speed / FULL_RADIUS_SPEED, 0, 1);
  const intentFactor = speedFactor * alignment;

  return minimumRadius + intentFactor * (maximumRadius - minimumRadius);
}

function isInsideRadius(point: Point, rect: DOMRect, radius: number) {
  return (
    point.x >= rect.left - radius &&
    point.x <= rect.right + radius &&
    point.y >= rect.top - radius &&
    point.y <= rect.bottom + radius
  );
}

export function useLoadOnIntent({ ref, cb, options }: LoadOnIntentProps) {
  const cbRef = React.useRef<LoadOnIntentProps["cb"]>(cb);
  const onRadiusChangeRef = React.useRef(options?.onRadiusChange);
  cbRef.current = cb;
  onRadiusChangeRef.current = options?.onRadiusChange;

  const {
    maxRadius = DEFAULT_MAX_RADIUS,
    minRadius = DEFAULT_MIN_RADIUS,
    dwellTime = DEFAULT_DWELL_TIME,
    keepObserving = false,
  } = options ?? {};

  React.useEffect(
    function handleObservation() {
      let previousSnapshot: PointerSnapshot | undefined;
      let dwellTimer: ReturnType<typeof setTimeout> | undefined;
      let activeRadius: number | undefined;
      let hasLoaded = false;
      const element = ref.current;

      if (!element) return;

      onRadiusChangeRef.current?.(minRadius);

      function stopObservation() {
        if (!element) return;
        cancelTimer();
        onRadiusChangeRef.current?.(minRadius);
        window.removeEventListener("pointermove", handlePointerMove);
        element.removeEventListener("pointerenter", startTimer);
        element.removeEventListener("pointerleave", cancelTimer);
        element.removeEventListener("focus", handleCallback);
      }

      function handleCallback() {
        if (hasLoaded) return;

        hasLoaded = true;

        if (!keepObserving) {
          stopObservation();
        }

        cbRef.current();
      }

      function startTimer() {
        if (hasLoaded || dwellTimer !== undefined) {
          return;
        }

        dwellTimer = setTimeout(function confirmIntent() {
          dwellTimer = undefined;
          handleCallback();
        }, dwellTime);
      }

      function cancelTimer() {
        if (dwellTimer === undefined) return;
        clearTimeout(dwellTimer);
        dwellTimer = undefined;
      }

      function handlePointerMove(event: PointerEvent) {
        if (!element) return;
        const snapshot = getPointerSnapshot(event);

        /** We need an existing snapshot to measure velocity change between prev and current point.
         * Create and store first if non-existant
         */
        if (!previousSnapshot) {
          previousSnapshot = snapshot;
          return;
        }

        const rect = element.getBoundingClientRect();
        const velocity = getVelocity(previousSnapshot, snapshot);
        const alignment = getAlignment(snapshot, velocity, rect);
        const calculatedRadius = getRadius(velocity, alignment, minRadius, maxRadius);
        const radius = Math.max(activeRadius ?? minRadius, calculatedRadius);

        if (isInsideRadius(snapshot, rect, radius)) {
          activeRadius = radius;
          startTimer();
        } else {
          activeRadius = undefined;
          cancelTimer();
        }

        onRadiusChangeRef.current?.(activeRadius ?? calculatedRadius);

        previousSnapshot = snapshot;
      }

      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      element.addEventListener("pointerenter", startTimer);
      element.addEventListener("pointerleave", cancelTimer);
      element.addEventListener("focus", handleCallback);

      return function cleanupObservation() {
        stopObservation();
      };
    },
    [ref, minRadius, maxRadius, dwellTime, keepObserving]
  );
}
