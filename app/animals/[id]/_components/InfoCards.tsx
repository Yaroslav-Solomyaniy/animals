import {LucideIcon} from 'lucide-react'

type InfoCardProps = {
    icon: LucideIcon
    label: string
    value: string
    isActive?: boolean
}

export function InfoCard({icon: Icon, label, value, isActive}: InfoCardProps) {

    const iconStyleMap = {
        true: 'bg-green-100',
        false: 'bg-red-100',
        undefined: 'bg-orange-100',
    } as const

    const iconStyle = iconStyleMap[String(isActive) as keyof typeof iconStyleMap]

    return (
        <div
            className={`rounded-2xl border border-orange-100 px-4 py-5 flex flex-col items-center text-center
      shadow-sm hover:shadow-md transition bg-white`}
        >
            <div
                className={`flex h-15 w-15 items-center justify-center rounded-full text-black-600 ${iconStyle}`}
            >
                <Icon className="h-7 w-7"/>
            </div>

            <p className="mt-3 text-[14px] font-semibold  text-gray-900">{value}</p>
            <p className="text-[13px] text-gray-400">{label}</p>
        </div>
    )
}