'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { FoodItem } from '@/utils/types';

interface MapProps {
  items: FoodItem[];
  focusedItemId?: string;
}

export default function LeafletMap({ items, focusedItemId }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapRef.current) return;

    let mapInstance: any = null;

    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      // Clean existing inner map if any
      mapRef.current.innerHTML = '';
      const mapContainer = document.createElement('div');
      mapContainer.style.width = '100%';
      mapContainer.style.height = '100%';
      mapRef.current.appendChild(mapContainer);

      const defaultLat = items.length > 0 && items[0].latitude ? items[0].latitude : -6.14;
      const defaultLng = items.length > 0 && items[0].longitude ? items[0].longitude : 106.865;

      mapInstance = L.map(mapContainer).setView([defaultLat, defaultLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance);

      const markers = items.map((item) => {
        const lat = item.latitude || -6.14;
        const lng = item.longitude || 106.865;
        const portions = item.available_portions ?? item.portionsAvailable ?? item.total_portions;

        const marker = L.circleMarker([lat, lng], {
          radius: 10,
          color: '#ffffff',
          weight: 2,
          fillColor: portions <= 5 ? '#f59e0b' : '#10b981',
          fillOpacity: 1,
        }).addTo(mapInstance);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; line-height: 1.4;">
            <strong style="font-size: 13px; color: #047857;">${item.donaturName || item.donor_name || 'Donatur'}</strong><br/>
            <span style="font-weight: 600;">${item.title}</span><br/>
            <span style="display:inline-block; background: #ecfdf5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 4px;">
              ${portions} Porsi Tersedia
            </span>
          </div>
        `);

        return marker;
      });

      if (markers.length > 1) {
        mapInstance.fitBounds(L.featureGroup(markers).getBounds().pad(0.2));
      } else if (markers.length === 1) {
        mapInstance.setView([items[0].latitude || defaultLat, items[0].longitude || defaultLng], 14);
      }

      const focusedIndex = items.findIndex((item) => (item.id === focusedItemId || item.public_id === focusedItemId));
      if (focusedIndex >= 0 && markers[focusedIndex]) {
        const focusedItem = items[focusedIndex];
        mapInstance.setView([focusedItem.latitude || defaultLat, focusedItem.longitude || defaultLng], 15);
        markers[focusedIndex].openPopup();
      }
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [focusedItemId, isMounted, items]);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2 shadow-lg z-[400]">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Lokasi Makanan Aktif</span>
      </div>
    </div>
  );
}