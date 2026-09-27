

"use client";

import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useState } from "react";

const DEFAULT_HREF = "#";
const TABLET_BREAKPOINT = 1025;

export default function LinkButton({
    btnText = "Hover me",
    mobileText = "Click me",
    textColor = "#5bd964ff",
    hoverColor = "#d2349eff",
    clickedColor = "#bdada1ff",
    href = DEFAULT_HREF,
    className = "",
    linkProps = {},
    icon: Icon = ArrowRight,
    iconClassName = "max-md:size-[6vw] max-[1025px]:size-[4vw]",
    showIcon = true,
    underlineHeight = 1.5,
    transitionDuration = 0.5,
    disableNavigation = false,
    compact,
    onClick,
    ...props
}) {
    const [isIconRotated, setIsIconRotated] = useState(false);
    const [isCompactViewport, setIsCompactViewport] = useState(false);
    const [hasMeasuredViewport, setHasMeasuredViewport] = useState(false);

    useLayoutEffect(() => {
        const onResize = () => {
            setIsCompactViewport(window.innerWidth <= TABLET_BREAKPOINT);
            setHasMeasuredViewport(true);
        };

        onResize();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    const onLinkClick = (event) => {
        setIsIconRotated((previousValue) => !previousValue);

        if (disableNavigation) {
            event.preventDefault();
        }

        onClick?.(event);
    };

    const { style: customStyle, ...restProps } = props;
    const effectiveCompact = compact ?? (hasMeasuredViewport && isCompactViewport);
    const displayText = effectiveCompact ? mobileText : btnText;

    const mergedStyle = {
        "--underline-height": `${underlineHeight}px`,
        "--transition-duration": `${transitionDuration}s`,
        ...(hoverColor ? { "--link-hover-color": hoverColor } : null),
        ...(textColor ? { "--link-text-color": textColor } : null),
        ...(effectiveCompact && isIconRotated ? { color: clickedColor } : null),
        ...customStyle,
    };

    const iconClassNames = `${isIconRotated ? "motion-safe:-rotate-45" : ""} ${!effectiveCompact ? "motion-safe:group-hover:-rotate-45" : ""
        } size-[1.1vw] max-[1025px]:size-[2vw] max-md:size-[3.5vw] transition-transform duration-[var(--transition-duration)] motion-reduce:rotate-0 motion-reduce:transition-none ${iconClassName}`;

    return (
        <a
            href={href}
            {...linkProps}
            {...restProps}
            onClick={onLinkClick}
            className={`group inline-block align-middle w-fit cursor-pointer text-[1.1vw] leading-[1.2] duration-300 text-[color:var(--link-text-color)] hover:text-[color:var(--link-hover-color)] max-[1025px]:text-[4vw] max-md:text-[5.5vw] ${className}`}
            style={mergedStyle}
        >
            <div className="flex items-center justify-start gap-2">
                <span
                    className={`btn-link-line relative inline-block w-fit after:absolute after:left-0 after:bottom-[-2%] after:h-[var(--underline-height)] after:w-full after:bg-current after:content-[''] after:transition-transform after:duration-[var(--transition-duration)] after:ease-[cubic-bezier(0.62,0.05,0.01,0.99)] motion-reduce:after:transition-none ${effectiveCompact
                        ? isIconRotated
                            ? "after:origin-right after:scale-x-0 motion-safe:after:origin-left motion-safe:after:scale-x-100"
                            : "after:origin-right after:scale-x-0"
                        : "after:origin-right after:scale-x-0 motion-safe:group-hover:after:origin-left motion-safe:group-hover:after:scale-x-100"
                        }`}
                >
                    {displayText}
                </span>

                <span className="sr-only">About {href}</span>

                {showIcon && Icon && <Icon className={iconClassNames} />}
            </div>
        </a>
    );
}
