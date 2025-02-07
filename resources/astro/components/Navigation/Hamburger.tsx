import { useStore } from "@nanostores/react";
import { showingNavigationDropdown } from "./hamburgerStore";
import type { AnchorHTMLAttributes } from "react";
import { clsx } from "clsx";

export function Hamburger() {
    const $showingNavigationDropdown = useStore(showingNavigationDropdown);
    return (
        <button
            onClick={() =>
                showingNavigationDropdown.set(!$showingNavigationDropdown)
            }
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
        >
            <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    className={
                        !$showingNavigationDropdown ? "inline-flex" : "hidden"
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                ></path>
                <path
                    className={
                        $showingNavigationDropdown ? "inline-flex" : "hidden"
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                ></path>
            </svg>
        </button>
    );
}

export function ResponsiveNavigationMenu({
    user,
}: {
    user: { name: string; email: string };
}) {
    const $showingNavigationDropdown = useStore(showingNavigationDropdown);

    return (
        <div
            className={
                ($showingNavigationDropdown ? "block" : "hidden") + " sm:hidden"
            }
        >
            <div className="space-y-1 pb-3 pt-2">
                <ResponsiveNavLink href="/dashboard" active={false}>
                    Dashboard
                </ResponsiveNavLink>
            </div>

            <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                <div className="px-4">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                        {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        {user.email}
                    </div>
                </div>

                <div className="mt-3 space-y-1">
                    <ResponsiveNavLink href="/profile">
                        Profile
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        method="post"
                        href="/logout"
                        component="button"
                    >
                        Log Out
                    </ResponsiveNavLink>
                </div>
            </div>
        </div>
    );
}

function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }) {
    return (
        <a
            {...props}
            className={clsx(
                "flex w-full items-start border-l-4 py-2 pe-4 ps-3",
                active
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800 dark:border-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 dark:focus:border-indigo-300 dark:focus:bg-indigo-900 dark:focus:text-indigo-200"
                    : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus:border-gray-600 dark:focus:bg-gray-700 dark:focus:text-gray-200",
                "text-base font-medium transition duration-150 ease-in-out focus:outline-none",
                className
            )}
        >
            {children}
        </a>
    );
}
