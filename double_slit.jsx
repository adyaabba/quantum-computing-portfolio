import { useState } from "react";

export default function DoubleSlit() {
  const [pointY, setPointY] = useState(120);
  const [showWaves, setShowWaves] = useState(true);
  const [showTriangle, setShowTriangle] = useState(true);

  // Layout constants
  const W = 700, H = 500;
  const slitX = 160;
  const screenX = 580;
  const D = screenX - slitX;
  const midY = H / 2;
  const d = 100; // slit separation in px
  const s1y = midY - d / 2; // top slit
  const s2y = midY + d / 2; // bottom slit

  // Point P on screen
  const pY = midY - pointY + 120;
  const clampedPY = Math.max(midY - 180, Math.min(midY + 180, pY));

  // Distances from each slit to P
  const dist1 = Math.sqrt(D * D + (clampedPY - s1y) ** 2);
  const dist2 = Math.sqrt(D * D + (clampedPY - s2y) ** 2);
  const pathDiff = Math.abs(dist2 - dist1);

  // Angle theta from normal
  const theta = Math.atan2(Math.abs(clampedPY - midY), D);
  const thetaDeg = (theta * 180 / Math.PI).toFixed(1);

  // For the mini triangle: drop perpendicular from S1 onto ray S2->P
  // Direction of ray from S2 to P
  const rayDx = screenX - slitX;
  const rayDy = clampedPY - s2y;
  const rayLen = Math.sqrt(rayDx * rayDx + rayDy * rayDy);
  const rayUx = rayDx / rayLen;
  const rayUy = rayDy / rayLen;

  // Vector from S2 to S1
  const s2s1x = 0;
  const s2s1y = s1y - s2y; // negative (upward)

  // Project S2->S1 onto ray direction to find Q
  const proj = s2s1x * rayUx + s2s1y * rayUy;
  const qx = slitX + proj * rayUx;
  const qy = s2y + proj * rayUy;

  // Wave visualization
  const lambda = 30; // wavelength in px
  const nWaves1 = Math.floor(dist1 / lambda);
  const nWaves2 = Math.floor(dist2 / lambda);

  // Check if near constructive interference
  const nLambda = pathDiff / lambda;
  const nearInteger = Math.abs(nLambda - Math.round(nLambda)) < 0.15;
  const orderN = Math.round(nLambda);

  // Generate wave dots along each path
  const waveDots = (sx, sy, count, dist) => {
    const dots = [];
    const dx = screenX - sx;
    const dy = clampedPY - sy;
    for (let i = 0; i <= count; i++) {
      const frac = (i * lambda) / dist;
      if (frac > 1) break;
      dots.push({
        x: sx + dx * frac,
        y: sy + dy * frac,
      });
    }
    return dots;
  };

  const dots1 = waveDots(slitX, s1y, nWaves1, dist1);
  const dots2 = waveDots(slitX, s2y, nWaves2, dist2);

  return (
    <div style={{ background: "#0a0a1a", minHeight: "100vh", padding: "20px", color: "#e0e0e0", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#88bbff", marginBottom: 4, fontSize: 20 }}>
        Double Slit Geometry
      </h2>
      <p style={{ textAlign: "center", color: "#888", fontSize: 13, marginTop: 0 }}>
        Drag point P up/down on the screen
      </p>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", margin: "0 auto", background: "#0d0d24", borderRadius: 8 }}>
        {/* Barrier with slits */}
        <line x1={slitX} y1={0} x2={slitX} y2={s1y - 8} stroke="#556" strokeWidth={3} />
        <line x1={slitX} y1={s1y + 8} x2={slitX} y2={s2y - 8} stroke="#556" strokeWidth={3} />
        <line x1={slitX} y1={s2y + 8} x2={slitX} y2={H} stroke="#556" strokeWidth={3} />

        {/* Slit openings */}
        <line x1={slitX} y1={s1y - 8} x2={slitX} y2={s1y + 8} stroke="#ffdd44" strokeWidth={3} />
        <line x1={slitX} y1={s2y - 8} x2={slitX} y2={s2y + 8} stroke="#ffdd44" strokeWidth={3} />

        {/* Screen */}
        <line x1={screenX} y1={40} x2={screenX} y2={H - 40} stroke="#667" strokeWidth={2} />

        {/* Normal (horizontal dashed line from midpoint) */}
        <line x1={slitX} y1={midY} x2={screenX} y2={midY} stroke="#445" strokeWidth={1} strokeDasharray="6,4" />
        <text x={slitX + D / 2} y={midY - 8} fill="#556" fontSize={11} textAnchor="middle">normal (D)</text>

        {/* d label */}
        <line x1={slitX - 30} y1={s1y} x2={slitX - 30} y2={s2y} stroke="#88aaff" strokeWidth={1} />
        <line x1={slitX - 35} y1={s1y} x2={slitX - 25} y2={s1y} stroke="#88aaff" strokeWidth={1} />
        <line x1={slitX - 35} y1={s2y} x2={slitX - 25} y2={s2y} stroke="#88aaff" strokeWidth={1} />
        <text x={slitX - 42} y={midY + 4} fill="#88aaff" fontSize={13} textAnchor="middle" fontWeight="bold">d</text>

        {/* Rays from slits to P */}
        <line x1={slitX} y1={s1y} x2={screenX} y2={clampedPY} stroke="#66ddaa" strokeWidth={1.5} opacity={0.7} />
        <line x1={slitX} y1={s2y} x2={screenX} y2={clampedPY} stroke="#ff8866" strokeWidth={1.5} opacity={0.7} />

        {/* Wave crests along paths */}
        {showWaves && dots1.map((dot, i) => (
          <circle key={`w1-${i}`} cx={dot.x} cy={dot.y} r={3} fill="#66ddaa" opacity={0.8} />
        ))}
        {showWaves && dots2.map((dot, i) => (
          <circle key={`w2-${i}`} cx={dot.x} cy={dot.y} r={3} fill="#ff8866" opacity={0.8} />
        ))}

        {/* MINI TRIANGLE */}
        {showTriangle && (
          <g>
            {/* Side: S1 to S2 (hypotenuse = d) */}
            <line x1={slitX} y1={s1y} x2={slitX} y2={s2y} stroke="#ffdd44" strokeWidth={2.5} />

            {/* Side: S2 to Q (along ray, this is projection) */}
            <line x1={slitX} y1={s2y} x2={qx} y2={qy} stroke="#aaa" strokeWidth={1.5} strokeDasharray="4,3" />

            {/* Side: S1 to Q (perpendicular drop = path diff) */}
            <line x1={slitX} y1={s1y} x2={qx} y2={qy} stroke="#ff4488" strokeWidth={2.5} />

            {/* Right angle marker at Q */}
            {(() => {
              const size = 8;
              const toS1x = (slitX - qx), toS1y = (s1y - qy);
              const toS1len = Math.sqrt(toS1x * toS1x + toS1y * toS1y) || 1;
              const toS2x = (slitX - qx), toS2y = (s2y - qy);
              const toRayX = -rayUx, toRayY = -rayUy;
              const n1x = toS1x / toS1len * size, n1y = toS1y / toS1len * size;
              const n2x = toRayX * size, n2y = toRayY * size;
              return (
                <polyline
                  points={`${qx + n1x},${qy + n1y} ${qx + n1x + n2x},${qy + n1y + n2y} ${qx + n2x},${qy + n2y}`}
                  fill="none" stroke="#fff" strokeWidth={1.5}
                />
              );
            })()}

            {/* Label Q */}
            <text x={qx - 14} y={qy - 6} fill="#fff" fontSize={12} fontWeight="bold">Q</text>

            {/* Label: path difference */}
            <text
              x={(slitX + qx) / 2 - 18}
              y={(s1y + qy) / 2}
              fill="#ff4488"
              fontSize={11}
              fontWeight="bold"
              textAnchor="end"
            >
              path diff
            </text>

            {/* Label: d = hypotenuse */}
            <text x={slitX + 6} y={midY} fill="#ffdd44" fontSize={12} fontWeight="bold">
              d (hyp)
            </text>

            {/* Theta arc at S2 */}
            {theta > 0.02 && (() => {
              // Angle of ray from S2 to P relative to horizontal
              const arcR = 28;
              const startAngle = -Math.PI / 2; // straight up along slit line (toward S1) → but we want from normal
              // Normal direction is horizontal (to the right)
              const normalAngle = 0;
              const rayAngle = Math.atan2(clampedPY - s2y, screenX - slitX);
              // θ is angle between ray and normal (horizontal)
              const a1 = Math.min(normalAngle, rayAngle);
              const a2 = Math.max(normalAngle, rayAngle);
              const path = `M ${slitX + arcR * Math.cos(a1)} ${s2y + arcR * Math.sin(a1)} A ${arcR} ${arcR} 0 0 1 ${slitX + arcR * Math.cos(a2)} ${s2y + arcR * Math.sin(a2)}`;
              return (
                <g>
                  <path d={path} fill="none" stroke="#ffaa00" strokeWidth={1.5} />
                  <text x={slitX + arcR + 6} y={s2y + (clampedPY > midY ? 14 : -4)} fill="#ffaa00" fontSize={12} fontWeight="bold">θ</text>
                </g>
              );
            })()}
          </g>
        )}

        {/* Slit labels */}
        <text x={slitX + 8} y={s1y - 10} fill="#66ddaa" fontSize={12}>S₁</text>
        <text x={slitX + 8} y={s2y + 18} fill="#ff8866" fontSize={12}>S₂</text>

        {/* Point P (draggable) */}
        <circle
          cx={screenX}
          cy={clampedPY}
          r={8}
          fill={nearInteger ? "#44ff88" : "#fff"}
          stroke={nearInteger ? "#44ff88" : "#aaa"}
          strokeWidth={2}
          style={{ cursor: "ns-resize" }}
          onMouseDown={(e) => {
            const svg = e.currentTarget.closest("svg");
            const move = (ev) => {
              const rect = svg.getBoundingClientRect();
              const y = ev.clientY - rect.top;
              setPointY(120 - (y - midY));
            };
            const up = () => {
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
        />
        <text x={screenX + 14} y={clampedPY + 5} fill={nearInteger ? "#44ff88" : "#ccc"} fontSize={13} fontWeight="bold">P</text>

        {/* Info box */}
        <rect x={10} y={H - 120} width={200} height={110} rx={6} fill="#161630" stroke="#334" strokeWidth={1} />
        <text x={20} y={H - 98} fill="#aaa" fontSize={12}>θ = {thetaDeg}°</text>
        <text x={20} y={H - 80} fill="#66ddaa" fontSize={12}>path₁ = {dist1.toFixed(1)} px</text>
        <text x={20} y={H - 62} fill="#ff8866" fontSize={12}>path₂ = {dist2.toFixed(1)} px</text>
        <text x={20} y={H - 44} fill="#ff4488" fontSize={12}>Δpath = {pathDiff.toFixed(1)} px</text>
        <text x={20} y={H - 24} fill={nearInteger ? "#44ff88" : "#888"} fontSize={12} fontWeight="bold">
          Δpath / λ = {nLambda.toFixed(2)} {nearInteger ? ` ≈ ${orderN} → bright fringe!` : ""}
        </text>
      </svg>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12 }}>
        <label style={{ fontSize: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={showWaves} onChange={() => setShowWaves(!showWaves)} /> Show wave crests
        </label>
        <label style={{ fontSize: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={showTriangle} onChange={() => setShowTriangle(!showTriangle)} /> Show mini triangle
        </label>
      </div>

      <div style={{ maxWidth: 620, margin: "16px auto 0", fontSize: 13, lineHeight: 1.6, color: "#aab" }}>
        <p style={{ margin: "8px 0" }}>
          <strong style={{ color: "#ff4488" }}>Point 1 — where nλ comes from:</strong> Watch the <strong>Δpath / λ</strong> ratio at bottom-left as you drag P.
          The path difference is just geometry — it can be anything. When it <em>happens</em> to hit an integer multiple of λ, P turns
          <span style={{ color: "#44ff88" }}> green</span> → that's where you <em>impose</em> the condition: path diff = nλ.
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong style={{ color: "#ffdd44" }}>Point 2 — why d is the hypotenuse:</strong> The right angle is at <strong>Q</strong>, not at a slit.
          Q is where we drop a perpendicular from S₁ onto the ray S₂→P. So the triangle is S₁–Q–S₂ with
          <span style={{ color: "#ffdd44" }}> d opposite the right angle</span>, making path diff = d sin θ, not d cos θ.
        </p>
      </div>
    </div>
  );
}
