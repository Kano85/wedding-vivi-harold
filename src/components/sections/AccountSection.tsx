'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';
import { AccountInfo } from '../../types/wedding';
import type { SiteLanguage } from '../../lib/i18n';

type AccountPerson = 'groom' | 'bride' | 'groomFather' | 'groomMother' | 'brideFather' | 'brideMother';
type AccountSide = 'groom' | 'bride';

interface AccountSectionProps {
  bgColor?: 'white' | 'beige';
  language: SiteLanguage;
}

const AccountSection = ({ bgColor = 'white', language }: AccountSectionProps) => {
  const [copyStatus, setCopyStatus] = useState<Record<AccountPerson, boolean>>({
    groom: false,
    bride: false,
    groomFather: false,
    groomMother: false,
    brideFather: false,
    brideMother: false,
  });
  
  // URL copy status
  const [urlCopied, setUrlCopied] = useState(false);

  // Account group expand/collapse state
  const [expandedSide, setExpandedSide] = useState<AccountSide | null>(null);
  const t = language === 'es'
    ? {
        sectionTitle: 'Cuentas de Regalo',
        groomSide: 'Cuentas del Novio',
        brideSide: 'Cuentas de la Novia',
        groom: 'Novio',
        bride: 'Novia',
        father: 'Padre',
        mother: 'Madre',
        copied: 'Copiado',
        copy: 'Copiar',
        copyUrl: 'Copiar URL',
        copiedUrl: 'Copiado!',
        share: 'Compartir',
        notSupported: 'Compartir no esta disponible en este navegador. La URL fue copiada.',
        shareText: `${weddingConfig.invitation.groom.name} y ${weddingConfig.invitation.bride.name} te invitan a su boda`,
      }
    : {
        sectionTitle: 'Geschenkkonten',
        groomSide: 'Konten der Braeutigamseite',
        brideSide: 'Konten der Brautseite',
        groom: 'Braeutigam',
        bride: 'Braut',
        father: 'Vater',
        mother: 'Mutter',
        copied: 'Kopiert',
        copy: 'Kopieren',
        copyUrl: 'URL kopieren',
        copiedUrl: 'Kopiert!',
        share: 'Teilen',
        notSupported: 'Teilen wird in diesem Browser nicht unterstuetzt. Die URL wurde kopiert.',
        shareText: `${weddingConfig.invitation.groom.name} und ${weddingConfig.invitation.bride.name} laden dich zu ihrer Hochzeit ein`,
      };

  const toggleSide = (side: AccountSide) => {
    if (expandedSide === side) {
      setExpandedSide(null);
    } else {
      setExpandedSide(side);
    }
  };

  const copyToClipboard = (text: string, person: AccountPerson) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyStatus({ ...copyStatus, [person]: true });
        setTimeout(() => {
          setCopyStatus({ ...copyStatus, [person]: false });
        }, 2000);
      },
      (err) => {
        console.error('Failed to copy account number:', err);
      }
    );
  };
  
  // Copy URL
  const copyWebsiteUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        setUrlCopied(true);
        setTimeout(() => {
          setUrlCopied(false);
        }, 2000);
      },
      (err) => {
        console.error('Failed to copy URL:', err);
      }
    );
  };
  
  // Share using the Web Share API
  const shareWebsite = async () => {
    const shareData = {
      title: weddingConfig.meta.title,
      text: t.shareText,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fall back to copying URL if Web Share API isn't available
        copyWebsiteUrl();
        alert(t.notSupported);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Render a single account row
  const renderAccountRow = (accountInfo: AccountInfo, person: AccountPerson, title: string) => {
    // Skip if the holder name is missing
    if (!accountInfo.holder || accountInfo.holder.trim() === '') {
      return null;
    }

    // Line 1: bank, Line 2: account number + holder
    const bankText = accountInfo.bank;
    const numberAndHolder = `${accountInfo.number} ${accountInfo.holder}`;

    // Copy text: "Bank AccountNumber Holder"
    const copyText = `${accountInfo.bank} ${accountInfo.number} ${accountInfo.holder}`;

    return (
      <AccountRow>
        <AccountRowTitle>
          {title}
        </AccountRowTitle>
        <AccountRowInfo>
          <AccountBank>{bankText}</AccountBank>
          <AccountNumber>{numberAndHolder}</AccountNumber>
        </AccountRowInfo>
        <CopyButton
          onClick={(e) => {
            e.stopPropagation(); // Prevent card toggle on copy
            copyToClipboard(copyText, person);
          }}
        >
          {copyStatus[person] ? t.copied : t.copy}
        </CopyButton>
      </AccountRow>
    );
  };

  return (
    <AccountSectionContainer $bgColor={bgColor}>
      <SectionTitle>{t.sectionTitle}</SectionTitle>
      
      <AccountCards>
        {/* Groom side accounts */}
        <AccountCard onClick={() => toggleSide('groom')}>
          <AccountCardHeader $isExpanded={expandedSide === 'groom'}>
            <GroupTitle>{t.groomSide}</GroupTitle>
            <ExpandIcon $isExpanded={expandedSide === 'groom'}>
              {expandedSide === 'groom' ? '−' : '+'}
            </ExpandIcon>
          </AccountCardHeader>
          
          {expandedSide === 'groom' && (
            <AccountRowsContainer>
              {renderAccountRow(weddingConfig.account.groom, 'groom', t.groom)}
              {renderAccountRow(weddingConfig.account.groomFather, 'groomFather', t.father)}
              {renderAccountRow(weddingConfig.account.groomMother, 'groomMother', t.mother)}
            </AccountRowsContainer>
          )}
        </AccountCard>
        
        {/* Bride side accounts */}
        <AccountCard onClick={() => toggleSide('bride')}>
          <AccountCardHeader $isExpanded={expandedSide === 'bride'}>
            <GroupTitle>{t.brideSide}</GroupTitle>
            <ExpandIcon $isExpanded={expandedSide === 'bride'}>
              {expandedSide === 'bride' ? '−' : '+'}
            </ExpandIcon>
          </AccountCardHeader>
          
          {expandedSide === 'bride' && (
            <AccountRowsContainer>
              {renderAccountRow(weddingConfig.account.bride, 'bride', t.bride)}
              {renderAccountRow(weddingConfig.account.brideFather, 'brideFather', t.father)}
              {renderAccountRow(weddingConfig.account.brideMother, 'brideMother', t.mother)}
            </AccountRowsContainer>
          )}
        </AccountCard>
      </AccountCards>
      
      {/* Share invitation buttons */}
      <ShareContainer>
        <ShareButton onClick={copyWebsiteUrl}>
          {urlCopied ? t.copiedUrl : t.copyUrl}
        </ShareButton>
        <ShareButton onClick={shareWebsite} $isShare={true}>
          {t.share}
        </ShareButton>
      </ShareContainer>
    </AccountSectionContainer>
  );
};

const AccountSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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

const AccountCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 40rem;
  margin: 0 auto;
`;

const AccountCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 6px 10px rgba(0,0,0,0.1);
  }
`;

const AccountCardHeader = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: ${props => props.$isExpanded ? '1px solid #eee' : 'none'};
`;

const GroupTitle = styled.h3`
  font-weight: 400;
  font-size: 1rem;
  color: #333;
  margin: 0;
  text-align: left;
  letter-spacing: 0.02em;
`;

const ExpandIcon = styled.span<{ $isExpanded: boolean }>`
  font-size: 1.5rem;
  line-height: 1;
  color: var(--secondary-color);
  transition: transform 0.3s ease;
  transform: ${props => props.$isExpanded ? 'rotate(0deg)' : 'rotate(0deg)'};
`;

const AccountRowsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccountRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 580px) {
    padding: 1rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }

  @media (max-width: 380px) {
    padding: 1rem 0.55rem;
  }
`;

const AccountRowTitle = styled.div`
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--secondary-color);
  min-width: 100px;
  text-align: left;

  @media (max-width: 580px) {
    min-width: 67.5px;
  }

  @media (max-width: 480px) {
    min-width: 55px;
  }
`;

const NameSpan = styled.span`
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--text-medium);
`;

const AccountRowInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  gap: 0.1rem;
  min-width: 0;
`;

const AccountBank = styled.div`
  font-size: 0.95rem;
  color: var(--text-medium);
  white-space: nowrap;
  font-size: 0.85rem;
  line-height: 1.3;
  @media (max-width: 580px) {
    font-size: 0.75rem;
  }
`;

const AccountNumber = styled.div`
  font-weight: 500;
  font-size: clamp(0.7rem, 4vw, 1.1rem);
  color: var(--text-dark);
  font-size: 0.95rem;
  line-height: 1.3;
  word-break: break-all;
  @media (max-width: 580px) {
    font-size: 0.85rem;
  }
`;

const CopyButton = styled.button`
  background-color: transparent;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &:hover, &:active {
    background-color: var(--secondary-color);
    color: white;
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

const ShareContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ShareButton = styled.button<{ $isShare?: boolean }>`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex: 1;
  max-width: 180px;
  
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
`;

export default AccountSection; 
