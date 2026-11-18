/**
 * Google Drive Cloud Architecture Connector
 * Section 29: Architecture preparation for Google Drive integration
 * Supports PDF, DOCX, XLSX, JPG, PNG, MP4 files across Admin, Relations, and Disaster.
 *
 * NOTE: Does NOT hardcode API keys or secrets in frontend code.
 * Ready for future OAuth / backend proxy integration.
 */

export type SupportedFileType = 'PDF' | 'DOCX' | 'XLSX' | 'JPG' | 'PNG' | 'MP4';

export interface DriveFileMetadata {
  id: string;
  name: string;
  fileType: SupportedFileType;
  mimeType: string;
  sizeBytes: number;
  department: 'admin' | 'relations' | 'disaster' | 'volunteer';
  driveFileId?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  uploadedAt: string;
  uploadedBy?: string;
  syncStatus: 'synced' | 'local_only' | 'pending_sync' | 'error';
}

class GoogleDriveService {
  private isConfigured: boolean = false;
  private rootFolderId?: string;

  public initialize(rootFolderId?: string) {
    this.rootFolderId = rootFolderId;
    this.isConfigured = Boolean(rootFolderId);
  }

  public getConfigurationStatus() {
    return {
      isReady: this.isConfigured,
      rootFolderId: this.rootFolderId,
      supportedExtensions: ['.pdf', '.docx', '.xlsx', '.jpg', '.png', '.mp4'],
    };
  }

  public async uploadDocument(
    _file: File,
    department: 'admin' | 'relations' | 'disaster' | 'volunteer'
  ): Promise<DriveFileMetadata> {
    // Graceful preparation: simulate structured response or prepare payload for server proxy
    const fakeId = `DRIVE-${Date.now().toString(36).toUpperCase()}`;
    return {
      id: fakeId,
      name: _file.name,
      fileType: this.determineFileType(_file.name),
      mimeType: _file.type || 'application/octet-stream',
      sizeBytes: _file.size,
      department,
      syncStatus: 'local_only',
      uploadedAt: new Date().toISOString(),
    };
  }

  public determineFileType(fileName: string): SupportedFileType {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'PDF';
    if (ext === 'docx' || ext === 'doc') return 'DOCX';
    if (ext === 'xlsx' || ext === 'xls') return 'XLSX';
    if (ext === 'jpg' || ext === 'jpeg') return 'JPG';
    if (ext === 'png') return 'PNG';
    if (ext === 'mp4' || ext === 'mov') return 'MP4';
    return 'PDF';
  }
}

export const googleDriveService = new GoogleDriveService();
