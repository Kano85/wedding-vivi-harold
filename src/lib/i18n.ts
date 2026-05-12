export type SiteLanguage = 'en' | 'es';

export const LANGUAGE_STORAGE_KEY = 'wedding_site_language';

export function getLocale(language: SiteLanguage): string {
  return language === 'es' ? 'es-ES' : 'de-DE';
}

export function formatWeddingDate(
  language: SiteLanguage,
  dateParts: { year: number; month: number; day: number; hour: number; minute: number },
): string {
  const date = new Date(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    dateParts.hour,
    dateParts.minute,
  );
  const weekdayIndex = date.getDay();
  const monthIndex = dateParts.month - 1;
  const weekdayNames = language === 'es'
    ? ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
    : ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const monthNames = language === 'es'
    ? ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    : ['Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  if (language === 'es') {
    return `${weekdayNames[weekdayIndex]}, ${dateParts.day} de ${monthNames[monthIndex]} de ${dateParts.year}`;
  }

  return `${weekdayNames[weekdayIndex]}, ${dateParts.day}. ${monthNames[monthIndex]} ${dateParts.year}`;
}

export function formatShortDate(language: SiteLanguage, isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return language === 'es' ? `${day}/${month}/${year}` : `${day}.${month}.${year}`;
}
