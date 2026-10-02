"use client";

import type { GeoJsonObject } from "geojson";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import countriesTopology from "world-atlas/countries-110m.json";
import { Section } from "@/components/ui/Container";
import { facts } from "@/content/facts";
import { SectionHeading } from "@/components/ui/PageHeader";

const countries = countriesTopology as unknown as GeoJsonObject;

// Representative coordinates spread across every inhabited continent,
// illustrating the "60+ countries" reach stated in facts.globalReach.
const markers: [number, number][] = [
  [-74.01, 40.71], [-79.38, 43.65], [-99.13, 19.43], [-118.24, 34.05], [-87.63, 41.88], [-123.12, 49.28],
  [-46.63, -23.55], [-58.38, -34.6], [-74.07, 4.71], [-77.04, -12.05], [-70.67, -33.45],
  [-0.13, 51.51], [2.35, 48.85], [13.4, 52.52], [-3.7, 40.42], [12.5, 41.9], [4.9, 52.37],
  [18.07, 59.33], [21.01, 52.23], [-6.26, 53.35], [-9.14, 38.72], [8.54, 47.38], [16.37, 48.21],
  [10.75, 59.91], [24.94, 60.17], [23.73, 37.98],
  [3.38, 6.52], [31.24, 30.04], [36.82, -1.29], [28.05, -26.2], [-0.19, 5.6], [-7.59, 33.57],
  [55.27, 25.2], [46.68, 24.71], [34.78, 32.08], [51.53, 25.29], [28.98, 41.01],
  [103.82, 1.35], [139.69, 35.68], [126.98, 37.57], [114.17, 22.32], [121.47, 31.23],
  [72.88, 19.08], [77.21, 28.61], [77.59, 12.97], [100.5, 13.76], [106.85, -6.21],
  [120.98, 14.6], [101.69, 3.14], [106.63, 10.82], [105.85, 21.03], [67.0, 24.86], [90.41, 23.81], [79.85, 6.93],
  [151.21, -33.87], [144.96, -37.81], [174.76, -36.85], [153.03, -27.47],
  [37.62, 55.76], [30.52, 50.45],
];

export function GlobalReach() {
  return (
    <Section>
      <SectionHeading eyebrow="Reach" title="Built for a global audience" intro={facts.globalReach.note} />

      <div className="relative mt-10 overflow-hidden rounded-[var(--radius-paper)] border border-rule bg-paper-raised p-4 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,138,92,0.07),transparent_60%)]"
        />
        <ComposableMap
          projectionConfig={{ scale: 148 }}
          role="img"
          aria-label={`A world map highlighting SkilledScan's reach across ${facts.globalReach.countries} countries.`}
          className="relative h-auto w-full"
        >
          <Geographies geography={countries}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1d1e22"
                  stroke="#2c2e33"
                  strokeWidth={0.5}
                  style={{ outline: "none" }}
                />
              ))
            }
          </Geographies>
          {markers.map(([lng, lat], i) => (
            <Marker key={i} coordinates={[lng, lat]}>
              <circle r={2.6} fill="#ff5a1f" opacity={0.95} />
              <circle r={6} fill="#ff5a1f" opacity={0.14} />
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </Section>
  );
}
