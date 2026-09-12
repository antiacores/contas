export interface Bank {
  id: string
  name: string
  initials: string
  color: string
  domain: string | null // dominio del banco, usado para pedir su logo a Clearbit
}

// Catálogo de bancos comunes en México. `domain` se usa para pedir el logo real
// a logo.clearbit.com (servicio público y gratuito de logos por dominio) —
// `initials`/`color` quedan como respaldo si el logo no carga.
export const BANKS: Bank[] = [
  { id: 'bbva', name: 'BBVA', initials: 'BB', color: '#1464A5', domain: 'bbva.mx' },
  { id: 'santander', name: 'Santander', initials: 'SA', color: '#EC0000', domain: 'santander.com.mx' },
  { id: 'banorte', name: 'Banorte', initials: 'BN', color: '#E4002B', domain: 'banorte.com' },
  { id: 'citibanamex', name: 'Citibanamex', initials: 'CB', color: '#003D7A', domain: 'citibanamex.com' },
  { id: 'hsbc', name: 'HSBC', initials: 'HS', color: '#DB0011', domain: 'hsbc.com.mx' },
  { id: 'scotiabank', name: 'Scotiabank', initials: 'SC', color: '#EC111A', domain: 'scotiabank.com.mx' },
  { id: 'inbursa', name: 'Inbursa', initials: 'IN', color: '#8A9AA5', domain: 'inbursa.com' },
  { id: 'azteca', name: 'Banco Azteca', initials: 'AZ', color: '#2E9E3E', domain: 'bancoazteca.com.mx' },
  { id: 'nu', name: 'Nu', initials: 'NU', color: '#820AD1', domain: 'nu.com.mx' },
  { id: 'klar', name: 'Klar', initials: 'KL', color: '#0F0F0F', domain: 'klar.mx' },
  { id: 'falabella', name: 'Falabella', initials: 'FL', color: '#6DBE45', domain: 'falabella.com' },
  { id: 'otro', name: 'Otro', initials: '—', color: '#A89D8D', domain: null },
]

export function getBankById(id: string | null): Bank | undefined {
  return BANKS.find((bank) => bank.id === id)
}