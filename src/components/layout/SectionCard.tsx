import type { PropsWithChildren } from "react";

interface SectionCardProps extends PropsWithChildren {
    title: string;
}

export function SectionCard({ title, children }: SectionCardProps) {
    return (
        <section className="section-card">
            <div className="section-card__header">
                <h2>{title}</h2>
            </div>

            <div className="section-card__body">{children}</div>
        </section>
    );
}