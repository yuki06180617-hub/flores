'use client';

type Props = {
  height?: number;
  color?: string;
  mostrarTagline?: boolean;
};

export default function LogoRosas({ height = 44, color = '#DC2626', mostrarTagline = true }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Simbolo SVG: rosa estilizada dentro de circulo, minimalista tipo boutique */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Circulo externo fino (contorno de selo) */}
        <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4" />
        <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="0.6" fill="none" opacity="0.3" />

        {/* Rosa estilizada (linhas curvas concentricas simulando petalas) */}
        <g transform="translate(32 34)">
          {/* Petala externa esquerda */}
          <path
            d="M -14 -2 C -14 -12, -6 -18, 0 -14 C -4 -10, -8 -6, -14 -2 Z"
            fill={color}
            opacity="0.85"
          />
          {/* Petala externa direita */}
          <path
            d="M 14 -2 C 14 -12, 6 -18, 0 -14 C 4 -10, 8 -6, 14 -2 Z"
            fill={color}
            opacity="0.85"
          />
          {/* Petala inferior esquerda */}
          <path
            d="M -12 6 C -14 -4, -6 -10, 0 -4 C -4 0, -8 4, -12 6 Z"
            fill={color}
            opacity="0.95"
          />
          {/* Petala inferior direita */}
          <path
            d="M 12 6 C 14 -4, 6 -10, 0 -4 C 4 0, 8 4, 12 6 Z"
            fill={color}
            opacity="0.95"
          />
          {/* Centro da rosa */}
          <path
            d="M 0 -8 C 5 -8, 8 -3, 6 2 C 8 -1, 5 4, 0 4 C -5 4, -8 -1, -6 2 C -8 -3, -5 -8, 0 -8 Z"
            fill={color}
          />
          <circle cx="0" cy="-2" r="2.5" fill={color} />

          {/* Folha inferior (verde botanico sutil) */}
          <path
            d="M -8 8 C -4 12, 0 12, 4 10 C 2 14, -2 15, -6 13 Z"
            fill="#4A5D23"
            opacity="0.7"
          />
        </g>
      </svg>

      {/* Textos */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{
          fontFamily: "'Great Vibes', 'Allura', cursive",
          fontSize: Math.round(height * 0.72),
          fontWeight: 400,
          color: '#1a0f0f',
          letterSpacing: '0.005em',
          lineHeight: 0.95
        }}>
          Rosa Maria
        </div>
        {mostrarTagline && (
          <div style={{
            fontSize: Math.round(height * 0.17),
            color: color,
            textTransform: 'uppercase',
            letterSpacing: '0.32em',
            fontWeight: 500,
            marginTop: 2,
            fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
            fontStyle: 'normal'
          }}>
            · Atelier Botânico e Floricultura ·
          </div>
        )}
      </div>
    </div>
  );
}
