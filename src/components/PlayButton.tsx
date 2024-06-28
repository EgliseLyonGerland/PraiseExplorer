import { PlayIcon } from '@heroicons/react/24/outline'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import clsx from 'clsx'
import { isPresentationStarted } from '@/libs/store'

export default function PlayButton() {
  const [reduce, setReduce] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setReduce(latest > 100)
  })

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1 }}
      className="flex justify-end"
    >
      <div className="bg-primary text-primary-content rounded-[4em]">
        <motion.button
          className="flex items-center justify-center btn size-auto btn-ghost p-0 gap-0"
          onClick={() => {
            isPresentationStarted.set(true)
          }}
        >
          <span className="size-[4em] flex items-center justify-center"><PlayIcon className="h-6" /></span>
          <motion.span
            animate={{ width: reduce ? 0 : 'auto' }}
            transition={{ ease: 'circOut', delay: reduce ? 0.6 : 0 }}
            className="overflow-hidden text-lg"
          >
            <span
              className={clsx('whitespace-nowrap pr-[1.5em] transition-opacity delay-300', reduce && 'opacity-0')}
            >
              Présenter
            </span>
          </motion.span>
        </motion.button>
      </div>

    </motion.div>
  )
}
