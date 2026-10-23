import type { ReactNode, SVGProps } from 'react'

/* 24 栅格 / 1.5px 描边的统一线性图标；filled 用于点赞收藏等激活态 */
const icons = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 5 5" />
    </>
  ),
  compose: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-5 6.5-5s6.5 1.7 6.5 5" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M17.5 15.4c2.3.5 4 2 4 4.6" />
    </>
  ),
  book: (
    <>
      <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2V4Z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7V4Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  star: (
    <path d="m12 2.5 2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5Z" />
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  close: <path d="M18 6 6 18M6 6l12 12" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
  arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  send: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </>
  ),
  stop: <rect x="6" y="6" width="12" height="12" rx="1.5" />,
  check: <path d="M20 6 9 17l-5-5" />,
  copy: (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  pin: (
    <>
      <path d="M9 4h6l-1 7 3 3v2H7v-2l3-3-1-7Z" />
      <path d="M12 16v5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  userPlus: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-5 6.5-5s6.5 1.7 6.5 5" />
      <path d="M19 5v6M16 8h6" />
    </>
  ),
  userCheck: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-5 6.5-5s6.5 1.7 6.5 5" />
      <path d="m16 11 2 2 4-4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m19 15 .9 2.1 2.1.9-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.9L19 15Z" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m17 8-5-5-5 5M12 3v12" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 4v6h-6" />
      <path d="M20.5 15a9 9 0 1 1-2-9.4L21 10" />
    </>
  ),
  external: (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M21 3 10 14" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14.5 14.5 0 0 1 3.8 9A14.5 14.5 0 0 1 12 21a14.5 14.5 0 0 1-3.8-9A14.5 14.5 0 0 1 12 3Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  tag: (
    <>
      <path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  message: (
    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4.5" />
      <path d="m11.2 11.8 8.3-8.3M17 5l2.5 2.5M14.5 7.5 17 10" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof icons

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
  filled?: boolean
}

export function Icon({ name, size = 18, filled = false, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {icons[name]}
    </svg>
  )
}
