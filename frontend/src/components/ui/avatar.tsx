import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.ComponentProps<"div"> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: number;
}

export function Avatar({ src, alt, fallback, size = 40, className, ...props }: AvatarProps) {
    return (
        <div
            className={cn(
                "rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border",
                className
            )}
            style={{ width: size, height: size }}
            {...props}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || fallback || "avatar"}
                    className="object-cover w-full h-full"
                />
            ) : (
                <span className="text-lg font-semibold text-muted-foreground">
                    {fallback?.slice(0, 2).toUpperCase()}
                </span>
            )}
        </div>
    );
} 