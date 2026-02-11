'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';
import type { SiteLanguage } from '../../lib/i18n';

interface RsvpSectionProps {
  bgColor?: 'white' | 'beige';
  language: SiteLanguage;
}

const RsvpSection = ({ bgColor = 'white', language }: RsvpSectionProps) => {
  const [formData, setFormData] = useState({
    name: '',
    isAttending: null as boolean | null,
    guestCount: 1,
    side: '' as 'BRIDE' | 'GROOM' | '',
    hasMeal: null as boolean | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Meal option display setting
  const showMealOption = weddingConfig.rsvp?.showMealOption ?? true;
  const t = language === 'es'
    ? {
        title: 'RSVP',
        description: 'Por favor dinos si puedes acompanarnos en este dia especial.\nTu respuesta nos ayuda a prepararnos mejor.\nAgradecemos mucho tu confirmacion.',
        name: 'Nombre',
        namePlaceholder: 'Escribe tu nombre',
        side: 'Lado',
        groomSide: 'Lado del novio',
        brideSide: 'Lado de la novia',
        attendance: 'Asistencia',
        attending: 'Asistire',
        notAttending: 'No asistire',
        guestCount: 'Numero de invitados',
        meal: 'Comida',
        withMeal: 'Con comida',
        noMeal: 'Sin comida',
        submit: 'Enviar RSVP',
        submitting: 'Enviando...',
        validationError: 'Ingresa tu nombre, asistencia y lado.',
        mealError: 'Selecciona tu opcion de comida.',
        submitSuccess: 'Tu RSVP fue enviado correctamente. Gracias!',
        submitFailed: 'Hubo un error al enviar tu RSVP. Intentalo de nuevo.',
        brideSidePayload: 'Lado de la novia',
        groomSidePayload: 'Lado del novio',
      }
    : {
        title: 'RSVP',
        description: 'Bitte teile uns mit, ob du an unserem besonderen Tag dabei sein kannst.\nDeine Antwort hilft uns bei der Planung.\nVielen Dank fuer deine Rueckmeldung.',
        name: 'Name',
        namePlaceholder: 'Gib deinen Namen ein',
        side: 'Seite',
        groomSide: 'Seite des Braeutigams',
        brideSide: 'Seite der Braut',
        attendance: 'Teilnahme',
        attending: 'Ich komme',
        notAttending: 'Ich komme nicht',
        guestCount: 'Anzahl Gaeste',
        meal: 'Essen',
        withMeal: 'Mit Essen',
        noMeal: 'Ohne Essen',
        submit: 'RSVP senden',
        submitting: 'Wird gesendet...',
        validationError: 'Bitte gib deinen Namen, Teilnahme und Seite an.',
        mealError: 'Bitte waehle deine Essensoption.',
        submitSuccess: 'Dein RSVP wurde erfolgreich gesendet. Danke!',
        submitFailed: 'Beim Senden gab es einen Fehler. Bitte versuche es erneut.',
        brideSidePayload: 'Seite der Braut',
        groomSidePayload: 'Seite des Braeutigams',
      };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAttendingChange = (value: boolean) => {
    setFormData({
      ...formData,
      isAttending: value,
      guestCount: value ? 1 : 0,
      // If not attending, clear meal selection
      hasMeal: value ? formData.hasMeal : null,
    });
  };

  const handleSideChange = (side: 'BRIDE' | 'GROOM') => {
    setFormData({
      ...formData,
      side,
    });
  };

  const handleMealChange = (value: boolean) => {
    setFormData({
      ...formData,
      hasMeal: value,
    });
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      guestCount: parseInt(e.target.value, 10),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.isAttending === null || !formData.side) {
      setSubmitStatus({
        success: false,
        message: t.validationError,
      });
      return;
    }
    
    if (showMealOption && formData.isAttending && formData.hasMeal === null) {
      setSubmitStatus({
        success: false,
        message: t.mealError,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Capture current time
      const now = new Date();
      
      // Send RSVP to Slack webhook
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          side: formData.side === 'BRIDE' ? t.brideSidePayload : t.groomSidePayload,
          isAttending: formData.isAttending,
          guestCount: formData.isAttending ? formData.guestCount : 0,
          hasMeal: formData.isAttending ? formData.hasMeal : false,
          timestamp: now.toISOString(),
        }),
      });
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: t.submitSuccess,
        });
        setFormData({
          name: '',
          isAttending: null,
          guestCount: 1,
          side: '',
          hasMeal: null,
        });
      } else {
        throw new Error('Server response error');
      }
    } catch (error) {
      console.error('RSVP submission error:', error);
      setSubmitStatus({
        success: false,
        message: t.submitFailed,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RsvpSectionContainer $bgColor={bgColor}>
      <SectionTitle>{t.title}</SectionTitle>
      
      <RsvpDescription>{t.description}</RsvpDescription>
      
      {submitStatus && (
        <StatusMessage $success={submitStatus.success.toString()}>
          {submitStatus.message}
        </StatusMessage>
      )}
      
      <RsvpForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">{t.name}</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.namePlaceholder}
            required
          />
        </FormGroup>
        
        <FormRow>
          <FormColumn>
            <Label as="p">{t.side}</Label>
            <AttendanceButtons>
              <AttendanceButton 
                type="button"
                $selected={formData.side === 'GROOM'}
                onClick={() => handleSideChange('GROOM')}
              >
                {t.groomSide}
              </AttendanceButton>
              <AttendanceButton 
                type="button"
                $selected={formData.side === 'BRIDE'}
                onClick={() => handleSideChange('BRIDE')}
              >
                {t.brideSide}
              </AttendanceButton>
            </AttendanceButtons>
          </FormColumn>

          <FormColumn>
            <Label as="p">{t.attendance}</Label>
            <AttendanceButtons>
              <AttendanceButton 
                type="button"
                $selected={formData.isAttending === true}
                onClick={() => handleAttendingChange(true)}
              >
                {t.attending}
              </AttendanceButton>
              <AttendanceButton 
                type="button"
                $selected={formData.isAttending === false}
                onClick={() => handleAttendingChange(false)}
              >
                {t.notAttending}
              </AttendanceButton>
            </AttendanceButtons>
          </FormColumn>
        </FormRow>
        
        {formData.isAttending && (
          <FormRow>
            <FormColumn>
              <Label htmlFor="guestCount">{t.guestCount}</Label>
              <Select
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleGuestCountChange}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Select>
            </FormColumn>
            
            {showMealOption && (
              <FormColumn>
                <Label as="p">{t.meal}</Label>
                <AttendanceButtons>
                  <AttendanceButton 
                    type="button"
                    $selected={formData.hasMeal === true}
                    onClick={() => handleMealChange(true)}
                  >
                    {t.withMeal}
                  </AttendanceButton>
                  <AttendanceButton 
                    type="button"
                    $selected={formData.hasMeal === false}
                    onClick={() => handleMealChange(false)}
                  >
                    {t.noMeal}
                  </AttendanceButton>
                </AttendanceButtons>
              </FormColumn>
            )}
          </FormRow>
        )}
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? t.submitting : t.submit}
        </SubmitButton>
      </RsvpForm>
    </RsvpSectionContainer>
  );
};

const RsvpSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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

const RsvpDescription = styled.p`
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: var(--text-medium);
  line-height: 1.6;
  white-space: pre-line;
`;

const StatusMessage = styled.div<{ $success: string }>`
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
  background-color: ${props => props.$success === 'true' ? '#e7f3eb' : '#fbedec'};
  color: ${props => props.$success === 'true' ? '#2e7d32' : '#c62828'};
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
`;

const RsvpForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--text-dark);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: none;
  border-bottom: 1px solid var(--secondary-color);
  font-size: 1rem;
  background-color: transparent;
  
  &:focus {
    outline: none;
    border-bottom: 1px solid var(--text-dark);
  }
`;

const AttendanceButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AttendanceButton = styled.button<{ $selected?: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.$selected ? 'var(--secondary-color)' : '#ccc'};
  border-radius: 4px;
  background-color: ${props => props.$selected ? 'var(--secondary-color)' : 'transparent'};
  color: ${props => props.$selected ? 'white' : 'var(--text-medium)'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: var(--secondary-color);
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

const Select = styled.select`
  padding: 0.75rem;
  border: none;
  border-bottom: 1px solid var(--secondary-color);
  font-size: 1rem;
  background-color: transparent;
  
  &:focus {
    outline: none;
    border-bottom: 1px solid var(--text-dark);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--secondary-color);
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--text-dark);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
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
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export default RsvpSection; 
