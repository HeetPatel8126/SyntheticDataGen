'use client';
import { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";

export const TextGenerateEffect = ({
  words,
  className = "",
  delay = 0,
}: {
  words: string;
  className?: string;
  delay?: number;
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, margin: "-50px" });
  let wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          opacity: 1,
        },
        {
          duration: 1,
          delay: stagger(0.02, { startDelay: delay }),
        }
      );
    }
  }, [isInView, animate, delay]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="opacity-0 inline-block"
            >
              {word}&nbsp;
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={className}>
      {renderWords()}
    </div>
  );
};
