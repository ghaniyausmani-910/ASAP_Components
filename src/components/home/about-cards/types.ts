/* Shared types for the About-Us card carousel. */

/** The six icon keys the cards may use (kept in sync with ICONS in AboutCardItem). */
export type AboutIcon = 'badge' | 'timer' | 'layers' | 'boxes' | 'truck' | 'route'

export interface AboutCardData {
  icon: AboutIcon
  title: string
  body: string
  /** Optional background photo (path under /public). When set, the card renders
   *  the image behind a navy scrim with the icon + copy layered on top. */
  image?: string
  /** Alt text for the background photo. Decorative if omitted. */
  imageAlt?: string
}
