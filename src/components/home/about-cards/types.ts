/* Shared types for the About-Us card carousel. */

/** The six icon keys the cards may use (kept in sync with ICONS in AboutCardItem). */
export type AboutIcon = 'badge' | 'timer' | 'layers' | 'boxes' | 'truck' | 'route'

export interface AboutCardData {
  icon: AboutIcon
  title: string
  body: string
}
