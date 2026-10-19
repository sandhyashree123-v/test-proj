const certificatesService = require('../services/certificatesService');

const MAX_CERTIFICATE_ID_LENGTH = 100;

/**
 * GET /api/certificates/:certificateId — verifies a certificate by exact ID match.
 * No authentication of any kind gates this route, by design (US-6 is explicitly public).
 */
function verify(req, res) {
  const rawId = req.params.certificateId;
  const trimmedId = typeof rawId === 'string' ? rawId.trim() : '';

  if (trimmedId.length === 0) {
    return res.status(400).json({ error: 'certificateId is required' });
  }

  if (trimmedId.length > MAX_CERTIFICATE_ID_LENGTH) {
    return res.status(400).json({ error: 'certificateId exceeds maximum length' });
  }

  const result = certificatesService.verify(trimmedId);

  if (!result) {
    return res.status(404).json({ error: 'Certificate not found' });
  }

  return res.status(200).json(result);
}

module.exports = { verify };
