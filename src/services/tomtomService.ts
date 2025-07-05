const TOMTOM_API_KEY = 'bw0J0B708w7kx4WFrnhXLrLncKib5M5A';
const BASE_URL = 'https://api.tomtom.com';

interface ReverseGeocodeResponse {
  addresses: Array<{
    address: {
      freeformAddress: string;
      municipality: string;
      country: string;
      countryCode: string;
    };
  }>;
}

interface SearchResponse {
  results: Array<{
    position: {
      lat: number;
      lon: number;
    };
    address: {
      freeformAddress: string;
      municipality: string;
      country: string;
    };
  }>;
}

export const tomtomService = {
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `${BASE_URL}/search/2/reverseGeocode/${lat},${lng}.json?key=${TOMTOM_API_KEY}`
      );
      
      if (!response.ok) throw new Error('Reverse geocoding failed');
      
      const data: ReverseGeocodeResponse = await response.json();
      
      if (data.addresses && data.addresses.length > 0) {
        const address = data.addresses[0].address;
        return address.municipality || address.freeformAddress || 'Unknown Location';
      }
      
      return 'Unknown Location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown Location';
    }
  },

  async searchLocation(query: string): Promise<SearchResponse['results']> {
    try {
      const response = await fetch(
        `${BASE_URL}/search/2/search/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&limit=5`
      );
      
      if (!response.ok) throw new Error('Location search failed');
      
      const data: SearchResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  },

  async getTrafficInfo(lat: number, lng: number, zoom: number = 10) {
    try {
      const response = await fetch(
        `${BASE_URL}/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&unit=KMPH&key=${TOMTOM_API_KEY}`
      );
      
      if (!response.ok) throw new Error('Traffic info failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Traffic info error:', error);
      return null;
    }
  }
};