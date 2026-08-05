"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { useLenis } from "@/components/providers/lenis-provider";

type Props = {
  href: string;
  label: string;
  active?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function NavLink({ href, label, active = false, onNavigate, className }: Props) {
  const pathname = usePathname();
  const { scrollTo } = useLenis();
  const [path, hash] = href.split("#");
  const isAnchor = Boolean(hash);

  const handleClick = (e: React.MouseEvent) => {
    if (isAnchor && pathname === (path || "/")) {
      e.preventDefault();
      scrollTo(`#${hash}`);
    }
    onNavigate?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "text-ink/60 transition-colors duration-200 hover:text-ink",
        active && "text-ink",
        className
      )}
    >
      {label}
    </Link>
  );
}
