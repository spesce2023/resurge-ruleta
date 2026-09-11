"use client";

import {
  CASILLEROS,
  COLOR_MAYOR,
  COLOR_NORMAL,
  COLOR_VACIO,
  ICONO_VACIO,
  ICONOS_PREMIOS_MAYORES,
  ICONOS_PREMIOS_NORMALES,
  SLICE_ANGLE,
} from "@/lib/ruleta/constants";
import type { CasilleroCategoria, EstadoPremioMayor, PremioMayorId } from "@/lib/ruleta/types";

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function colorDeCasillero(categoria: CasilleroCategoria) {
  if (categoria.tipo === "mayor") return COLOR_MAYOR;
  if (categoria.tipo === "normal") return COLOR_NORMAL;
  return COLOR_VACIO;
}

function iconoDeCasillero(categoria: CasilleroCategoria) {
  if (categoria.tipo === "mayor") return ICONOS_PREMIOS_MAYORES[categoria.premioId];
  if (categoria.tipo === "normal") return ICONOS_PREMIOS_NORMALES[categoria.premioId];
  return ICONO_VACIO;
}

const CX = 250;
const CY = 250;
const R = 240;
const ICON_RADIUS = 175;

export function Wheel({
  rotation,
  spinning,
  estadoPremiosMayores,
}: {
  rotation: number;
  spinning: boolean;
  estadoPremiosMayores?: Record<PremioMayorId, EstadoPremioMayor>;
}) {
  return (
    <svg
      viewBox="0 0 500 500"
      className="block h-full w-full"
      role="img"
      aria-label="Ruleta de premios"
    >
      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "250px 250px",
          transition: spinning
            ? "transform 4.2s cubic-bezier(0.12, 0.72, 0.1, 1)"
            : undefined,
        }}
      >
        {CASILLEROS.map((casillero) => {
          const start = casillero.index * SLICE_ANGLE;
          const end = start + SLICE_ANGLE;
          const centerAngle = start + SLICE_ANGLE / 2;
          const p1 = polarPoint(CX, CY, R, start);
          const p2 = polarPoint(CX, CY, R, end);
          const path = `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 0 1 ${p2.x} ${p2.y} Z`;
          const iconPos = polarPoint(CX, CY, ICON_RADIUS, centerAngle);
          const agotado =
            casillero.categoria.tipo === "mayor" &&
            estadoPremiosMayores?.[casillero.categoria.premioId] !== "disponible";
          return (
            <g key={casillero.index} opacity={agotado ? 0.35 : 1}>
              <path d={path} fill={colorDeCasillero(casillero.categoria)} stroke="#F7F0E4" strokeWidth={2} />
              <text
                x={iconPos.x}
                y={iconPos.y}
                fontSize={26}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {iconoDeCasillero(casillero.categoria)}
              </text>
            </g>
          );
        })}
        <circle cx={CX} cy={CY} r={26} fill="#F7F0E4" />
      </g>
    </svg>
  );
}
