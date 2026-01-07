/**
 * Opens Google Maps with navigation to the specified location
 * @param {Object} location - Location object with address, lat, lng
 */
export const openGoogleMaps = (location) => {
  if (!location) {
    console.warn('No location provided for Google Maps');
    return;
  }

  let mapsUrl;

  // Prefer lat/lng for precision
  if (location.lat && location.lng) {
    mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
  }
  // Fallback to address
  else if (location.address) {
    const encodedAddress = encodeURIComponent(location.address);
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  }
  else {
    console.warn('Location missing both coordinates and address');
    return;
  }

  window.open(mapsUrl, '_blank');
};
