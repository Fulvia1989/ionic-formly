import {toZonedTime} from "date-fns-tz";
import {format} from "date-fns";

export function formatDate(date:Date|string|number, fmt = 'yyyy-MM-dd\'T\'HH:mm:ssXXX'){
  return format(date,fmt);
}


export function formatDateInTimeZone(date:Date|string|number, fmt = 'yyyy-MM-dd\'T\'HH:mm:ssXXX', tmz ='Europe/Rome') {
    // Convert UTC date to the specified time zone
    const zonedDate = toZonedTime(date, tmz);

    // Format the date in the specified time zone and format
    return format(zonedDate, fmt);
}

export function setTimeToMidnight(date:Date|string|number,fmt = 'yyyy-MM-dd\'T\'HH:mm:ssXXX', tmz ='Europe/Rome') :string {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  //return d.toISOString();
  return formatDateInTimeZone(d,fmt,tmz);

}
export function setEndOfDay(date:Date|string|number,fmt = 'yyyy-MM-dd\'T\'HH:mm:ssXXX', tmz ='Europe/Rome') :string {
  const d = new Date(date);
  d.setHours(23,59,59,999);
  //return d.toISOString();
  return formatDateInTimeZone(d,fmt,tmz);
}
export function getTomorrow(){
  const tomorrow = new Date();
  return tomorrow.setDate(tomorrow.getDate() + 1);
}

export function getMondayOfNextWeek(d:Date|string|number) {
  d = new Date(d);
  d.setDate(d.getDate()+7);
  let day = d.getDay();
  let diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  let monday = new Date(d.setDate(diff))
  return setTimeToMidnight(monday);
}



export function createRegexFromString(regexString: string): RegExp {
    return new RegExp(regexString.replace(/\\\\/g, '\\'));
}

// Usage in extractCounterUUID
export function extractCounterUUID(url: string, uuidRegex: string): string | null {
    const regex = createRegexFromString(uuidRegex);
    const match = url.match(regex);
    return match ? match[1] : null;
}
export function addDataPrefix(base64String: string, mimeType: string): string {
    if (!base64String || !mimeType) {
        throw new Error('Base64 string and MIME type are required');
    }

    const dataPrefix = `data:${mimeType};base64,`;
    return dataPrefix + base64String;
}

export function generateUTCDateString(date = new Date()) {
    // Format the date in UTC
    return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}



/**
 * Adds MIME type metadata to a base64 string if it is missing.
 *
 * @param base64 - The base64 string to check and add metadata if necessary.
 * @param mimeType - The MIME type (e.g., "image/jpeg", "application/pdf").
 * @returns The base64 string with proper metadata (if needed).
 */
export function addBase64Metadata(base64: string, mimeType: string): string {
    // Check if base64 already contains metadata
    const hasMetadata = base64.startsWith('data:');

    // If the base64 already has metadata, return it as is
    if (hasMetadata) {
        return base64;
    }

    // Otherwise, add the metadata for the given MIME type
    return `data:${mimeType};base64,${base64}`;
}


export function normalizeMimeType(mimeType: string): string {
    // Convert to lowercase to avoid case sensitivity issues
    mimeType = mimeType.toLowerCase();

    // Handle specific cases based on the common types
    switch (mimeType) {
        case 'jpeg':
        case 'jpg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'bmp':
            return 'image/bmp';
        case 'svg':
            return 'image/svg+xml';
        case 'webp':
            return 'image/webp';
        case 'pdf':
            return 'application/pdf';
        case 'json':
            return 'application/json';
        case 'xml':
            return 'application/xml';
        case 'zip':
            return 'application/zip';
        case 'octet-stream':
            return 'application/octet-stream';
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'javascript':
        case 'js':
            return 'application/javascript';
        default:
            // If the mimeType already includes a slash (e.g., 'image/png'), return as is
            if (mimeType.includes('/')) {
                return mimeType;
            }

            // Unknown mime types are returned unchanged or could be customized here
            return mimeType;
    }
}


export function getImageDimensions(base64Image: string, mimeType: string): { width: number; height: number } | null {
    base64Image = addBase64Metadata(base64Image, mimeType);

    // Remove the prefix if it exists
    const base64Data = base64Image.split(',')[1];

    // Decode Base64 to binary
    const binaryString = atob(base64Data);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);

    // Fill the Uint8Array with the binary data
    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    // Check if it's a PNG (starts with 89 50 4E 47)
    if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
        // PNG signature detected, now look for IHDR chunk
        if (uint8Array[12] === 0x49 && uint8Array[13] === 0x48 && uint8Array[14] === 0x44 && uint8Array[15] === 0x52) {
            // Width and Height are in bytes 16-23 (4 bytes each)
            const width = (uint8Array[16] << 24) | (uint8Array[17] << 16) | (uint8Array[18] << 8) | uint8Array[19];
            const height = (uint8Array[20] << 24) | (uint8Array[21] << 16) | (uint8Array[22] << 8) | uint8Array[23];

            return {
                width,
                height,
            };
        }
    }

    // Check if it's a JPEG (starts with FF D8)
    if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8) {
        let i = 2; // Start scanning for the dimensions
        while (i < length) {
            if (uint8Array[i] === 0xFF) {
                // Check for SOF0 or SOF2
                if (uint8Array[i + 1] === 0xC0 || uint8Array[i + 1] === 0xC2) {
                    // Found SOF0 or SOF2
                    return {
                        height: (uint8Array[i + 5] << 8) + uint8Array[i + 6],
                        width: (uint8Array[i + 7] << 8) + uint8Array[i + 8],
                    };
                } else {
                    // Skip the segment length
                    const segmentLength = (uint8Array[i + 2] << 8) + uint8Array[i + 3];
                    i += 2 + segmentLength; // Move index past the current segment
                }
            } else {
                i++;
            }
        }
    }

    // If we reach here, we couldn't determine the dimensions
    console.warn("Could not determine dimensions from the image data.");
    return null;
}




