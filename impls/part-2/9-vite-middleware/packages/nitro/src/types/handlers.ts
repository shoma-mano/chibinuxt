import type { EventHandler } from 'h3'

export interface NitroDevEventHandler {
  /**
   * Path prefix or route
   */
  route?: string

  /**
   * Event handler
   *
   */
  handler: EventHandler
}
