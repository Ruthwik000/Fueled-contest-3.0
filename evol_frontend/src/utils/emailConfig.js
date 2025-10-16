// EmailJS Configuration Checker
export const checkEmailJSConfig = () => {
  const config = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    fromName: import.meta.env.VITE_EMAILJS_FROM_NAME || 'EVOL Jewels'
  };

  const isConfigured = !!(
    config.serviceId && 
    config.templateId && 
    config.publicKey &&
    config.serviceId !== 'your_service_id_here' &&
    config.templateId !== 'your_template_id_here' &&
    config.publicKey !== 'your_public_key_here'
  );

  return {
    ...config,
    isConfigured,
    missingFields: [
      !config.serviceId && 'VITE_EMAILJS_SERVICE_ID',
      !config.templateId && 'VITE_EMAILJS_TEMPLATE_ID',
      !config.publicKey && 'VITE_EMAILJS_PUBLIC_KEY'
    ].filter(Boolean)
  };
};

export const getEmailJSConfig = () => {
  const config = checkEmailJSConfig();
  
  if (!config.isConfigured) {
    console.warn('EmailJS not configured. Missing:', config.missingFields.join(', '));
    return null;
  }
  
  return {
    serviceId: config.serviceId,
    templateId: config.templateId,
    publicKey: config.publicKey,
    fromName: config.fromName
  };
};