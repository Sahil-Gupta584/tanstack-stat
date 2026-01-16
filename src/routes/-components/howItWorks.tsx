import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

function StepCard({
  desc,
  imgFileName,
  title,
  step,
}: {
  title: string;
  desc: string;
  imgFileName: string;
  step: number;
}) {
  const MotionCard = motion.create(Card);

  return (
    <MotionCard
      className="apple-card p-0 overflow-hidden border-none bg-white dark:bg-[#1c1c1e]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
    >
      <CardBody className="p-0">
        <div className="aspect-[4/3] bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center overflow-hidden">
          <motion.img
            className="w-full h-full object-cover"
            src={`/images/landing/${imgFileName}`}
            alt={title}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] text-white text-sm font-semibold">
              {step}
            </span>
            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              {title}
            </h3>
          </div>
          <p className="text-[#6e6e73] dark:text-[#8e8e93] text-sm leading-relaxed pl-10">
            {desc}
          </p>
        </div>
      </CardBody>
    </MotionCard>
  );
}

export default function HowItWorks() {
  return (
    <article insightly-scroll="landing-how-it-works" className="space-y-12">
      <div className="text-center space-y-4">
        <motion.span
          className="inline-block text-sm font-semibold text-[#0071e3] dark:text-[#0a84ff] tracking-wide uppercase"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How it works
        </motion.span>
        <motion.h2
          className="text-[#1d1d1f] dark:text-[#f5f5f7]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Three steps to insights
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StepCard
          step={1}
          title="Add the script"
          desc="Copy a single line of code to your site. It loads in milliseconds and respects privacy."
          imgFileName="scriptimage.png"
        />

        <StepCard
          step={2}
          title="Connect revenue"
          desc="Link Stripe, Polar, or DodoPayments to see exactly which channels drive sales."
          imgFileName="paymentProviders.webp"
        />

        <StepCard
          step={3}
          title="Grow smarter"
          desc="Make data-driven decisions with real-time analytics and actionable insights."
          imgFileName="dashboard.webp"
        />
      </div>
    </article>
  );
}
