'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { weddingConfig } from '../../config/wedding-config';

declare global {
  interface Window {
    naver: any;
  }
}

// Convert \n to <br /> line breaks
const formatTextWithLineBreaks = (text: string) => {
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

interface VenueSectionProps {
  bgColor?: 'white' | 'beige';
}

const VenueSection = ({ bgColor = 'white' }: VenueSectionProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [mapError, setMapError] = useState(false);
  // Shuttle info expand/collapse state
  const [expandedShuttle, setExpandedShuttle] = useState<'groom' | 'bride' | null>(null);
  
  // Toggle shuttle info
  const toggleShuttle = (shuttle: 'groom' | 'bride') => {
    if (expandedShuttle === shuttle) {
      setExpandedShuttle(null);
    } else {
      setExpandedShuttle(shuttle);
    }
  };
  
  // Debug info
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || '';
    const debug = `Client ID: ${clientId.substring(0, 3)}...`;
    setDebugInfo(debug);
  }, []);
  
  // Load Naver Map API script dynamically
  useEffect(() => {
    const loadNaverMapScript = () => {
      if (window.naver && window.naver.maps) {
        setMapLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.async = true;
      // Naver Map API requires loading geocoder separately
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
      script.onload = () => {
        console.log('Naver Map script loaded');
        setMapLoaded(true);
      };
      script.onerror = (error) => {
        console.error('Failed to load Naver Map script:', error);
        setMapError(true);
      };
      document.head.appendChild(script);
      
      // Timeout to detect auth errors
      setTimeout(() => {
        if (document.querySelector('div[style*="position: absolute; z-index: 100000000"]')) {
          console.log('Naver Map auth error detected');
          setMapError(true);
        }
      }, 3000);
    };

    loadNaverMapScript();
    
    // Cleanup map on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);
  
  // Initialize Naver Map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapError) return;
    
    const initMap = () => {
      try {
        console.log('Initializing Naver Map');
        
        // Default location (Seoul City Hall) before address lookup
        const defaultLocation = new window.naver.maps.LatLng(37.5666805, 126.9784147);
        
        // Create map
        const map = new window.naver.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: parseInt(weddingConfig.venue.mapZoom, 10) || 15,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.RIGHT_TOP
          }
        });
        
        console.log('Naver Map instance created');
        
        // Use coordinates from wedding-config.ts
        const venueLocation = new window.naver.maps.LatLng(
          weddingConfig.venue.coordinates.latitude, 
          weddingConfig.venue.coordinates.longitude
        );
        
        // Create marker
        const marker = new window.naver.maps.Marker({
          position: venueLocation,
          map: map
        });
        
        // Create info window
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:10px;min-width:150px;text-align:center;font-size:14px;"><strong>${weddingConfig.venue.name}</strong></div>`
        });
        
        // Show info window on marker
        infoWindow.open(map, marker);
        
        // Center map
        map.setCenter(venueLocation);
        console.log('Naver Map initialized');
        
        // Extra check for auth errors
        setTimeout(() => {
          const errorDiv = document.querySelector('div[style*="position: absolute; z-index: 100000000"]');
          if (errorDiv) {
            console.log('Auth error detected');
            setMapError(true);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Naver Map initialization error:', error);
        setMapError(true);
      }
    };
    
    initMap();
  }, [mapLoaded, mapError]);
  
  // Render static map image (fallback if API auth fails)
  const renderStaticMap = () => {
    return (
      <StaticMapContainer>
        <StaticMapImage src="https://navermaps.github.io/maps.js.ncp/docs/img/example-static-map.png" alt="Venue location" />
        <MapOverlay>
          <VenueName style={{ color: 'white', marginBottom: '0.5rem' }}>{weddingConfig.venue.name}</VenueName>
          <VenueAddress style={{ color: 'white', fontSize: '0.9rem' }}>{weddingConfig.venue.address}</VenueAddress>
        </MapOverlay>
      </StaticMapContainer>
    );
  };
  
  // Navigation link helpers
  const navigateToNaver = () => {
    if (typeof window !== 'undefined') {
      // Open Naver Map app/web (new format)
      const naverMapsUrl = `https://map.naver.com/p/directions/-/-/-/walk/place/${weddingConfig.venue.placeId}?c=${weddingConfig.venue.mapZoom},0,0,0,dh`;
      window.open(naverMapsUrl, '_blank');
    }
  };
  
  const navigateToKakao = () => {
    if (typeof window !== 'undefined') {
      // Open Kakao Map app/web
      const lat = weddingConfig.venue.coordinates.latitude;
      const lng = weddingConfig.venue.coordinates.longitude;
      const name = encodeURIComponent(weddingConfig.venue.name);
      const address = encodeURIComponent(weddingConfig.venue.address);
      const kakaoMapsUrl = `https://map.kakao.com/link/to/${name},${lat},${lng}`;
      window.open(kakaoMapsUrl, '_blank');
    }
  };
  
  const navigateToTmap = () => {
    if (typeof window !== 'undefined') {
      // Open TMAP app (deep link only)
      const lat = weddingConfig.venue.coordinates.latitude;
      const lng = weddingConfig.venue.coordinates.longitude;
      const name = encodeURIComponent(weddingConfig.venue.name);
      
      // Attempt to open the app on mobile devices
      window.location.href = `tmap://route?goalname=${name}&goaly=${lat}&goalx=${lng}`;
      
      // If the app isn't installed, redirect to the TMAP website after a delay
      setTimeout(() => {
        // If TMAP isn't installed, go to the TMAP website home
        if(document.hidden) return; // If app launched, do nothing
        window.location.href = 'https://tmap.co.kr';
      }, 1000);
    }
  };
  
  return (
    <VenueSectionContainer $bgColor={bgColor}>
      <SectionTitle>Venue</SectionTitle>
      
      <VenueInfo>
        <VenueName>{weddingConfig.venue.name}</VenueName>
        <VenueAddress>{formatTextWithLineBreaks(weddingConfig.venue.address)}</VenueAddress>
        <VenueTel href={`tel:${weddingConfig.venue.tel}`}>{weddingConfig.venue.tel}</VenueTel>
      </VenueInfo>
      
      {mapError ? (
        renderStaticMap()
      ) : (
        <MapContainer ref={mapRef}>
          {!mapLoaded && <MapLoading>Loading map...{debugInfo}</MapLoading>}
        </MapContainer>
      )}
      
      <NavigateButtonsContainer>
        <NavigateButton onClick={navigateToNaver} $mapType="naver">
          Naver Map
        </NavigateButton>
        <NavigateButton onClick={navigateToKakao} $mapType="kakao">
          Kakao Map
        </NavigateButton>
        <NavigateButton onClick={navigateToTmap} $mapType="tmap">
          TMAP
        </NavigateButton>
      </NavigateButtonsContainer>
      
      <TransportCard>
        <CardTitle>Public Transportation</CardTitle>
        <TransportItem>
          <TransportLabel>Subway</TransportLabel>
          <TransportText>{weddingConfig.venue.transportation.subway}</TransportText>
        </TransportItem>
        <TransportItem>
          <TransportLabel>Bus</TransportLabel>
          <TransportText>{weddingConfig.venue.transportation.bus}</TransportText>
        </TransportItem>
      </TransportCard>
      
      <ParkingCard>
        <CardTitle>Parking</CardTitle>
        <TransportText>{weddingConfig.venue.parking}</TransportText>
      </ParkingCard>
      
      {/* Groom shuttle info - shown only when available */}
      {weddingConfig.venue.groomShuttle && (
        <ShuttleCard>
          <ShuttleCardHeader onClick={() => toggleShuttle('groom')} $isExpanded={expandedShuttle === 'groom'}>
            <CardTitle>Groom Shuttle</CardTitle>
            <ExpandIcon $isExpanded={expandedShuttle === 'groom'}>
              {expandedShuttle === 'groom' ? '−' : '+'}
            </ExpandIcon>
          </ShuttleCardHeader>
          
          {expandedShuttle === 'groom' && (
            <ShuttleContent>
              <ShuttleInfo>
                <ShuttleLabel>Pickup Location</ShuttleLabel>
                <ShuttleText>{formatTextWithLineBreaks(weddingConfig.venue.groomShuttle.location)}</ShuttleText>
              </ShuttleInfo>
              <ShuttleInfo>
                <ShuttleLabel>Departure Time</ShuttleLabel>
                <ShuttleText>{weddingConfig.venue.groomShuttle.departureTime}</ShuttleText>
              </ShuttleInfo>
              <ShuttleInfo>
                <ShuttleLabel>Contact</ShuttleLabel>
                <ShuttleText>
                  {weddingConfig.venue.groomShuttle.contact.name} ({weddingConfig.venue.groomShuttle.contact.tel})
                  <ShuttleCallButton href={`tel:${weddingConfig.venue.groomShuttle.contact.tel}`}>
                    Call
                  </ShuttleCallButton>
                </ShuttleText>
              </ShuttleInfo>
            </ShuttleContent>
          )}
        </ShuttleCard>
      )}
      
      {/* Bride shuttle info - shown only when available */}
      {weddingConfig.venue.brideShuttle && (
        <ShuttleCard>
          <ShuttleCardHeader onClick={() => toggleShuttle('bride')} $isExpanded={expandedShuttle === 'bride'}>
            <CardTitle>Bride Shuttle</CardTitle>
            <ExpandIcon $isExpanded={expandedShuttle === 'bride'}>
              {expandedShuttle === 'bride' ? '−' : '+'}
            </ExpandIcon>
          </ShuttleCardHeader>
          
          {expandedShuttle === 'bride' && (
            <ShuttleContent>
              <ShuttleInfo>
                <ShuttleLabel>Pickup Location</ShuttleLabel>
                <ShuttleText>{formatTextWithLineBreaks(weddingConfig.venue.brideShuttle.location)}</ShuttleText>
              </ShuttleInfo>
              <ShuttleInfo>
                <ShuttleLabel>Departure Time</ShuttleLabel>
                <ShuttleText>{weddingConfig.venue.brideShuttle.departureTime}</ShuttleText>
              </ShuttleInfo>
              <ShuttleInfo>
                <ShuttleLabel>Contact</ShuttleLabel>
                <ShuttleText>
                  {weddingConfig.venue.brideShuttle.contact.name} ({weddingConfig.venue.brideShuttle.contact.tel})
                  <ShuttleCallButton href={`tel:${weddingConfig.venue.brideShuttle.contact.tel}`}>
                    Call
                  </ShuttleCallButton>
                </ShuttleText>
              </ShuttleInfo>
            </ShuttleContent>
          )}
        </ShuttleCard>
      )}
    </VenueSectionContainer>
  );
};

const VenueSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: ${props => props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const SectionTitle = styled.h2`
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 1.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--secondary-color);
  }
`;

const VenueInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const VenueName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const VenueAddress = styled.p`
  margin-bottom: 0.5rem;
`;

const VenueTel = styled.a`
  color: var(--secondary-color);
  text-decoration: none;
`;

const MapContainer = styled.div`
  height: 16rem;
  margin-bottom: 1rem;
  background-color: #f1f1f1;
  border-radius: 8px;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;

const StaticMapContainer = styled.div`
  height: 16rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
`;

const StaticMapImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MapOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  text-align: center;
`;

const MapLoading = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-medium);
`;

const NavigateButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
`;

const NavigateButton = styled.button<{ $mapType?: 'naver' | 'kakao' | 'tmap' }>`
  flex: 1;
  min-width: 6rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #c4a986;
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:active:after {
    animation: ripple 0.6s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
`;

const TransportCard = styled(Card)``;
const ParkingCard = styled(Card)``;
const ShuttleCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const CardTitle = styled.h4`
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const TransportItem = styled.div`
  margin-bottom: 1rem;
`;

const TransportLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
`;

const TransportText = styled.p`
  font-size: 0.875rem;
  color: var(--text-medium);
  white-space: pre-line;
`;

const ShuttleInfo = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ShuttleLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
`;

const ShuttleText = styled.p`
  font-size: 0.875rem;
  color: var(--text-medium);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ShuttleCallButton = styled.a`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  text-decoration: none;
  margin-left: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &:active {
    transform: translateY(1px);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:active:after {
    animation: ripple 0.6s ease-out;
  }
`;

const ShuttleCardHeader = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  border-bottom: ${props => props.$isExpanded ? '1px solid #eee' : 'none'};
  
  h4 {
    margin: 0;
  }
`;

const ExpandIcon = styled.span<{ $isExpanded: boolean }>`
  font-size: 1.5rem;
  line-height: 1;
  color: var(--secondary-color);
  transition: transform 0.3s ease;
  transform: ${props => props.$isExpanded ? 'rotate(0deg)' : 'rotate(0deg)'};
`;

const ShuttleContent = styled.div`
  padding: 1rem 1.5rem 1.5rem;
`;

export default VenueSection; 
