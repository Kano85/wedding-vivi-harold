import { NextResponse } from 'next/server';
import { weddingConfig } from '../../../src/config/wedding-config';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, side, isAttending, guestCount, hasMeal, timestamp } = data;
    
    // Build a compact Slack message
    const slackMessage: any = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "💌 New RSVP Response",
            emoji: true
          }
        },
        {
          type: "divider"
        }
      ]
    };

    // Base information in one block
    slackMessage.blocks.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Name:* ${name} (${side || 'Unspecified'})`
        },
        {
          type: "mrkdwn",
          text: `*Attendance:* ${isAttending ? '✅ Attending' : '❌ Not attending'}`
        }
      ]
    });
    
    // Add guest/meal details only when attending
    if (isAttending) {
      const additionalFields = [
        {
          type: "mrkdwn",
          text: `*Guest count:* ${guestCount}`
        }
      ];
      
      // Only include meal option when enabled
      if (weddingConfig.rsvp.showMealOption) {
        additionalFields.push({
          type: "mrkdwn",
          text: `*Meal:* ${hasMeal ? '✅ Having a meal' : '❌ No meal'}`
        });
      }
      
      slackMessage.blocks.push({
        type: "section",
        fields: additionalFields
      });
    }
    
    // Format submission time in KST
    const koreanTime = timestamp ? new Date(timestamp) : new Date();
    const koreanTimeString = koreanTime.toLocaleString('en-US', { 
      timeZone: 'Asia/Seoul',
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false
    });
    
    // Add timestamp info
    slackMessage.blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Submitted at: ${koreanTimeString} (KST)`
        }
      ]
    });
    
    // Send to Slack only when a webhook URL is provided
    if (weddingConfig.slack.webhookUrl) {
      try {
        const slackResponse = await fetch(weddingConfig.slack.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slackMessage),
        });
        
        if (!slackResponse.ok) {
          console.error(`Slack API error: ${slackResponse.statusText}`);
        }
      } catch (error) {
        console.error('Slack send error:', error);
        // Return success to the client even if Slack send fails
      }
    } else {
      console.log('Slack webhook URL is not configured.');
      console.log('RSVP data:', data);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RSVP processing error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'An error occurred while processing the RSVP.' 
    }, { status: 500 });
  }
} 
