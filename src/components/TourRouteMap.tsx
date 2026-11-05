import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { TourMapStyle, TourPackageLocation } from '../types/tourPackage'

function FitRoute({ locations }: { locations: TourPackageLocation[] }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(L.latLngBounds(locations.map(stop => [stop.latitude, stop.longitude])), { padding: [35, 35], maxZoom: 10 })
  }, [map, locations])
  return null
}

export function TourRouteMap({ locations, mapStyle = 'light', title }: { locations: TourPackageLocation[]; mapStyle?: TourMapStyle; title: string }) {
  const route = locations.filter(stop => Number.isFinite(stop.latitude) && Number.isFinite(stop.longitude))
  if (!route.length) return null
  const tiles = mapStyle === 'dark' ? 'dark_all' : 'light_all'
  return (
    <div className="h-full min-h-[420px] w-full" aria-label={`${title} route map`}>
      <MapContainer center={[route[0].latitude, route[0].longitude]} zoom={7} className="h-[420px] w-full" scrollWheelZoom={false}>
        <TileLayer url={`https://{s}.basemaps.cartocdn.com/${tiles}/{z}/{x}/{y}{r}.png`} attribution='&copy; OpenStreetMap &copy; CARTO' className={mapStyle === 'green' ? 'route-tiles-green' : mapStyle === 'warm' ? 'route-tiles-warm' : ''} />
        <FitRoute locations={route} />
        <Polyline positions={route.map(stop => [stop.latitude, stop.longitude])} pathOptions={{ color: '#006b1f' }} />
        {route.map(stop => {
          const color = /^#[0-9a-f]{6}$/i.test(stop.pin_color) ? stop.pin_color : '#006b1f'
          const day = Number.isInteger(stop.day_order) ? stop.day_order : 1
          const icon = L.divIcon({ className: '', html: `<span style="display:grid;place-items:center;border:2px solid white;border-radius:50%;width:30px;height:30px;background:${color};color:white">${day}</span>`, iconSize: [30, 30] })
          return <Marker key={stop.id} position={[stop.latitude, stop.longitude]} icon={icon}><Popup><strong>{stop.location_name}</strong><p>Day {stop.day_order}</p>{stop.notes && <p>{stop.notes}</p>}{stop.image_url && <img src={stop.image_url} alt={stop.location_name} className="max-h-40 w-full object-cover" />}</Popup></Marker>
        })}
      </MapContainer>
    </div>
  )
}
