'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { Map, Marker, Popup } from 'maplibre-gl';

type Props = {
  lng: number;
  lat: number;
  zoom?: number;
  popupHtml?: string;
  mapId?: string;
};

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException) return error.name === 'AbortError';
  if (error instanceof Error) {
    return (
      error.name === 'AbortError' ||
      error.message.toLowerCase().includes('signal is aborted without reason')
    );
  }

  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { name?: unknown; message?: unknown };
    return (
      maybeError.name === 'AbortError' ||
      (typeof maybeError.message === 'string' &&
        maybeError.message.toLowerCase().includes('signal is aborted without reason'))
    );
  }

  return false;
}

export default function MapTilerLightMap({
  lng,
  lat,
  zoom = 15,
  popupHtml = '<strong>Destination</strong>',
  mapId = 'streets-v2-light',
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    if (!key) {
      console.error('Missing NEXT_PUBLIC_MAPTILER_KEY in .env.local');
      return;
    }

    const styleUrl = `https://api.maptiler.com/maps/${mapId}/style.json?key=${key}`;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [lng, lat],
      zoom,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    const popup = new Popup({ offset: 25 }).setHTML(popupHtml);

    new Marker({ color: '#e11d48' })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    mapRef.current = map;

    return () => {
      const currentMap = mapRef.current;
      if (!currentMap) return;

      const swallowAbortRejection = (event: PromiseRejectionEvent) => {
        if (isAbortError(event.reason)) {
          event.preventDefault();
        }
      };

      window.addEventListener('unhandledrejection', swallowAbortRejection);

      try {
        currentMap.remove();
      } catch (error) {
        // Map teardown can abort in-flight style/source requests; ignore only this known case.
        if (!isAbortError(error)) {
          throw error;
        }
      } finally {
        mapRef.current = null;
        // Keep the guard through the next macrotask so teardown rejections are captured.
        window.setTimeout(() => {
          window.removeEventListener('unhandledrejection', swallowAbortRejection);
        }, 0);
      }
    };
  }, [lng, lat, zoom, popupHtml, mapId]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}
    />
  );
}
