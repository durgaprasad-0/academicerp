/**
 * Utility to trigger file downloads
 * @param {string} url - The URL of the file to download
 * @param {string} filename - The name to save the file as
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename || '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default downloadFile;
