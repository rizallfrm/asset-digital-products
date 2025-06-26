import rateLimit from 'express-rate-limit';

// Rate limiting untuk API publik
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per windowMs
  message: 'Too many requests from this IP, please try again later',
});

// Rate limiting untuk auth endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 5, // Maksimal 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later',
});

// Middleware untuk sanitasi input
export const sanitizeInput = (req, res, next) => {
  // Sanitize request body, query, dan params
  const sanitize = (data) => {
    if (!data) return data;
    if (typeof data === 'string') {
      // Basic XSS protection
      return data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    if (Array.isArray(data)) {
      return data.map(sanitize);
    }
    if (typeof data === 'object') {
      const sanitized = {};
      for (const key in data) {
        sanitized[key] = sanitize(data[key]);
      }
      return sanitized;
    }
    return data;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};