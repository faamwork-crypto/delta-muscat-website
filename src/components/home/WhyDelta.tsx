import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";

export default function WhyDelta({ dict }: { dict: Dictionary }) {
  const w = dict.home.why;
  return (
    <section className="section-pad bg-graphite text-paper">
      <div className="container-site">
        <SectionHeading eyebrow={w.eyebrow} title={w.title} lead={w.lead} tone="dark" />

        {/* Pillars — editorial index rows */}
        <div className="mt-14 border-t border-line-light">
          {w.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 70}>
              <div className="group grid gap-2 border-b border-line-light py-7 transition-colors duration-300 hover:bg-graphite-soft sm:grid-cols-[6rem_1fr_1.6fr] sm:gap-8 sm:py-8">
                <span className="font-display text-[15px] text-bronze-soft/80">
                  0{i + 1}
                </span>
                <h3 className="display-3 text-paper transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  {pillar.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-steel-light">{pillar.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Comparison table */}
        <Reveal delay={100}>
          <div className="mt-16">
            <h3 className="text-[11px] font-semibold tracking-[0.24em] text-bronze-soft uppercase">
              {w.comparison.title}
            </h3>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-start text-[14px]">
                <thead>
                  <tr className="border-b border-line-light">
                    <th scope="col" className="py-4 pe-4 text-start font-medium text-steel" />
                    {w.comparison.columns.map((col, i) => (
                      <th
                        key={col}
                        scope="col"
                        className={`py-4 px-4 text-start font-semibold ${
                          i === 2 ? "text-bronze-soft" : "text-steel-light"
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {w.comparison.rows.map((row) => (
                    <tr key={row.label} className="border-b border-line-light/60">
                      <th
                        scope="row"
                        className="py-4 pe-4 text-start text-[12px] font-semibold tracking-[0.14em] text-steel uppercase"
                      >
                        {row.label}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={value}
                          className={`px-4 py-4 ${i === 2 ? "bg-graphite-soft font-medium text-paper" : "text-steel-light"}`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
