'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';
import MapTilerLightMap from '../MapTilerLightMap';

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
  const [isClient, setIsClient] = useState(false);
  // Shuttle info expand/collapse state
  const [expandedTravel, setExpandedTravel] = useState<'local' | 'outside' | null>(null);
  
  // Toggle shuttle info
  const toggleTravel = (section: 'local' | 'outside') => {
    if (expandedTravel === section) {
      setExpandedTravel(null);
    } else {
      setExpandedTravel(section);
    }
  };
  
  const mapPopupHtml = `<strong>${weddingConfig.venue.name}</strong><br/>${weddingConfig.venue.address.replace(/\n/g, '<br/>')}`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <VenueSectionContainer $bgColor={bgColor}>
        <SectionTitle>Venue</SectionTitle>
      </VenueSectionContainer>
    );
  }
  
  return (
    <VenueSectionContainer $bgColor={bgColor}>
      <SectionTitle>Venue</SectionTitle>
      
      <VenueInfo>
        <VenueName>{weddingConfig.venue.name}</VenueName>
        <VenueAddress>{formatTextWithLineBreaks(weddingConfig.venue.address)}</VenueAddress>
        <VenueTel href={`tel:${weddingConfig.venue.tel}`}>{weddingConfig.venue.tel}</VenueTel>
      </VenueInfo>
      
      <MapWrapper>
        <MapTilerLightMap
          lat={weddingConfig.venue.coordinates.latitude}
          lng={weddingConfig.venue.coordinates.longitude}
          zoom={weddingConfig.venue.mapZoom}
          mapId={weddingConfig.venue.mapId}
          popupHtml={mapPopupHtml}
        />
      </MapWrapper>
      
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
      
      {/* Travel info - local */}
      {weddingConfig.venue.travelInfoLocal && (
        <ShuttleCard>
          <ShuttleCardHeader onClick={() => toggleTravel('local')} $isExpanded={expandedTravel === 'local'}>
            <CardTitle>{weddingConfig.venue.travelInfoLocal.title}</CardTitle>
            <ExpandIcon $isExpanded={expandedTravel === 'local'}>
              {expandedTravel === 'local' ? '−' : '+'}
            </ExpandIcon>
          </ShuttleCardHeader>

          {expandedTravel === 'local' && (
            <ShuttleContent>
              <ShuttleInfo>
                <ShuttleText>{formatTextWithLineBreaks(weddingConfig.venue.travelInfoLocal.details)}</ShuttleText>
              </ShuttleInfo>
            </ShuttleContent>
          )}
        </ShuttleCard>
      )}

      {/* Travel info - outside Catalunya */}
      {weddingConfig.venue.travelInfoOutside && (
        <ShuttleCard>
          <ShuttleCardHeader onClick={() => toggleTravel('outside')} $isExpanded={expandedTravel === 'outside'}>
            <CardTitle>{weddingConfig.venue.travelInfoOutside.title}</CardTitle>
            <ExpandIcon $isExpanded={expandedTravel === 'outside'}>
              {expandedTravel === 'outside' ? '−' : '+'}
            </ExpandIcon>
          </ShuttleCardHeader>

          {expandedTravel === 'outside' && (
            <ShuttleContent>
              <ShuttleInfo>
                <ShuttleText>{formatTextWithLineBreaks(weddingConfig.venue.travelInfoOutside.details)}</ShuttleText>
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

const MapWrapper = styled.div`
  height: 26rem;
  margin-bottom: 1rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  overflow: hidden;
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
