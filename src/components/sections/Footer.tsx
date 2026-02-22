'use client';

import React from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';
import type { SiteLanguage } from '../../lib/i18n';

const watermarkId = weddingConfig.meta._jwk_watermark_id || 'JWK-NonCommercial';

const jwk_checkNonCommercial = () => {
  console.log(`Watermark: ${watermarkId.slice(0, 5)}`);
};

interface FooterProps {
  language: SiteLanguage;
}

const Footer = ({ language }: FooterProps) => {
  return (
    <FooterContainer>
      {/* WeddingInvitation-Footer-NonCommercial DO NOT CHANGE*/}
      <FooterContent>
        <HiddenAttribution data-jwk-id={watermarkId}>
          NonCommercial
        </HiddenAttribution>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  padding: 2rem 1.5rem;
  background-color: #F8F6F2;
  border-top: 1px solid rgba(0,0,0,0.05);
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  max-width: 36rem;
  margin: 0 auto;
  min-height: 1px;
`;

const HiddenAttribution = styled.div`
  position: absolute;
  opacity: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
`;

export default Footer; 
