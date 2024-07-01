import { type ComponentProps, type PropsWithoutRef, forwardRef } from 'react'

const TextDecreaseIcon = forwardRef<PropsWithoutRef<SVGSVGElement>, ComponentProps<'svg'>>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 -960 960 960"
      aria-hidden="true"
      data-slot="icon"
      ref={ref}
      {...props}
    >
      <path d="M637.69-450q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37 8.62-8.62 21.37-8.62h240q12.75 0 21.38 8.63 8.62 8.63 8.62 21.38 0 12.76-8.62 21.37-8.63 8.62-21.38 8.62h-240Zm-460.31 95.85-46.77 122.84q-3.84 10.16-11.76 15.73-7.93 5.58-18.43 5.58-17.27 0-27.11-14.31-9.85-14.31-3.77-30.54l186-474.38q3.46-9.38 11.7-15.08 8.23-5.69 17.84-5.69h25.14q10.47 0 18.32 5.69 7.84 5.7 11.3 15.08l186.24 473.85q6.07 16.61-4.02 30.99Q511.97-210 494.77-210q-10.46 0-19.44-5.95-8.97-5.95-12.71-16.36l-46.16-121.84H177.38Zm21.7-59.85h195.69l-95.2-252h-4.65l-95.84 252Z" />
    </svg>
  )
})

export default TextDecreaseIcon
