import { AnimatePresence, motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'

import s from './uix.module.scss'

export default function Spinner() {
  return (
    <AnimatePresence>
      <motion.div
        // className="spinContainer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <div className={s.spinContainer}>
          <RotateCw className={s.spinIcon} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
