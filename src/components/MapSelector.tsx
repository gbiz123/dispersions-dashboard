import React, { useCallback, useMemo } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

type Props = {
  latitude: number | null;                 // ← allow “no pin”
  longitude: number | null;
  onPositionChange: (lat: number, lng: number) => void;
};

const containerStyle = { width: '100%', height: 300 };

const HIDE_POI: google.maps.MapTypeStyle[] = [
  { featureType: 'poi',            stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.business',   stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical',    stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.place_of_worship', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',        stylers: [{ visibility: 'off' }] }
];

const mapOptions: google.maps.MapOptions = {
  gestureHandling: 'greedy',     // wheel zoom works without Ctrl
  scrollwheel: true,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  styles: HIDE_POI               // ← hide businesses / POI
};

const CARD_CLASS =
  'w-full h-[450px] rounded-lg border border-gray-200 shadow-lg overflow-hidden'; // ← new

const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // USA centre

const MapSelector: React.FC<Props> = ({ latitude, longitude, onPositionChange }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY as string;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });

  const center = useMemo(
    () =>
      latitude != null && longitude != null
        ? { lat: latitude, lng: longitude }
        : DEFAULT_CENTER,
    [latitude, longitude]
  );

  const handleClick = useCallback(
    (e: google.maps.MapMouseEvent) =>
      e.latLng && onPositionChange(e.latLng.lat(), e.latLng.lng()),
    [onPositionChange]
  );

  if (!isLoaded) {
    return <div className={CARD_CLASS + ' animate-pulse bg-gray-50'} />;
  }

  return (
    <GoogleMap
      mapContainerClassName={CARD_CLASS}
      center={center}
      zoom={10}
      options={mapOptions}
      onClick={handleClick}
    >
      {latitude != null && longitude != null && (
        <Marker
          position={{ lat: latitude, lng: longitude }}
          icon={{
            url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
            scaledSize: new google.maps.Size(20, 20)    // ← 20 px pin
          }}
          draggable
          onDragEnd={e => e.latLng && onPositionChange(e.latLng.lat(), e.latLng.lng())}
        />
      )}
    </GoogleMap>
  );
};

export default React.memo(MapSelector);