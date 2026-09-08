export interface Bank {
  id: string
  name: string
  initials: string
  color: string
}

// Catálogo de bancos comunes en México. No son los logos oficiales
// (son marca registrada de cada institución) — son badges de iniciales
// con un color aproximado a su identidad, solo para reconocimiento visual rápido.
export const BANKS: Bank[] = [
  { id: 'bbva', name: 'BBVA', initials: 'BB', color: '#1464A5' },
  { id: 'santander', name: 'Santander', initials: 'SA', color: '#EC0000' },
  { id: 'banorte', name: 'Banorte', initials: 'BN', color: '#E4002B' },
  { id: 'citibanamex', name: 'Citibanamex', initials: 'CB', color: '#003D7A' },
  { id: 'hsbc', name: 'HSBC', initials: 'HS', color: '#DB0011' },
  { id: 'scotiabank', name: 'Scotiabank', initials: 'SC', color: '#EC111A' },
  { id: 'inbursa', name: 'Inbursa', initials: 'IN', color: '#8A9AA5' },
  { id: 'azteca', name: 'Banco Azteca', initials: 'AZ', color: '#2E9E3E' },
  { id: 'otro', name: 'Otro', initials: '—', color: '#A89D8D' },
]

export function getBankById(id: string | null): Bank | undefined {
  return BANKS.find((bank) => bank.id === id)
}