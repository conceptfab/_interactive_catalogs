import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Package, FileDown, Mail } from 'lucide-react';
import type { AssemblyData } from '@/types/catalog';
import { renderQxText } from './renderQxText';

interface AssemblySectionProps {
  data: AssemblyData;
}

interface AssemblySectionProps {
  data: AssemblyData;
}

const AssemblySection = ({ data }: AssemblySectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="assembly"
      className="section-padding relative overflow-hidden"
      aria-labelledby="assembly-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.4em] mb-4">
            {renderQxText(data.sectionLabel)}
          </p>
          <h2
            id="assembly-title"
            className="font-display font-bold text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}
          >
            {renderQxText(data.title)}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {data.steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`step-card ${i % 2 === 1 ? 'lg:translate-y-12' : ''}`}
            >

              <div className="flex items-start gap-6 group">
                <div className="step-number font-display font-medium text-foreground/20 text-6xl leading-none transition-colors group-hover:text-accent/40 shrink-0">
                  {s.step}
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="font-display font-bold text-xl text-foreground mb-3 tracking-tight">
                    {renderQxText(s.title)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-body">
                    {renderQxText(s.desc)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="assembly-codes-panel bg-white/40 backdrop-blur-md border border-border/50 p-8 lg:p-12 mb-16 rounded-2xl shadow-xl shadow-foreground/5"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3">
              <h3 className="font-display font-bold text-2xl text-foreground mb-4 flex items-center gap-3">
                <Package size={28} className="text-accent" />
                Product Codes
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Use these unique codes when placing your order or specifying modules for your workspace.
              </p>
            </div>
            <div className="lg:w-2/3 w-full">
              <div className="overflow-hidden">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-4 pr-4 text-foreground font-bold uppercase tracking-wider text-[10px]">
                        Code Reference
                      </th>
                      <th className="text-left py-4 text-foreground font-bold uppercase tracking-wider text-[10px]">
                        Specifications
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {data.orderCodes.map((o) => (
                      <tr
                        key={o.code}
                        className="group transition-colors"
                      >
                        <td className="py-4 pr-4">
                          <span className="font-mono text-xs font-bold px-2 py-1 bg-foreground/5 rounded-md text-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                            {o.code}
                          </span>
                        </td>
                        <td className="py-4 text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                          {o.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button className="btn-premium inline-flex items-center gap-3 bg-accent text-accent-foreground px-12 py-6 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform min-h-[44px]">
            <Mail size={18} />
            {renderQxText(data.ctaLabels.quote)}
          </button>
          <button className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-border text-foreground px-12 py-6 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors min-h-[44px]">
            <FileDown size={18} />
            {renderQxText(data.ctaLabels.pdf)}
          </button>
        </motion.div>

        <div className="mt-24 pt-12 border-t border-border/30 text-center">
          <p className="text-muted-foreground/60 text-sm font-body tracking-tight">
            {renderQxText(data.footerText)}
          </p>
          <p className="text-muted-foreground/40 text-[10px] mt-4 font-body uppercase tracking-widest">
            {renderQxText(data.versionInfo)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AssemblySection;
