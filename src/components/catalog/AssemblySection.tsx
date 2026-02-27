import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Package, FileDown, Mail, Phone } from 'lucide-react';
import type { AssemblyData } from '@/types/catalog';

interface AssemblySectionProps {
  data: AssemblyData;
}

const AssemblySection = ({ data }: AssemblySectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="assembly"
      className="section-padding bg-primary"
      aria-labelledby="assembly-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-on-dark-muted font-display font-semibold text-sm uppercase tracking-[0.2em] mb-4">
            {data.sectionLabel}
          </p>
          <h2
            id="assembly-title"
            className="font-display font-bold text-primary-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {data.title}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {data.steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-primary-foreground/5 backdrop-blur-md p-8 hover:bg-primary-foreground/10 transition-colors rounded-none"
            >
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-display font-bold text-sm mb-3">
                {s.step}
              </div>
              <h3 className="font-display font-semibold text-primary-foreground mb-1">
                {s.title}
              </h3>
              <p className="text-on-dark-muted text-sm leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="bg-transparent p-6 lg:p-8 mb-12 rounded-none"
        >
          <h3 className="font-display font-semibold text-primary-foreground mb-4 flex items-center gap-2">
            <Package size={20} className="text-primary-foreground" />
            Product Codes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b-2 border-primary-foreground/20">
                  <th className="text-left py-2 pr-4 text-on-dark-muted font-medium">
                    Code
                  </th>
                  <th className="text-left py-2 text-on-dark-muted font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.orderCodes.map((o) => (
                  <tr
                    key={o.code}
                    className="border-b border-primary-foreground/10 hover:bg-primary-foreground/5 transition-colors"
                  >
                    <td className="py-3 pr-4 text-on-dark font-mono text-xs font-medium">
                      {o.code}
                    </td>
                    <td className="py-3 text-on-dark-muted">{o.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-10 py-5 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform min-h-[44px]">
            <Mail size={18} />
            {data.ctaLabels.quote}
          </button>
          <button className="inline-flex items-center gap-3 bg-transparent text-primary-foreground px-10 py-5 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:bg-primary-foreground/10 transition-colors min-h-[44px]">
            <FileDown size={18} />
            {data.ctaLabels.pdf}
          </button>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-on-dark-subtle text-sm font-body">
            {data.footerText}
          </p>
          <p className="text-on-dark-subtle text-xs mt-2 font-body">
            {data.versionInfo}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AssemblySection;
