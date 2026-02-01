'use client';

import React from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';

interface InvitationSectionProps {
  bgColor?: 'white' | 'beige';
}

const InvitationSection = ({ bgColor = 'white' }: InvitationSectionProps) => {
  const { invitation } = weddingConfig;

  return (
    <InvitationSectionContainer $bgColor={bgColor}>
      <InvitationMessage>{invitation.message}</InvitationMessage>

      <CoupleContainer>
        <CoupleInfo>
          <ParentsNames>
            <ParentLabel>Groom</ParentLabel>
          </ParentsNames>
          <CoupleName>{invitation.groom.name}</CoupleName>
        </CoupleInfo>

        <CoupleInfo>
          <ParentsNames>
            <ParentLabel>Bride</ParentLabel>
          </ParentsNames>
          <CoupleName>{invitation.bride.name}</CoupleName>
        </CoupleInfo>
      </CoupleContainer>
    </InvitationSectionContainer>
  );
};

const InvitationSectionContainer = styled.section<{
  $bgColor: 'white' | 'beige';
}>`
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: ${(props) =>
    props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const InvitationMessage = styled.p`
  white-space: pre-line;
  line-height: 1.8;
  max-width: 36rem;
  margin: 0 auto 2rem auto;
  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CoupleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 4rem;
  }
`;

const CoupleInfo = styled.div`
  text-align: center;
`;

const ParentsNames = styled.p`
  margin-bottom: 0.25rem;
`;

const ParentLabel = styled.span`
  font-size: 0.875rem;
  margin-left: 0.25rem;
`;

const CoupleName = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
`;

export default InvitationSection;
