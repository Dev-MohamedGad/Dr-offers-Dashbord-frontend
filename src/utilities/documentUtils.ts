/**
 * Document Utilities
 * Helper functions for handling document operations in the application
 */

export interface DocumentInfo {
  type: string;
  extension: string;
  name: string;
  icon: string;
  canPreview: boolean;
}

/**
 * Get file extension from URL
 */
export const getFileExtension = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = pathname.split('.').pop()?.toLowerCase() || '';
    return extension;
  } catch {
    return '';
  }
};

/**
 * Get document information based on URL
 */
export const getDocumentInfo = (url: string): DocumentInfo => {
  const extension = getFileExtension(url);
  
  const documentTypes: Record<string, DocumentInfo> = {
    pdf: {
      type: 'pdf',
      extension: 'pdf',
      name: 'PDF Document',
      icon: 'cilDescription',
      canPreview: true
    },
    jpg: {
      type: 'image',
      extension: 'jpg',
      name: 'JPEG Image',
      icon: 'cilZoom',
      canPreview: true
    },
    jpeg: {
      type: 'image',
      extension: 'jpeg',
      name: 'JPEG Image',
      icon: 'cilZoom',
      canPreview: true
    },
    png: {
      type: 'image',
      extension: 'png',
      name: 'PNG Image',
      icon: 'cilZoom',
      canPreview: true
    },
    gif: {
      type: 'image',
      extension: 'gif',
      name: 'GIF Image',
      icon: 'cilZoom',
      canPreview: true
    },
    webp: {
      type: 'image',
      extension: 'webp',
      name: 'WebP Image',
      icon: 'cilZoom',
      canPreview: true
    },
    doc: {
      type: 'document',
      extension: 'doc',
      name: 'Word Document',
      icon: 'cilDescription',
      canPreview: false
    },
    docx: {
      type: 'document',
      extension: 'docx',
      name: 'Word Document',
      icon: 'cilDescription',
      canPreview: false
    },
    xls: {
      type: 'spreadsheet',
      extension: 'xls',
      name: 'Excel Document',
      icon: 'cilDescription',
      canPreview: false
    },
    xlsx: {
      type: 'spreadsheet',
      extension: 'xlsx',
      name: 'Excel Document',
      icon: 'cilDescription',
      canPreview: false
    }
  };

  return documentTypes[extension] || {
    type: 'unknown',
    extension,
    name: 'Document',
    icon: 'cilDescription',
    canPreview: false
  };
};

/**
 * Validate if a URL is accessible
 */
export const validateDocumentUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Handle document viewing with proper error handling
 */
export const handleDocumentView = async (
  documentUrl: string, 
  fileName: string = 'document'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate URL format
    const url = new URL(documentUrl);
    
    // Get document info
    const docInfo = getDocumentInfo(documentUrl);
    
    if (docInfo.canPreview) {
      // For previewable files, open in new tab
      window.open(documentUrl, '_blank');
      return { success: true };
    } else {
      // For non-previewable files, trigger download
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `${fileName}.${docInfo.extension}`;
      link.click();
      return { success: true };
    }
  } catch (error) {
    console.error('Error viewing document:', error);
    return { 
      success: false, 
      error: 'Unable to open document. The file may be corrupted or the URL is invalid.' 
    };
  }
};

/**
 * Handle document download
 */
export const handleDocumentDownload = (
  documentUrl: string, 
  fileName: string = 'document'
): { success: boolean; error?: string } => {
  try {
    const docInfo = getDocumentInfo(documentUrl);
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `${fileName}.${docInfo.extension}`;
    link.click();
    return { success: true };
  } catch (error) {
    console.error('Error downloading document:', error);
    return { 
      success: false, 
      error: 'Unable to download document. Please try again.' 
    };
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file size from URL (requires server support)
 */
export const getFileSize = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      return formatFileSize(parseInt(contentLength));
    }
    return null;
  } catch {
    return null;
  }
}; 