import { Transition } from "@headlessui/react";
import { useStore } from "@nanostores/react";
import {
    type AnchorHTMLAttributes,
    createContext,
    type Dispatch,
    type PropsWithChildren,
    type SetStateAction,
} from "react";
import { isDropdownOpen } from "./dropdownStore";
import { clsx } from "clsx";

const DropDownContext = createContext<{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
}>({
    open: false,
    setOpen: () => {},
    toggleOpen: () => {},
});

const Dropdown = ({ children }: PropsWithChildren) => {
    return <div className="relative">{children}</div>;
};

const Trigger = ({ children }: PropsWithChildren) => {
    const $isDropdownOpen = useStore(isDropdownOpen);

    return (
        <>
            <div onClick={() => isDropdownOpen.set(!$isDropdownOpen)}>
                {children}
            </div>

            {$isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => isDropdownOpen.set(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = "right",
    width = "48",
    contentClasses = "py-1 bg-white dark:bg-gray-700",
    children,
}: PropsWithChildren<{
    align?: "left" | "right";
    width?: "48";
    contentClasses?: string;
}>) => {
    const $isDropdownOpen = useStore(isDropdownOpen);

    let alignmentClasses = "origin-top";

    if (align === "left") {
        alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
    } else if (align === "right") {
        alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
    }

    let widthClasses = "";

    if (width === "48") {
        widthClasses = "w-48";
    }

    return (
        <>
            <Transition
                show={$isDropdownOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => isDropdownOpen.set(false)}
                >
                    <div
                        className={
                            `rounded-md ring-1 ring-black ring-opacity-5 ` +
                            contentClasses
                        }
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({
    className = "",
    children,
    ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
        <a
            {...props}
            className={clsx(
                "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
                className
            )}
        >
            {children}
        </a>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
