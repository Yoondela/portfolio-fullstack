"use client";

import Link from "next/link";
import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { signOutFromNavigation } from "./auth-actions";

type MenuFocusTarget = "first" | "last";

const menuItemClassName =
  "block w-full whitespace-nowrap rounded px-3 py-2 text-left text-sm text-stone-800 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-800 dark:text-stone-200 dark:hover:bg-stone-800 dark:focus-visible:outline-amber-300";

/** Interactive account menu for the shared navigation shell. */
export function AccountMenu({ isSignedIn }: { isSignedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusTarget, setFocusTarget] = useState<MenuFocusTarget | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonId = useId();
  const menuId = useId();

  function getMenuItems() {
    return Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    );
  }

  function closeMenu(returnFocus = false) {
    setIsOpen(false);
    setFocusTarget(null);
    if (returnFocus) avatarRef.current?.focus();
  }

  function openMenu(target: MenuFocusTarget) {
    setIsOpen(true);
    setFocusTarget(target);
  }

  useEffect(() => {
    if (!isOpen || !focusTarget) return;

    const menuItems = getMenuItems();
    const itemIndex = focusTarget === "first" ? 0 : menuItems.length - 1;
    menuItems[itemIndex]?.focus();
  }, [focusTarget, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && !containerRef.current?.contains(target)) {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
  }, [isOpen]);

  function handleAvatarKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const menuItems = getMenuItems();
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    if (menuItems.length === 0) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1 + menuItems.length) % menuItems.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = menuItems.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      menuItems[nextIndex]?.focus();
    }
  }

  const avatarClassName = isSignedIn
    ? "border-stone-950 bg-stone-950 text-stone-50"
    : "border-stone-500 bg-transparent text-stone-900 dark:border-stone-400 dark:text-stone-100";

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={avatarRef}
        id={buttonId}
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => (isOpen ? closeMenu() : openMenu("first"))}
        onKeyDown={handleAvatarKeyDown}
        className={`flex size-9 items-center justify-center rounded-full border text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800 dark:focus-visible:outline-amber-300 ${avatarClassName}`}
      >
        Y
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={buttonId}
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-full z-50 mt-2 min-w-44 rounded border border-stone-300 bg-stone-50 p-1 shadow-lg dark:border-stone-700 dark:bg-stone-950"
        >
          {isSignedIn ? (
            <>
              <li role="none">
                <Link
                  href="/manage/projects"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => closeMenu(true)}
                  className={menuItemClassName}
                >
                  Manage projects
                </Link>
              </li>
              <li role="none">
                <form action={signOutFromNavigation} onSubmit={() => closeMenu()}>
                  <button
                    type="submit"
                    role="menuitem"
                    tabIndex={-1}
                    className={menuItemClassName}
                  >
                    Sign out
                  </button>
                </form>
              </li>
            </>
          ) : (
            <li role="none">
              <Link
                href="/signin"
                role="menuitem"
                tabIndex={-1}
                onClick={() => closeMenu(true)}
                className={menuItemClassName}
              >
                Sign in
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
