import React, { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** hide the track + arrows entirely (still drag-scrollable) */
  bare?: boolean;
};

/** Horizontal scroller: slim progress line instead of the native scrollbar, plus mouse drag. */
const HScroll = ({ children, className = "", bare = false }: Props) => {
  const scroller = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    const th = thumb.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const has = max > 4;
    setOverflowing(has);
    if (th && has) {
      const ratio = el.clientWidth / el.scrollWidth;
      th.style.width = `${ratio * 100}%`;
      th.style.transform = `translateX(${(el.scrollLeft / max) * (1 / ratio - 1) * 100}%)`;
    }
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    window.addEventListener("resize", update);

    // mouse drag to scroll (touch already scrolls natively)
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) {
        moved = true;
        el.classList.add("is-dragging");
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
      el.classList.remove("is-dragging");
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const noDrag = (e: Event) => e.preventDefault();
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", noDrag);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      window.removeEventListener("resize", update);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", noDrag);
    };
  }, [update]);

  return (
    <div className="w-full">
      <div ref={scroller} className={`hscroll no-scrollbar overflow-x-auto ${className}`}>
        {children}
      </div>
      {!bare && overflowing && (
        <div className="flex items-center gap-4 mt-3">
          <div className="relative flex-1 h-[2px] bg-mainDarkColor/15 rounded-full overflow-hidden">
            <div
              ref={thumb}
              className="absolute left-0 top-0 h-full bg-mainDarkColor rounded-full will-change-transform"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HScroll;
