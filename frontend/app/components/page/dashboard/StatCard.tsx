export interface StatCardProps{
    label : string,
    value : number,
    caption : string
}


export default function StatCard( { label, value, caption } : StatCardProps){
    return(
    <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-1 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">{label}</p>
        <p className="mt-5 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white">{value}</p>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{caption}</p>
    </div>
    )
}
