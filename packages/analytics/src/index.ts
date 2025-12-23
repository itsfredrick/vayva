/**
 * Vayva Analytics Package
 * 
 * Privacy-first operational signal tracking for measuring real business usage.
 */

// Event definitions
export { EventCategory, EventName, EventPayloads } from './events';

// Tracker
export { analytics, trackEvent } from './tracker';

// Activation system
export { ActivationManager, TemplateActivationTracker } from './activation';
export type { ActivationStatus, TemplateActivationSignals } from './activation';
