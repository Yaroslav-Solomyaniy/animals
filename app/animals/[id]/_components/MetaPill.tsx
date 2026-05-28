import type {LucideIcon} from "lucide-react";
import React, {FC} from "react";

interface Props {
    icon: LucideIcon,
    children: React.ReactNode
}

export const MetaPill: FC<Props> = ({icon: Icon, children}) => {
    return (
        <span
            className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1.5 text-xs font-extrabold text-white ring-1 ring-white/25 backdrop-blur">
      <Icon className="h-4 w-4"/>
            {children}
    </span>
    )
}