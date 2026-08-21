const SUPABASE_CONFIG = {
  enabled: true,
  url: "https://zhrqutkaxjiyvylevxlt.supabase.co",
  anonKey: "sb_publishable_KHSvJIsSPE3PYyl0uc1c5g_wE--Mfec",
  table: "certificates",
  bucket: "certificate-pdfs"
};

window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || SUPABASE_CONFIG;

function cleanQuery(value) {
  return String(value || "").trim();
}

function normalizeQuery(value) {
  return cleanQuery(value).toLowerCase();
}

function setStatus(message, tone = "muted") {
  const status = document.getElementById("verificationStatus");
  if (!status) return;
  status.textContent = message;
  status.className = `verification-status ${tone}`;
}

function showResult(record) {
  const result = document.getElementById("certificateResult");
  const notFound = document.getElementById("certificateNotFound");
  const viewer = document.getElementById("certificateViewer");
  if (!result || !notFound || !viewer) return;

  result.classList.remove("hidden");
  notFound.classList.add("hidden");

  document.getElementById("resultParticipantName").textContent = record.participant_name;
  document.getElementById("resultProgram").textContent = record.program;
  document.getElementById("resultIssueDate").textContent = formatDate(record.date_issued || record.date_completed);
  document.getElementById("resultCompletionDate").textContent = formatDate(record.date_completed || record.date_issued);
  document.getElementById("resultType").textContent = record.certificate_type || "Certificate";
  document.getElementById("resultInstitution").textContent = record.institution || "Digi Skills Lab";
  document.getElementById("resultStatus").textContent = record.status || "Valid";

  const downloadLink = document.getElementById("certificateDownloadLink");
  const pdfUrl = record.pdf_url || "";
  viewer.src = pdfUrl;

  if (downloadLink) {
    downloadLink.href = pdfUrl;
    const fileName = (record.pdf_file_name || record.participant_name || "certificate").replace(/\.pdf$/i, "") + ".pdf";
    downloadLink.setAttribute("download", fileName);
  }
}

function showNoResult() {
  const result = document.getElementById("certificateResult");
  const notFound = document.getElementById("certificateNotFound");
  if (!result || !notFound) return;

  result.classList.add("hidden");
  notFound.classList.remove("hidden");
}

function formatDate(dateString) {
  if (!dateString) return "Not available";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function getSupabaseClient() {
  const supabaseConfig = window.SUPABASE_CONFIG || SUPABASE_CONFIG;
  if (!supabaseConfig.enabled || !supabaseConfig.url || !supabaseConfig.anonKey || !window.supabase) {
    return null;
  }

  return window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
}

async function querySupabaseCertificate(query) {
  const supabaseConfig = window.SUPABASE_CONFIG || SUPABASE_CONFIG;
  const cleaned = cleanQuery(query);
  const client = getSupabaseClient();

  if (!client) {
    return [];
  }

  const table = supabaseConfig.table || "certificates";

  try {
    const { data, error } = await client
      .from(table)
      .select("*")
      .ilike("participant_name", `%${cleaned}%`)
      .limit(1);

    if (error) {
      console.error("Supabase certificate lookup failed:", error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Supabase query error:", error);
    return [];
  }
}

async function handleCertificateSearch(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const input = form.querySelector("input[name='certificateQuery']");
  const query = cleanQuery(input?.value);

  if (!query) {
    setStatus("Please enter a participant name.", "warning");
    showNoResult();
    return;
  }

  setStatus("Checking certificate records...", "muted");

  const matches = await querySupabaseCertificate(query);

  if (!matches.length) {
    setStatus("Certificate not found for that participant name. Please try again.", "warning");
    showNoResult();
    return;
  }

  const record = matches[0];
  setStatus("Certificate found.", "success");
  showResult(record);
}

function setupSearchForm() {
  const form = document.getElementById("certificateSearchForm");
  if (!form) return;
  form.addEventListener("submit", handleCertificateSearch);
}

document.addEventListener("DOMContentLoaded", () => {
  const viewer = document.getElementById("certificateViewer");
  if (viewer) viewer.src = "";

  setupSearchForm();
  showNoResult();
  setStatus("Try searching by participant name such as MOSES KATONGO or AMINA NDLOVU.", "muted");
});
