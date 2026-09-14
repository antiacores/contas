export interface SubscriptionService {
  name: string
  domain: string
  color: string
}

// Catálogo de servicios comunes. `domain` se usa para pedir el logo real a
// logo.dev; `color` es solo el respaldo si el logo no carga. El nombre elegido
// aquí SE GUARDA TAL CUAL en `subscriptions.name` — así, al mostrar la
// suscripción después, comparamos el nombre guardado contra este catálogo
// para saber si hay un logo real disponible.
export const SUBSCRIPTION_SERVICES: SubscriptionService[] = [
  { name: 'Netflix', domain: 'netflix.com', color: '#E50914' },
  { name: 'Spotify', domain: 'spotify.com', color: '#1DB954' },
  { name: 'Disney+', domain: 'disneyplus.com', color: '#113CCF' },
  { name: 'HBO Max', domain: 'max.com', color: '#002BE7' },
  { name: 'Amazon Prime Video', domain: 'primevideo.com', color: '#00A8E1' },
  { name: 'Apple TV+', domain: 'tv.apple.com', color: '#000000' },
  { name: 'Apple Music', domain: 'music.apple.com', color: '#FA243C' },
  { name: 'iCloud', domain: 'icloud.com', color: '#3693F3' },
  { name: 'YouTube Premium', domain: 'youtube.com', color: '#FF0000' },
  { name: 'Paramount+', domain: 'paramountplus.com', color: '#0064FF' },
  { name: 'Crunchyroll', domain: 'crunchyroll.com', color: '#F47521' },
  { name: 'Google One', domain: 'one.google.com', color: '#4285F4' },
  { name: 'Canva', domain: 'canva.com', color: '#00C4CC' },
  { name: 'Adobe Creative Cloud', domain: 'adobe.com', color: '#FA0F00' },
  { name: 'PlayStation Plus', domain: 'playstation.com', color: '#003791' },
  { name: 'Xbox Game Pass', domain: 'xbox.com', color: '#107C10' },
  { name: 'Anytime Fitness', domain: 'anytimefitness.com', color: '#D2262C' },
  { name: 'Smart Fit', domain: 'smartfit.com.mx', color: '#CFFF04' },
  { name: 'Claude', domain: 'claude.ai', color: '#D97757' },
]

export function findServiceByName(name: string): SubscriptionService | undefined {
  return SUBSCRIPTION_SERVICES.find((s) => s.name.toLowerCase() === name.trim().toLowerCase())
}