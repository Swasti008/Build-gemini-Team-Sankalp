import { NextResponse } from 'next/server';
import twilio from 'twilio';
import https from 'https';

function makeHttpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: options.method,
      headers: options.headers
    });
    let data = '';
    request.on('response', (response) => {
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch {
            resolve({ raw: data, url: url, contentType: response.headers['content-type'] });
          }
        } else {
          reject(new Error(`API error (${response.statusCode}): ${data}`));
        }
      });
    });
    request.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });
    if (options.body) {
      request.write(options.body);
    }
    request.end();
  });
}

async function createUltravoxCall(
  apiKey,
  agentId,
  templateContext = {},
  recordingEnabled = true,
  maxDuration = "1800s"
) {
  if (!apiKey) {
    throw new Error('Missing API key: ultravoxApiKey is required for Ultravox calls');
  }
  if (!agentId) {
    throw new Error('Missing configuration: ultravoxAgentId is required for agent-based calls');
  }

  const requestBody = {
    templateContext,
    recordingEnabled,
    medium: { twilio: {} },
    maxDuration,
    metadata: { source: 'voice-assistant', version: '1.0.0' }
  };

  console.log(`Creating agent-based call with agent ID: ${agentId}`);
  
  try {
    const url = `https://api.ultravox.ai/api/agents/${agentId}/calls`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(requestBody)
    };
    const response = await makeHttpsRequest(url, options);
    return response;
  } catch (error) {
    console.error('Error creating Ultravox agent-based call:', error);
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        throw new Error(`Agent not found: The agent ID '${agentId}' does not exist in your Ultravox account. Please verify the agent ID.`);
      } else if (error.message.includes('401')) {
        throw new Error('Authentication failed: Your Ultravox API key is invalid or expired.');
      } else if (error.message.includes('400')) {
        throw new Error(`Validation error: ${error.message}. Check that your template variables match what the agent expects.`);
      }
    }
    throw error;
  }
}

async function makeCall(phoneNumber, options) {
  try {
    if (!phoneNumber) {
      return { success: false, message: 'Phone number is required', error: 'Missing phone number' };
    }

    const twilioClient = twilio(options.twilioAccountSid, options.twilioAuthToken);
    const templateContext = options.templateContext || {};
    
    console.log(`Making outbound call to: ${phoneNumber}`);
    
    const ultravoxResponse = await createUltravoxCall(
      options.ultravoxApiKey,
      options.ultravoxAgentId,
      templateContext,
      options.recordingEnabled,
      options.maxDuration
    );

    if (!ultravoxResponse.joinUrl) {
      throw new Error('No joinUrl received from Ultravox API');
    }

    console.log('Got Ultravox joinUrl:', ultravoxResponse.joinUrl);

    const call = await twilioClient.calls.create({
      twiml: `<Response><Connect><Stream url="${ultravoxResponse.joinUrl}"/></Connect></Response>`,
      to: phoneNumber,
      from: options.twilioPhoneNumber
    });

    console.log('Twilio call initiated:', call.sid);
    
    return {
      success: true,
      ultravoxCallId: ultravoxResponse.callId,
      twilioCallSid: call.sid,
      message: 'Call initiated successfully'
    };
  } catch (error) {
    console.error('Error making call:', error);
    return {
      success: false,
      message: 'Failed to make call',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phoneNumber, templateContext } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    const result = await makeCall(phoneNumber, {
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
      ultravoxApiKey: process.env.ULTRAVOX_API_KEY,
      ultravoxAgentId: process.env.ULTRAVOX_AGENT_ID,
      templateContext: templateContext || {},
      recordingEnabled: true,
      maxDuration: "1800s"
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}