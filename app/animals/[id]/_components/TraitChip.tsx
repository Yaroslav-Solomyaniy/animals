import type {FC} from "react";
import React from "react";
import type {LucideIcon} from "lucide-react";

interface Props {
    icon: LucideIcon
    children: React.ReactNode
}

export const TraitChip: FC<Props> = ({icon: Icon, children}) => {
    return (
        <span
            className="inline-flex w-full min-h-10 items-center gap-2 rounded-full bg-[#eef8e7] px-4 text-sm font-extrabold text-gray-700">
      <Icon className="h-4 w-4 text-emerald-700"/>
            {children}
    </span>
    )
}
