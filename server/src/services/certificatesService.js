const certificatesRepository = require('../repositories/certificatesRepository');

/**
 * Orchestrates certificate verification (US-6). Returns the full result regardless of the
 * matched certificate's status (Valid/Revoked/Expired are all "found"); returns null only
 * when no certificate matches the given id. Fully independent of SkillsService.
 */
function verify(certificateId) {
  return certificatesRepository.findByCertificateId(certificateId);
}

module.exports = { verify };
