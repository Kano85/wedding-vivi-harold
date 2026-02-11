'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import type { GalleryWallItem } from '../../types/wedding';
import type { SiteLanguage } from '../../lib/i18n';

interface GallerySectionProps {
  bgColor?: 'white' | 'beige';
  language: SiteLanguage;
}

interface GalleryApiResponse {
  items: GalleryWallItem[];
  hasMore: boolean;
  nextCursor: number | null;
  error?: string;
}

const PAGE_SIZE = 9;
const MAX_FILES = 10;
const MAX_IMAGE_DIMENSION = 1800;
const JPEG_QUALITY = 0.82;

const GallerySection = ({ bgColor = 'white', language }: GallerySectionProps) => {
  const [items, setItems] = useState<GalleryWallItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  const [guestName, setGuestName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [expandedImage, setExpandedImage] = useState<GalleryWallItem | null>(null);

  const [adminCode, setAdminCode] = useState('');
  const [pendingItems, setPendingItems] = useState<GalleryWallItem[]>([]);
  const [showModerationPanel, setShowModerationPanel] = useState(false);
  const [isModerationLoading, setIsModerationLoading] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [moderatingItemId, setModeratingItemId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const hasMore = nextCursor !== null;

  const t = useMemo(
    () =>
      language === 'es'
        ? {
            title: 'Muro de Fotos',
            loadError: 'No se pudo cargar la galeria.',
            refreshError: 'No se pudo actualizar la galeria.',
            loadMoreError: 'No se pudieron cargar mas fotos.',
            selectPhoto: 'Selecciona al menos una foto.',
            enterAccessCode: 'Ingresa el codigo de acceso para subir fotos.',
            compressing: 'Comprimiendo imagenes...',
            uploading: 'Subiendo imagenes...',
            completeUploadError: 'No se pudo completar la subida.',
            pendingSuccess: 'Fotos subidas. Quedan pendientes de aprobacion.',
            successUpload: 'Fotos subidas correctamente.',
            uploadError: 'Error al subir fotos.',
            enterAdminCode: 'Ingresa codigo admin para abrir moderacion.',
            moderationLoadError: 'No se pudo cargar moderacion.',
            moderationError: 'Error de moderacion.',
            adminRequired: 'Codigo admin requerido.',
            moderationActionError: 'No se pudo moderar la foto.',
            moderationActionFallback: 'Error en moderacion.',
            intro: 'Comparte tus fotos de la boda desde movil y apareceran aqui despues de aprobacion.',
            uploadPhotos: 'Subir fotos',
            yourName: 'Tu nombre (opcional)',
            yourNamePlaceholder: 'Ej: Ana',
            accessCode: 'Codigo de acceso',
            accessCodePlaceholder: 'Ej: BODA120',
            photosMax: 'Fotos (max',
            selectedSuffix: 'foto(s) seleccionada(s).',
            uploadToWall: 'Subir al muro',
            gallery: 'Galeria',
            refresh: 'Actualizar',
            refreshing: 'Actualizando...',
            loadingPhotos: 'Cargando fotos...',
            noApproved: 'Aun no hay fotos aprobadas.',
            photoWallAlt: 'Foto del muro',
            loading: 'Cargando...',
            loadMore: 'Cargar mas',
            moderationPanel: 'Panel de moderacion',
            moderationIntro: 'Solo admin: revisa fotos pendientes y apruebalas con un toque.',
            adminPlaceholder: 'Codigo admin',
            opening: 'Abriendo...',
            openPanel: 'Abrir panel',
            noPending: 'No hay fotos pendientes.',
            pendingAlt: 'Foto pendiente',
            uploadedBy: 'Subio',
            anonymous: 'Subida anonima',
            approve: 'Aprobar',
            reject: 'Rechazar',
            expandedAlt: 'Foto ampliada',
          }
        : {
            title: 'Fotowand',
            loadError: 'Die Galerie konnte nicht geladen werden.',
            refreshError: 'Die Galerie konnte nicht aktualisiert werden.',
            loadMoreError: 'Weitere Fotos konnten nicht geladen werden.',
            selectPhoto: 'Bitte waehle mindestens ein Foto aus.',
            enterAccessCode: 'Bitte gib den Zugangscode ein, um Fotos hochzuladen.',
            compressing: 'Bilder werden komprimiert...',
            uploading: 'Bilder werden hochgeladen...',
            completeUploadError: 'Der Upload konnte nicht abgeschlossen werden.',
            pendingSuccess: 'Fotos hochgeladen. Sie warten auf Freigabe.',
            successUpload: 'Fotos wurden erfolgreich hochgeladen.',
            uploadError: 'Fehler beim Hochladen der Fotos.',
            enterAdminCode: 'Gib den Admin-Code ein, um die Moderation zu oeffnen.',
            moderationLoadError: 'Moderation konnte nicht geladen werden.',
            moderationError: 'Moderationsfehler.',
            adminRequired: 'Admin-Code erforderlich.',
            moderationActionError: 'Foto konnte nicht moderiert werden.',
            moderationActionFallback: 'Fehler bei der Moderationsaktion.',
            intro: 'Teile deine Hochzeitsfotos vom Handy, sie erscheinen nach Freigabe hier.',
            uploadPhotos: 'Fotos hochladen',
            yourName: 'Dein Name (optional)',
            yourNamePlaceholder: 'Bsp: Ana',
            accessCode: 'Zugangscode',
            accessCodePlaceholder: 'Bsp: BODA120',
            photosMax: 'Fotos (max',
            selectedSuffix: 'Foto(s) ausgewaehlt.',
            uploadToWall: 'Zur Wand hochladen',
            gallery: 'Galerie',
            refresh: 'Aktualisieren',
            refreshing: 'Aktualisiert...',
            loadingPhotos: 'Fotos werden geladen...',
            noApproved: 'Noch keine freigegebenen Fotos.',
            photoWallAlt: 'Bild der Fotowand',
            loading: 'Laden...',
            loadMore: 'Mehr laden',
            moderationPanel: 'Moderationsbereich',
            moderationIntro: 'Nur fuer Admin: Pruefe ausstehende Fotos und gib sie frei.',
            adminPlaceholder: 'Admin-Code',
            opening: 'Wird geoeffnet...',
            openPanel: 'Bereich oeffnen',
            noPending: 'Keine ausstehenden Fotos.',
            pendingAlt: 'Ausstehendes Foto',
            uploadedBy: 'Hochgeladen von',
            anonymous: 'Anonymer Upload',
            approve: 'Freigeben',
            reject: 'Ablehnen',
            expandedAlt: 'Vergroessertes Foto',
          },
    [language],
  );

  const galleryTitle = useMemo(() => t.title, [t.title]);

  const loadGallery = useCallback(async (cursor: number, replace = false) => {
    const response = await fetch(`/api/gallery?limit=${PAGE_SIZE}&cursor=${cursor}`);
    const data = (await response.json()) as GalleryApiResponse;

    if (!response.ok || !Array.isArray(data.items)) {
      throw new Error(t.loadError);
    }

    setItems(previousItems => (replace ? data.items : [...previousItems, ...data.items]));
    setNextCursor(data.nextCursor);
  }, [t.loadError]);

  const refreshGallery = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      await loadGallery(0, true);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : t.refreshError);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadGallery, t.refreshError]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsInitialLoading(true);
      setError(null);

      try {
        await loadGallery(0, true);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : t.loadError);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [loadGallery, t.loadError]);

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      await loadGallery(nextCursor || 0);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : t.loadMoreError);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const resizeImageForUpload = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      return file;
    }

    const tempImage = document.createElement('img');
    const objectUrl = URL.createObjectURL(file);

    await new Promise<void>((resolve, reject) => {
      tempImage.onload = () => resolve();
      tempImage.onerror = () => reject(new Error('Image decode failed'));
      tempImage.src = objectUrl;
    });

    const { width, height } = tempImage;
    const ratio = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * ratio));
    const targetHeight = Math.max(1, Math.round(height * ratio));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      URL.revokeObjectURL(objectUrl);
      return file;
    }

    context.drawImage(tempImage, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY);
    });

    URL.revokeObjectURL(objectUrl);

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const normalizedName = file.name.replace(/\.[^/.]+$/, '') || 'wedding-photo';
    return new File([blob], `${normalizedName}.jpg`, { type: 'image/jpeg' });
  };

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files || []);

    if (incomingFiles.length === 0) {
      setSelectedFiles([]);
      return;
    }

    const limitedFiles = incomingFiles.slice(0, MAX_FILES);
    setSelectedFiles(limitedFiles);
    setUploadMessage(null);
    setUploadError(null);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setUploadError(t.selectPhoto);
      return;
    }

    if (!accessCode.trim()) {
      setUploadError(t.enterAccessCode);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadMessage(t.compressing);

    try {
      const compressedFiles = await Promise.all(selectedFiles.map(file => resizeImageForUpload(file)));
      const formData = new FormData();

      compressedFiles.forEach(file => formData.append('files', file));
      formData.append('accessCode', accessCode.trim());
      formData.append('guestName', guestName.trim());

      setUploadMessage(t.uploading);

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      const responseData = (await response.json()) as { message?: string; error?: string; requiresModeration?: boolean };

      if (!response.ok) {
        throw new Error(response.status === 401 ? t.enterAccessCode : t.completeUploadError);
      }

      setSelectedFiles([]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }

      setUploadMessage(responseData.requiresModeration ? t.pendingSuccess : t.successUpload);

      await refreshGallery();
    } catch (submitError) {
      setUploadError(submitError instanceof Error ? submitError.message : t.uploadError);
      setUploadMessage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const loadPendingItems = useCallback(async () => {
    if (!adminCode.trim()) {
      setModerationError(t.enterAdminCode);
      return;
    }

    setIsModerationLoading(true);
    setModerationError(null);

    try {
      const response = await fetch(
        `/api/gallery?status=pending&limit=30&cursor=0&adminCode=${encodeURIComponent(adminCode.trim())}`,
      );

      const data = (await response.json()) as GalleryApiResponse;

      if (!response.ok || !Array.isArray(data.items)) {
        throw new Error(response.status === 401 ? t.adminRequired : t.moderationLoadError);
      }

      setPendingItems(data.items);
      setShowModerationPanel(true);
    } catch (pendingError) {
      setModerationError(pendingError instanceof Error ? pendingError.message : t.moderationError);
      setShowModerationPanel(false);
    } finally {
      setIsModerationLoading(false);
    }
  }, [adminCode, t.adminRequired, t.moderationError, t.moderationLoadError]);

  const moderateItem = async (id: string, action: 'approve' | 'reject') => {
    if (!adminCode.trim()) {
      setModerationError(t.adminRequired);
      return;
    }

    setModeratingItemId(id);
    setModerationError(null);

    try {
      const response = await fetch('/api/gallery/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action,
          adminCode: adminCode.trim(),
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(response.status === 401 ? t.adminRequired : t.moderationActionError);
      }

      setPendingItems(previousItems => previousItems.filter(item => item.id !== id));

      if (action === 'approve') {
        await refreshGallery();
      }
    } catch (moderationActionError) {
      setModerationError(
        moderationActionError instanceof Error ? moderationActionError.message : t.moderationActionFallback,
      );
    } finally {
      setModeratingItemId(null);
    }
  };

  return (
    <GallerySectionContainer $bgColor={bgColor}>
      <SectionTitle>{galleryTitle}</SectionTitle>

      <IntroText>
        {t.intro}
      </IntroText>

      <UploadCard onSubmit={handleUpload}>
        <UploadTitle>{t.uploadPhotos}</UploadTitle>

        <UploadGrid>
          <InputLabel>
            {t.yourName}
            <TextInput
              type="text"
              value={guestName}
              onChange={event => setGuestName(event.target.value)}
              placeholder={t.yourNamePlaceholder}
              maxLength={50}
            />
          </InputLabel>

          <InputLabel>
            {t.accessCode}
            <TextInput
              type="password"
              value={accessCode}
              onChange={event => setAccessCode(event.target.value)}
              placeholder={t.accessCodePlaceholder}
              autoComplete="off"
              required
            />
          </InputLabel>
        </UploadGrid>

        <InputLabel>
          {t.photosMax} {MAX_FILES})
          <FileInput
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleFileSelection}
          />
        </InputLabel>

        {selectedFiles.length > 0 && (
          <FileCount>{selectedFiles.length} {t.selectedSuffix}</FileCount>
        )}

        {uploadMessage && <SuccessText>{uploadMessage}</SuccessText>}
        {uploadError && <ErrorText>{uploadError}</ErrorText>}

        <UploadButton type="submit" disabled={isUploading || selectedFiles.length === 0}>
          {isUploading ? t.uploading : t.uploadToWall}
        </UploadButton>
      </UploadCard>

      <GalleryHeader>
        <h3>{t.gallery}</h3>
        <RefreshButton type="button" onClick={refreshGallery} disabled={isRefreshing || isInitialLoading}>
          {isRefreshing ? t.refreshing : t.refresh}
        </RefreshButton>
      </GalleryHeader>

      {isInitialLoading ? (
        <StatusCard>{t.loadingPhotos}</StatusCard>
      ) : error ? (
        <StatusCard $error>{error}</StatusCard>
      ) : items.length === 0 ? (
        <StatusCard>{t.noApproved}</StatusCard>
      ) : (
        <GalleryGrid>
          {items.map(item => (
            <GalleryItemCard key={item.id} onClick={() => setExpandedImage(item)}>
              <Image
                src={item.url}
                alt={t.photoWallAlt}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                style={{ objectFit: 'cover' }}
              />
            </GalleryItemCard>
          ))}
        </GalleryGrid>
      )}

      {hasMore && (
        <LoadMoreButton type="button" onClick={handleLoadMore} disabled={isLoadingMore}>
          {isLoadingMore ? t.loading : t.loadMore}
        </LoadMoreButton>
      )}

      <ModerationCard>
        <UploadTitle>{t.moderationPanel}</UploadTitle>
        <ModerationText>
          {t.moderationIntro}
        </ModerationText>

        <ModerationControls>
          <TextInput
            type="password"
            value={adminCode}
            onChange={event => setAdminCode(event.target.value)}
            placeholder={t.adminPlaceholder}
            autoComplete="off"
          />
          <SecondaryButton type="button" onClick={loadPendingItems} disabled={isModerationLoading}>
            {isModerationLoading ? t.opening : t.openPanel}
          </SecondaryButton>
        </ModerationControls>

        {moderationError && <ErrorText>{moderationError}</ErrorText>}

        {showModerationPanel && (
          <ModerationGrid>
            {pendingItems.length === 0 ? (
              <StatusCard>{t.noPending}</StatusCard>
            ) : (
              pendingItems.map(item => (
                <ModerationItem key={item.id}>
                  <ModerationImageWrapper>
                    <Image
                      src={item.url}
                      alt={t.pendingAlt}
                      fill
                      sizes="(max-width: 640px) 45vw, 220px"
                      style={{ objectFit: 'cover' }}
                    />
                  </ModerationImageWrapper>
                  <ModerationMeta>
                    {item.guestName ? `${t.uploadedBy}: ${item.guestName}` : t.anonymous}
                  </ModerationMeta>
                  <ModerationActions>
                    <ApproveButton
                      type="button"
                      disabled={moderatingItemId === item.id}
                      onClick={() => moderateItem(item.id, 'approve')}
                    >
                      {t.approve}
                    </ApproveButton>
                    <RejectButton
                      type="button"
                      disabled={moderatingItemId === item.id}
                      onClick={() => moderateItem(item.id, 'reject')}
                    >
                      {t.reject}
                    </RejectButton>
                  </ModerationActions>
                </ModerationItem>
              ))
            )}
          </ModerationGrid>
        )}
      </ModerationCard>

      {expandedImage && (
        <LightboxOverlay onClick={() => setExpandedImage(null)}>
          <LightboxImageWrapper onClick={event => event.stopPropagation()}>
            <Image
              src={expandedImage.url}
              alt={t.expandedAlt}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
            />
            <CloseButton type="button" onClick={() => setExpandedImage(null)}>
              x
            </CloseButton>
          </LightboxImageWrapper>
        </LightboxOverlay>
      )}
    </GallerySectionContainer>
  );
};

const GallerySectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 4rem 1rem;
  text-align: center;
  background-color: ${props => (props.$bgColor === 'beige' ? '#F8F6F2' : 'white')};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.7rem;
  font-weight: 600;
`;

const IntroText = styled.p`
  margin: 0.75rem auto 2rem;
  max-width: 42rem;
  color: #4a5568;
  font-size: 0.96rem;
  line-height: 1.6;
`;

const UploadCard = styled.form`
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 14px;
  padding: 1rem;
  max-width: 48rem;
  margin: 0 auto 1.75rem;
  text-align: left;
`;

const UploadTitle = styled.h3`
  margin: 0 0 0.8rem;
  font-size: 1rem;
  font-weight: 600;
`;

const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #374151;
  font-size: 0.88rem;
`;

const TextInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.7rem 0.75rem;
  font-size: 0.92rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 2px rgba(170, 124, 102, 0.15);
  }
`;

const FileInput = styled.input`
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 0.65rem;
  font-size: 0.86rem;
  background: #fcfcfc;
`;

const FileCount = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.86rem;
  color: #4b5563;
`;

const SuccessText = styled.p`
  margin: 0.65rem 0 0;
  color: #166534;
  font-size: 0.86rem;
`;

const ErrorText = styled.p`
  margin: 0.65rem 0 0;
  color: #b91c1c;
  font-size: 0.86rem;
`;

const UploadButton = styled.button`
  margin-top: 0.8rem;
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 0.72rem 0.85rem;
  background: var(--secondary-color);
  color: white;
  font-weight: 600;
  font-size: 0.93rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const GalleryHeader = styled.div`
  width: min(100%, 68rem);
  margin: 0 auto 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const RefreshButton = styled.button`
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: white;
  color: #374151;
  padding: 0.4rem 0.8rem;
  font-size: 0.84rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GalleryGrid = styled.div`
  width: min(100%, 68rem);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
`;

const GalleryItemCard = styled.button`
  position: relative;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  padding: 0;
  padding-bottom: 100%;
  background: #f3f4f6;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--secondary-color);
    outline-offset: 2px;
  }
`;

const LoadMoreButton = styled.button`
  margin-top: 1rem;
  border: 1px solid var(--secondary-color);
  border-radius: 999px;
  background: white;
  color: var(--secondary-color);
  padding: 0.55rem 1.1rem;
  font-size: 0.9rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusCard = styled.div<{ $error?: boolean }>`
  width: min(100%, 68rem);
  margin: 0 auto;
  border-radius: 10px;
  padding: 1rem;
  background: white;
  border: 1px solid ${props => (props.$error ? '#f5c2c2' : '#e5e7eb')};
  color: ${props => (props.$error ? '#b91c1c' : '#374151')};
  text-align: center;
`;

const ModerationCard = styled.div`
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 14px;
  padding: 1rem;
  max-width: 48rem;
  margin: 2rem auto 0;
  text-align: left;
`;

const ModerationText = styled.p`
  margin: 0 0 0.7rem;
  color: #4b5563;
  font-size: 0.86rem;
`;

const ModerationControls = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SecondaryButton = styled.button`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  color: #111827;
  padding: 0.68rem 0.85rem;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ModerationGrid = styled.div`
  margin-top: 0.8rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.8rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ModerationItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.55rem;
`;

const ModerationImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

const ModerationMeta = styled.p`
  margin: 0.5rem 0;
  color: #4b5563;
  font-size: 0.82rem;
`;

const ModerationActions = styled.div`
  display: flex;
  gap: 0.55rem;
`;

const ApproveButton = styled.button`
  flex: 1;
  border: none;
  border-radius: 8px;
  background: #166534;
  color: white;
  padding: 0.5rem;
  font-size: 0.82rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RejectButton = styled.button`
  flex: 1;
  border: none;
  border-radius: 8px;
  background: #b91c1c;
  color: white;
  padding: 0.5rem;
  font-size: 0.82rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const LightboxImageWrapper = styled.div`
  position: relative;
  width: min(92vw, 900px);
  height: min(88vh, 900px);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  border: none;
  border-radius: 999px;
  width: 2rem;
  height: 2rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
`;

export default GallerySection;
