



export default function SectionHeading({ eyebrow, title, detail }: { eyebrow: string, title: string, detail: string }){

            
        return(
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">{eyebrow}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{detail}</p>
            </div>
        )

}