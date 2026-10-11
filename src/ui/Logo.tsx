/** İlmek İlmek logosu (yumak + şiş + tığ) */
export function Logo({ size = 36 }: { size?: number }) {
  return <img src={`${import.meta.env.BASE_URL}favicon.svg`} width={size} height={size} alt="" style={{ borderRadius: size * 0.22 }} />;
}
