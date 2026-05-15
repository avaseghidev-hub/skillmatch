interface ParsedJobFields {
  companyName: string;
  jobTitle: string;
  location: string;
  workMode: string;
}

const ignoredLines =
  /about the opportunity|what you can expect|what you bring|why us|your profile|responsibilities|requirements|benefits|new|apply now/i;

const jobTitleKeywords =
  /engineer|developer|frontend|front-end|backend|back-end|full[- ]?stack|software|react|java|typescript|javascript/i;

const locationKeywords =
  /berlin|hamburg|munich|münchen|germany|deutschland|remote|hybrid|onsite|on-site|uk|united kingdom|usa|netherlands|amsterdam/i;

/**
 * Extract basic job fields from OCR text.
 */
export const parseJobFieldsFromText = (text: string): ParsedJobFields => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !ignoredLines.test(line));

  const jobTitle =
    lines.find((line) => jobTitleKeywords.test(line)) ?? "";

  const companyName =
    lines.find(
      (line) =>
        line !== jobTitle &&
        /^[A-Z][A-Za-z0-9&.\- ]{2,40}$/.test(line) &&
        !jobTitleKeywords.test(line) &&
        !locationKeywords.test(line)
    ) ?? "";

  const locationLine =
    lines.find((line) => locationKeywords.test(line)) ?? "";

  const location = locationLine
    .replace(/©|@|location:/gi, "")
    .replace(/remote|hybrid|onsite|on-site/gi, "")
    .replace(/[,/]+$/g, "")
    .trim();

  const workMode = /remote/i.test(text)
    ? "Remote"
    : /hybrid/i.test(text)
    ? "Hybrid"
    : /onsite|on-site/i.test(text)
    ? "Onsite"
    : "";

  return {
    companyName,
    jobTitle,
    location,
    workMode,
  };
};