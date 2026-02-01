'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { weddingConfig } from '../../config/wedding-config';

interface GallerySectionProps {
  bgColor?: 'white' | 'beige';
}

// SVG arrow icon components
const ArrowLeftIcon = styled(({ className }: { className?: string }) => (
  <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="14" fill="none"/>
    <path d="M17.5 7L11 14L17.5 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
))`
  margin-left: -0.25rem;
`;
const ArrowRightIcon = styled(({ className }: { className?: string }) => (
  <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="14" fill="none"/>
    <path d="M10.5 7L17 14L10.5 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
))`
  margin-right: -0.25rem;
`;

// Loading spinner component
const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const GallerySection = ({ bgColor = 'white' }: GallerySectionProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number>(-1);
  const [isExpandedImageLoading, setIsExpandedImageLoading] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Gallery layout mode (scroll or grid)
  const galleryLayout = weddingConfig.gallery.layout || 'scroll';
  
  // Debug logs
  console.log('Gallery Layout:', galleryLayout);
  console.log('Wedding Config Gallery:', weddingConfig.gallery);
  console.log('Gallery Layout from config:', weddingConfig.gallery.layout);
  
  useEffect(() => {
    // Fetch gallery images from API
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/gallery');
        
        if (!response.ok) {
          throw new Error('Failed to load gallery images');
        }
        
        const data = await response.json();
        
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        } else {
          // Fall back to config if API returns no images
          setImages(weddingConfig.gallery.images);
        }
      } catch (err) {
        console.error('Gallery image load error:', err);
        setError('Something went wrong while loading images.');
        // Fall back to config on error
        setImages(weddingConfig.gallery.images);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGalleryImages();
  }, []);
  
  // Handle browser back navigation
  useEffect(() => {
    if (expandedImage) {
      // Push history state when image is expanded
      window.history.pushState({ expandedImage: true }, "");
      
      // Back navigation listener
      const handlePopState = (event: PopStateEvent) => {
        if (expandedImage) {
          setExpandedImage(null);
          document.body.style.overflow = '';
          event.preventDefault();
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      
      // Cleanup on unmount
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [expandedImage]);
  
  // Touch event handling
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Only change image on dominant horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - previous image
          goToPreviousImage();
        } else {
          // Swipe left - next image
          goToNextImage();
        }
      }
    };
    
    if (expandedImage && overlayRef.current) {
      const overlay = overlayRef.current;
      overlay.addEventListener('touchstart', handleTouchStart, { passive: true });
      overlay.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        overlay.removeEventListener('touchstart', handleTouchStart);
        overlay.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [expandedImage]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      // Scroll by one card width + gap
      scrollContainerRef.current.scrollBy({
        left: -266,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // Scroll by one card width + gap
      scrollContainerRef.current.scrollBy({
        left: 266,
        behavior: 'smooth'
      });
    }
  };

  const handleImageClick = (image: string) => {
    const imageIndex = images.indexOf(image);
    setExpandedImage(image);
    setExpandedImageIndex(imageIndex);
    setIsExpandedImageLoading(true); // Start loading
    // Prevent background scroll when expanded
    document.body.style.overflow = 'hidden';
  };

  const goToPreviousImage = () => {
    if (expandedImageIndex > 0) {
      const newIndex = expandedImageIndex - 1;
      setExpandedImageIndex(newIndex);
      setExpandedImage(images[newIndex]);
      setIsExpandedImageLoading(true); // Start loading next image
    }
  };

  const goToNextImage = () => {
    if (expandedImageIndex < images.length - 1) {
      const newIndex = expandedImageIndex + 1;
      setExpandedImageIndex(newIndex);
      setExpandedImage(images[newIndex]);
      setIsExpandedImageLoading(true); // Start loading next image
    }
  };

  const handleCloseExpanded = () => {
    setExpandedImage(null);
    setExpandedImageIndex(-1);
    setIsExpandedImageLoading(false); // Reset loading state
    // Restore scroll when expanded image closes
    document.body.style.overflow = '';
    // Handle back navigation state
    if (window.history.state && window.history.state.expandedImage) {
      window.history.back();
    }
  };
  
  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (expandedImage) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            goToPreviousImage();
            break;
          case 'ArrowRight':
            event.preventDefault();
            goToNextImage();
            break;
          case 'Escape':
            event.preventDefault();
            handleCloseExpanded();
            break;
        }
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (expandedImage) {
        event.preventDefault();
        if (event.deltaY > 0) {
          // Scroll down - next image
          goToNextImage();
        } else {
          // Scroll up - previous image
          goToPreviousImage();
        }
      }
    };

    if (expandedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('wheel', handleWheel);
      };
    }
  }, [expandedImage, expandedImageIndex, images]);
  
  // Expanded image load handler
  const handleExpandedImageLoad = () => {
    setIsExpandedImageLoading(false);
  };

  // Expanded image error handler
  const handleExpandedImageError = () => {
    setIsExpandedImageLoading(false);
  };
  
  if (isLoading) {
    return (
      <GallerySectionContainer $bgColor={bgColor}>
        <SectionTitle>Gallery</SectionTitle>
        <LoadingContainer>Loading images...</LoadingContainer>
      </GallerySectionContainer>
    );
  }
  
  if (error || images.length === 0) {
    return (
      <GallerySectionContainer $bgColor={bgColor}>
        <SectionTitle>Gallery</SectionTitle>
        <ErrorContainer>
          {error || 'No gallery images available.'}
        </ErrorContainer>
      </GallerySectionContainer>
    );
  }
  
  return (
    <GallerySectionContainer $bgColor={bgColor}>
      <SectionTitle>Gallery</SectionTitle>
      
      {galleryLayout === 'grid' ? (
        // Grid layout
        <GalleryGridContainer>
          {images.map((image, index) => (
            <GalleryGridCard key={index} onClick={() => handleImageClick(image)}>
              <GalleryGridImageWrapper>
                <GalleryNextImage 
                  src={image}
                  alt={`Wedding gallery image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) calc(33.333vw - 1rem), calc(33.333vw - 2rem)"
                  quality={85}
                  priority={index < 6}
                  style={{ objectFit: 'cover' }}
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                />
              </GalleryGridImageWrapper>
            </GalleryGridCard>
          ))}
        </GalleryGridContainer>
      ) : (
        // Scroll layout
        <GalleryContainer>
          <GalleryButton onClick={scrollLeft} aria-label="Previous images" className="left-button">
            <ArrowLeftIcon />
          </GalleryButton>
          
          <GalleryScrollContainer ref={scrollContainerRef}>
            {images.map((image, index) => (
              <GalleryCard key={index} onClick={() => handleImageClick(image)}>
                <GalleryImageWrapper>
                  <GalleryNextImage 
                    src={image}
                    alt={`Wedding gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 250px, 300px"
                    quality={85}
                    priority={index < 3}
                    style={{ objectFit: 'cover' }}
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                  />
                </GalleryImageWrapper>
              </GalleryCard>
            ))}
          </GalleryScrollContainer>
          
          <GalleryButton onClick={scrollRight} aria-label="Next images" className="right-button">
            <ArrowRightIcon />
          </GalleryButton>
        </GalleryContainer>
      )}

      {expandedImage && (
        <ExpandedImageOverlay 
          ref={overlayRef} 
          onClick={handleCloseExpanded}
          aria-modal="true"
          role="dialog"
        >
          <ExpandedImageContainer onClick={e => e.stopPropagation()}>
            {isExpandedImageLoading && (
              <LoadingSpinnerContainer>
                <LoadingSpinner />
              </LoadingSpinnerContainer>
            )}
            <ExpandedImageWrapper $isLoading={isExpandedImageLoading}>
              <Image 
                src={expandedImage}
                alt="Expanded wedding gallery image"
                fill
                sizes="90vw"
                quality={90}
                style={{ objectFit: 'contain', background: 'transparent' }}
                draggable={false}
                onContextMenu={e => e.preventDefault()}
                onLoad={handleExpandedImageLoad}
                onError={handleExpandedImageError}
              />
            </ExpandedImageWrapper>
            <CloseButton onClick={handleCloseExpanded} aria-label="Close">×</CloseButton>
          </ExpandedImageContainer>
        </ExpandedImageOverlay>
      )}
    </GallerySectionContainer>
  );
};

const GallerySectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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

const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  
  .left-button {
    position: absolute;
    left: -0.25rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
  
  .right-button {
    position: absolute;
    right: -0.25rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
`;

const GalleryScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
  padding: 1rem 0.5rem;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  /* Add horizontal padding so end items center-align */
  padding-left: calc(50% - 125px);
  padding-right: calc(50% - 125px);
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`;

const GalleryCard = styled.div`
  scroll-snap-align: center;
  flex: 0 0 auto;
  width: 250px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const GalleryImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 ratio (square) */
`;

const GalleryNextImage = styled(Image)`
  border-radius: 8px;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const GalleryButton = styled.button`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.9;
  transition: all 0.3s ease;
  z-index: 2;
  font-size: 2rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  
  &:hover {
    opacity: 1;
    background-color: var(--secondary-color);
    box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const ExpandedImageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpandedImageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  background-color: transparent;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpandedImageWrapper = styled.div<{ $isLoading: boolean }>`
  position: relative;
  width: 90vw;
  height: 90vh;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isLoading }) => $isLoading ? 0.5 : 1};
  transition: opacity 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
  }
`;

const LoadingContainer = styled.div`
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  max-width: 36rem;
  margin: 0 auto;
`;

const ErrorContainer = styled.div`
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  max-width: 36rem;
  margin: 0 auto;
  color: #c62828;
`;

const LoadingSpinnerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
`;

const GalleryGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 800px;
  margin: 2rem auto 0;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0 0.5rem;
    margin-top: 1.5rem;
  }
`;

const GalleryGridCard = styled.div`
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  position: relative;
  width: 100%;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const GalleryGridImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 ratio (square) */
`;

export default GallerySection; 
