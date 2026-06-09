import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import type { calculateLanguageStats } from "~/utils/statpage";
import EmptyState from "./EmptyState";


export interface TechnologyDistributionProps{
    languages : ReturnType<typeof calculateLanguageStats>,
    isLoading : boolean;

}



export default function TechnologyDistributionArticle({ languages, isLoading }: TechnologyDistributionProps){

    return(
    <article className={`${surfaceClass} p-7 md:p-8`}>
        <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
        <div className="mt-8 space-y-6">
            {languages.map((language) => (
                <div key={language.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{language.name}</span>
                        <span className="text-gray-400">{language.percent}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className={`h-full rounded-full ${language.color}`} style={{ width: `${language.percent}%` }} />
                    </div>
                </div>
            ))}
            {!isLoading && languages.length === 0 && <EmptyState text="No language data available" />}
        </div>
    </article>
    )
}