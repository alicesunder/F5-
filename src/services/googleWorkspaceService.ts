import { getAccessToken } from './googleAuthService';

// Interfaces for Google Workspace entities

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  owners?: Array<{ displayName?: string; emailAddress?: string }>;
}

export interface GoogleDocItem {
  id: string;
  title: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  isUnread?: boolean;
  labels?: string[];
  bodyHtml?: string;
  bodyText?: string;
}

export interface ChatSpaceItem {
  name: string; // e.g. "spaces/AAAAAAAAAA"
  displayName?: string;
  type?: string;
  spaceType?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE';
  spaceThreadingState?: string;
}

export interface ChatMessageItem {
  name: string;
  text?: string;
  createTime?: string;
  sender?: {
    name?: string;
    displayName?: string;
    type?: string;
    avatarUrl?: string;
  };
}

export interface PickedFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;
}

// ----------------------------------------------------
// Google Drive API
// ----------------------------------------------------

export async function fetchDriveFiles(query?: string, pageSize = 30): Promise<DriveFileItem[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace ก่อนเข้าถึง Google Drive');

  let q = "trashed = false";
  if (query && query.trim()) {
    q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
  }

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', q);
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set(
    'fields',
    'files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink,thumbnailLink,owners)'
  );
  url.searchParams.set('orderBy', 'modifiedTime desc');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `เกิดข้อผิดพลาดในการโหลดไฟล์ Google Drive (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

export async function uploadDriveFile(file: File, description = ''): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace ก่อนอัปโหลดไฟล์');

  const metadata = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    description: description || 'เอกสารราชการนำเข้าจากศูนย์ปฏิบัติการ',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  const fileContentBase64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${file.type || 'application/octet-stream'}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    fileContentBase64 +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,modifiedTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `เกิดข้อผิดพลาดในการอัปโหลดไฟล์ (${res.status})`);
  }

  return await res.json();
}

export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 204) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถลบไฟล์ได้ (${res.status})`);
  }
}

// ----------------------------------------------------
// Google Picker API
// ----------------------------------------------------

declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

/**
 * Load Google Picker Script if not already loaded
 */
export async function loadGooglePickerApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.picker) {
      resolve();
      return;
    }
    if (!window.gapi) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.onload = () => {
        window.gapi.load('picker', {
          callback: () => resolve(),
          onerror: () => reject(new Error('Failed to load Google Picker library')),
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.body.appendChild(script);
    } else {
      window.gapi.load('picker', {
        callback: () => resolve(),
        onerror: () => reject(new Error('Failed to load Google Picker library')),
      });
    }
  });
}

/**
 * Launch Google Picker widget with OAuth token
 */
export async function launchGooglePicker(
  onFilePicked: (file: PickedFile) => void,
  onError?: (errorMsg: string) => void
): Promise<void> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('กรุณาเข้าสู่ระบบ Google Workspace ก่อนเปิด Google Picker');
    }

    await loadGooglePickerApi();

    if (!window.google?.picker) {
      throw new Error('ระบบ Google Picker ไม่พร้อมใช้งานในเบราว์เซอร์นี้');
    }

    // Determine correct origin to prevent iframe security warnings
    const pickerOrigin =
      window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
        ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
        : window.location.origin;

    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .addView(window.google.picker.ViewId.DOCS_IMAGES)
      .addView(new window.google.picker.DocsUploadView())
      .setOAuthToken(token)
      .setOrigin(pickerOrigin)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED && data.docs && data.docs.length > 0) {
          const doc = data.docs[0];
          onFilePicked({
            id: doc.id,
            name: doc.name,
            url: doc.url,
            mimeType: doc.mimeType,
            sizeBytes: doc.sizeBytes,
          });
        }
      })
      .build();

    picker.setVisible(true);
  } catch (err: any) {
    console.error('Error opening Google Picker:', err);
    if (onError) onError(err.message || 'ไม่สามารถเปิด Google Picker ได้');
  }
}

// ----------------------------------------------------
// Google Docs API
// ----------------------------------------------------

export async function fetchGoogleDocs(): Promise<DriveFileItem[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace ก่อนเข้าถึง Google Docs');

  const q = "mimeType = 'application/vnd.google-apps.document' and trashed = false";
  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', q);
  url.searchParams.set('pageSize', '30');
  url.searchParams.set(
    'fields',
    'files(id,name,mimeType,modifiedTime,webViewLink,iconLink,owners)'
  );
  url.searchParams.set('orderBy', 'modifiedTime desc');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `เกิดข้อผิดพลาดในการโหลด Google Docs (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

export async function createGoogleDocument(title: string, bodyContent?: string): Promise<{ documentId: string; title: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace ก่อนสร้างเอกสาร');

  // 1. Create blank document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถสร้างเอกสาร Google Docs ได้ (${createRes.status})`);
  }

  const newDoc = await createRes.json();
  const documentId = newDoc.documentId;

  // 2. Insert initial content if provided
  if (bodyContent && bodyContent.trim()) {
    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: bodyContent + '\n',
            },
          },
        ],
      }),
    });
  }

  return { documentId, title: newDoc.title || title };
}

export async function getGoogleDocumentDetails(documentId: string): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace');

  const res = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถเปิดอ่านเนื้อหาเอกสาร (${res.status})`);
  }

  return await res.json();
}

// ----------------------------------------------------
// Google Chat API
// ----------------------------------------------------

export async function fetchChatSpaces(): Promise<ChatSpaceItem[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace ก่อนเข้าถึง Google Chat');

  const res = await fetch('https://chat.googleapis.com/v1/spaces?pageSize=50', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถดึงห้องสนทนา Google Chat ได้ (${res.status})`);
  }

  const data = await res.json();
  return data.spaces || [];
}

export async function fetchChatMessages(spaceName: string): Promise<ChatMessageItem[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace');

  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=30`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถดึงข้อความสนทนาได้ (${res.status})`);
  }

  const data = await res.json();
  return data.messages || [];
}

export async function sendChatMessage(spaceName: string, text: string): Promise<ChatMessageItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace');

  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถส่งข้อความได้ (${res.status})`);
  }

  return await res.json();
}

export async function createChatSpace(displayName: string): Promise<ChatSpaceItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace');

  const res = await fetch('https://chat.googleapis.com/v1/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spaceType: 'SPACE',
      displayName,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถสร้างห้องสนทนาได้ (${res.status})`);
  }

  return await res.json();
}

// ----------------------------------------------------
// Gmail API
// ----------------------------------------------------

export async function fetchGmailMessages(maxResults = 25, q = ''): Promise<GmailMessageItem[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace ก่อนเข้าถึง Gmail');

  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', maxResults.toString());
  if (q) url.searchParams.set('q', q);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถดึงรายการอีเมล Gmail ได้ (${res.status})`);
  }

  const data = await res.json();
  const rawList: Array<{ id: string; threadId: string }> = data.messages || [];

  // Fetch metadata details for first 12 messages in parallel
  const details = await Promise.all(
    rawList.slice(0, 15).map(async (msg): Promise<GmailMessageItem | null> => {
      try {
        const itemRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!itemRes.ok) return null;
        const itemData = await itemRes.json();
        const headers: Array<{ name: string; value: string }> = itemData.payload?.headers || [];

        const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || '(ไม่มีหัวข้อ)';
        const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || '';
        const to = headers.find((h) => h.name.toLowerCase() === 'to')?.value || '';
        const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || '';
        const isUnread = itemData.labelIds?.includes('UNREAD');

        return {
          id: itemData.id,
          threadId: itemData.threadId,
          snippet: itemData.snippet || '',
          subject,
          from,
          to,
          date,
          isUnread,
          labels: itemData.labelIds || [],
        };
      } catch {
        return null;
      }
    })
  );

  return details.filter((m): m is GmailMessageItem => m !== null);
}

export async function fetchGmailMessageDetail(messageId: string): Promise<GmailMessageItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace');

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ไม่สามารถอ่านรายละเอียดอีเมล (${res.status})`);
  }

  const data = await res.json();
  const headers: Array<{ name: string; value: string }> = data.payload?.headers || [];
  const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || '(ไม่มีหัวข้อ)';
  const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || '';
  const to = headers.find((h) => h.name.toLowerCase() === 'to')?.value || '';
  const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || '';

  // Extract body
  let bodyText = data.snippet || '';
  if (data.payload?.parts) {
    for (const part of data.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        bodyText = decodeBase64Url(part.body.data);
        break;
      }
    }
  } else if (data.payload?.body?.data) {
    bodyText = decodeBase64Url(data.payload.body.data);
  }

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet,
    subject,
    from,
    to,
    date,
    bodyText,
    labels: data.labelIds || [],
  };
}

export async function sendGmailEmail(params: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ id: string; threadId: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Workspace ก่อนส่งอีเมล');

  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(params.subject)))}?=`;
  const emailLines = [
    `To: ${params.to}`,
    `Subject: ${utf8Subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    params.body,
  ];

  const emailRaw = emailLines.join('\r\n');
  const base64Encoded = btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64Encoded }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `ส่งอีเมลไม่สำเร็จ (${res.status})`);
  }

  return await res.json();
}

// Base64URL helper
function decodeBase64Url(input: string): string {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return decodeURIComponent(escape(decoded));
  } catch {
    return input;
  }
}
