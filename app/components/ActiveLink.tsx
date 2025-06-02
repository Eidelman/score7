// components/ActiveLink.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // Optional: for class name conditionally joining

type ActiveLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
};

export default function ActiveLink({
  href,
  children,
  className,
  activeClassName = "text-blue-600 font-bold",
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(className, "uppercase text-xs", {
        [activeClassName]: isActive,
      })}
    >
      {children}
    </Link>
  );
}
