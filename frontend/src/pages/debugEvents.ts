// Debug utility for FullCalendar events
export function debugEvents(events) {
  if (!Array.isArray(events)) {
    console.warn('Events is not an array:', events);
    return;
  }
  events.forEach((event, idx) => {
    console.log(`Event #${idx}:`, event);
  });
}
