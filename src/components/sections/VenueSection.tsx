'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';
import MapTilerLightMap from '../MapTilerLightMap';
import type { SiteLanguage } from '../../lib/i18n';

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
  language: SiteLanguage;
}

const VenueSection = ({ bgColor = 'white', language }: VenueSectionProps) => {
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
  const t = language === 'es'
    ? {
        title: 'Lugar',
        publicTransport: 'Transporte Publico',
        subway: 'Tren',
        bus: 'Bus',
        parking: 'Parking',
        subwayText: weddingConfig.venue.transportation.subway,
        busText: weddingConfig.venue.transportation.bus,
        parkingText: weddingConfig.venue.parking,
        localTitle: weddingConfig.venue.travelInfoLocal?.title || '',
        localDetails: weddingConfig.venue.travelInfoLocal?.details || '',
        outsideTitle: weddingConfig.venue.travelInfoOutside?.title || '',
        outsideDetails: weddingConfig.venue.travelInfoOutside?.details || '',
      }
    : {
        title: 'Ort',
        publicTransport: 'Oeffentliche Verkehrsmittel',
        subway: 'Zug',
        bus: 'Bus',
        parking: 'Parken',
        subwayText:
          'Der Zug bringt euch nach Figueres. Wir organisieren einen Shuttle von Figueres. Weitere Details teilen wir naeher am Eventdatum.',
        busText:
          'Der Zug bringt euch nach Figueres. Wir organisieren einen Shuttle von Figueres. Weitere Details teilen wir naeher am Eventdatum.',
        parkingText: 'Parkplaetze vor Ort verfuegbar.',
        localTitle: 'Barcelona / Katalonien',
        localDetails:
          'Bitte nehmt den Zug nach Figueres. Wir planen einen Shuttle von Figueres zur Location. Weitere Informationen folgen naeher am Eventdatum.',
        outsideTitle: 'Ausserhalb Kataloniens / Anreise per Flug',
        outsideDetails:
          'Wenn ihr von ausserhalb Kataloniens anreist, sind die naechsten Flughaefen Barcelona (BCN) und Girona (GRO). Von dort bitte mit dem Zug nach Figueres. Wir planen einen Shuttle von Figueres zur Location. Weitere Informationen folgen naeher am Eventdatum.',
      };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <VenueSectionContainer $bgColor={bgColor}>
        <SectionTitle>{t.title}</SectionTitle>
      </VenueSectionContainer>
    );
  }
  
  return (
    <VenueSectionContainer $bgColor={bgColor}>
      <SectionTitle>{t.title}</SectionTitle>
      
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
        <CardTitle>{t.publicTransport}</CardTitle>
        <TransportItem>
          <TransportLabel>{t.subway}</TransportLabel>
          <TransportText>{language === 'es' ? weddingConfig.venue.transportation.subway : t.subwayText}</TransportText>
        </TransportItem>
        <TransportItem>
          <TransportLabel>{t.bus}</TransportLabel>
          <TransportText>{language === 'es' ? weddingConfig.venue.transportation.bus : t.busText}</TransportText>
        </TransportItem>
      </TransportCard>
      
      <ParkingCard>
        <CardTitle>{t.parking}</CardTitle>
        <TransportText>{language === 'es' ? weddingConfig.venue.parking : t.parkingText}</TransportText>
      </ParkingCard>
      
      {/* Travel info - local */}
      {weddingConfig.venue.travelInfoLocal && (
        <ShuttleCard>
          <ShuttleCardHeader onClick={() => toggleTravel('local')} $isExpanded={expandedTravel === 'local'}>
            <CardTitle>{language === 'es' ? weddingConfig.venue.travelInfoLocal.title : t.localTitle}</CardTitle>
            <ExpandIcon $isExpanded={expandedTravel === 'local'}>
              {expandedTravel === 'local' ? '−' : '+'}
            </ExpandIcon>
          </ShuttleCardHeader>

          {expandedTravel === 'local' && (
            <ShuttleContent>
              <ShuttleInfo>
                <ShuttleText>
                  {formatTextWithLineBreaks(
                    language === 'es' ? weddingConfig.venue.travelInfoLocal.details : t.localDetails,
                  )}
                </ShuttleText>
              </ShuttleInfo>
            </ShuttleContent>
          )}
        </ShuttleCard>
      )}

      {/* Travel info - outside Catalunya */}
      {weddingConfig.venue.travelInfoOutside && (
        <ShuttleCard>
          <ShuttleCardHeader onClick={() => toggleTravel('outside')} $isExpanded={expandedTravel === 'outside'}>
            <CardTitle>{language === 'es' ? weddingConfig.venue.travelInfoOutside.title : t.outsideTitle}</CardTitle>
            <ExpandIcon $isExpanded={expandedTravel === 'outside'}>
              {expandedTravel === 'outside' ? '−' : '+'}
            </ExpandIcon>
          </ShuttleCardHeader>

          {expandedTravel === 'outside' && (
            <ShuttleContent>
              <ShuttleInfo>
                <ShuttleText>
                  {formatTextWithLineBreaks(
                    language === 'es' ? weddingConfig.venue.travelInfoOutside.details : t.outsideDetails,
                  )}
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
