export function trackPageview() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  fetch('https://45.77.233.102/api/trutina/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: window.location.pathname,
      referrer: document.referrer,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      session_id: getSessionId(),
    }),
  }).catch(() => {})
}

function getSessionId(): string {
  let id = sessionStorage.getItem('trutina_sid')
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('trutina_sid', id) }
  return id
}
