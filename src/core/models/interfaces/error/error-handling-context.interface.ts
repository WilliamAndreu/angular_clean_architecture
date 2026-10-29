export interface ErrorHandlingContext {
  source: 'operation' | 'global' | 'bootstrap';
  /** Static operation identifier; never user data or URLs. */
  operation?: string;
}
