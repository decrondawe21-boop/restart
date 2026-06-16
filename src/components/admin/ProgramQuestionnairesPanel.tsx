import { PDFDocument } from 'pdf-lib';
import {
  Download,
  FileText,
  Loader2,
  Plus,
  Save,
  Trash2,
  UserRound
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

type ProgramQuestionnaireCode = 'JAILBREAK' | 'RESET' | 'REWORK' | 'STREETWISE' | 'STABILIZACE' | 'BOD ZLOMU';

interface ProgramQuestionnaire {
  formUid: string;
  program: ProgramQuestionnaireCode;
  title: string;
  version: string;
  fileName: string;
  pages: number;
}

interface ClientRecord {
  id: string;
  internalId: string;
  displayName: string;
  program: ProgramQuestionnaireCode;
  contact: string;
  worker: string;
  place: string;
  registrationDate: string;
  reason: string;
  expectation: string;
}

const storageKey = 'restart-program-questionnaire-clients-v1';
const questionnaireBasePath = '/downloads/rest-art/program-questionnaires';

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

const questionnaires: ProgramQuestionnaire[] = [
  {
    formUid: 'RAI-FRM-JB-001',
    program: 'JAILBREAK',
    title: 'JAILBREAK - DOTAZNÍK REINTEGRACE PO VTOS',
    version: 'v2.0 REV3',
    fileName: 'RAI-FRM-JB-001_JAILBREAK_DOTAZNIK_REINTEGRACE_PO_VTOS_v2_0_REV3_POPPINS_FILLABLE.pdf',
    pages: 16
  },
  {
    formUid: 'RAI-FRM-RESET-001',
    program: 'RESET',
    title: 'RESET - DOTAZNÍK ABSTINENCE A STABILIZACE',
    version: 'v2.0 REV3',
    fileName: 'RAI-FRM-RESET-001_RESET_DOTAZNIK_ABSTINENCE_A_STABILIZACE_v2_0_REV3_POPPINS_FILLABLE.pdf',
    pages: 16
  },
  {
    formUid: 'RAI-FRM-REWORK-001',
    program: 'REWORK',
    title: 'REWORK - DOTAZNÍK PRACOVNÍ PŘIPRAVENOSTI',
    version: 'v2.0 REV3',
    fileName: 'RAI-FRM-REWORK-001_REWORK_DOTAZNIK_PRACOVNI_PRIPRAVENOSTI_v2_0_REV3_POPPINS_FILLABLE.pdf',
    pages: 16
  },
  {
    formUid: 'RAI-FRM-SW-001',
    program: 'STREETWISE',
    title: 'STREETWISE - DOTAZNÍK TERÉNNÍ PODPORY',
    version: 'v2.0 REV3',
    fileName: 'RAI-FRM-SW-001_STREETWISE_DOTAZNIK_TERENNI_PODPORY_v2_0_REV3_POPPINS_FILLABLE.pdf',
    pages: 16
  },
  {
    formUid: 'RAI-FRM-STAB-001',
    program: 'STABILIZACE',
    title: 'STABILIZACE - DOTAZNÍK UDRŽENÍ ZMĚNY',
    version: 'v2.0 REV3',
    fileName: 'RAI-FRM-STAB-001_STABILIZACE_DOTAZNIK_UDRZENI_ZMENY_v2_0_REV3_POPPINS_FILLABLE.pdf',
    pages: 16
  },
  {
    formUid: 'RAI-FRM-BZ-001',
    program: 'BOD ZLOMU',
    title: 'BOD ZLOMU - DOTAZNÍK MLADÝCH V RIZIKU',
    version: 'v2.0 REV3',
    fileName: 'RAI-FRM-BZ-001_BOD_ZLOMU_DOTAZNIK_MLADYCH_V_RIZIKU_v2_0_REV3_POPPINS_FILLABLE.pdf',
    pages: 16
  }
];

const defaultClient = (): ClientRecord => ({
  id: crypto.randomUUID(),
  internalId: '',
  displayName: '',
  program: 'JAILBREAK',
  contact: '',
  worker: '',
  place: '',
  registrationDate: todayIsoDate(),
  reason: '',
  expectation: ''
});

const loadStoredClients = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [defaultClient()];
    const parsed = JSON.parse(raw) as ClientRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [defaultClient()];
  } catch {
    return [defaultClient()];
  }
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

const safeFilePart = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const fillTextField = (pdfForm: ReturnType<PDFDocument['getForm']>, fieldName: string, value: string) => {
  if (!value.trim()) return;

  try {
    pdfForm.getTextField(fieldName).setText(value.trim());
  } catch {
    // Some future form revisions may rename fields; missing fields should not block the rest of the PDF.
  }
};

const ProgramQuestionnairesPanel: React.FC = () => {
  const [clients, setClients] = useState<ClientRecord[]>(loadStoredClients);
  const [selectedClientId, setSelectedClientId] = useState(() => clients[0]?.id ?? '');
  const [selectedFormUid, setSelectedFormUid] = useState(questionnaires[0].formUid);
  const [notice, setNotice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0];
  const selectedQuestionnaire =
    questionnaires.find((questionnaire) => questionnaire.formUid === selectedFormUid) ?? questionnaires[0];

  const matchingQuestionnaires = useMemo(
    () => questionnaires.filter((questionnaire) => questionnaire.program === selectedClient.program),
    [selectedClient.program]
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    if (!matchingQuestionnaires.some((questionnaire) => questionnaire.formUid === selectedFormUid)) {
      setSelectedFormUid(matchingQuestionnaires[0]?.formUid ?? questionnaires[0].formUid);
    }
  }, [matchingQuestionnaires, selectedFormUid]);

  const updateSelectedClient = (patch: Partial<ClientRecord>) => {
    setClients((current) =>
      current.map((client) => (client.id === selectedClient.id ? { ...client, ...patch } : client))
    );
  };

  const addClient = () => {
    const nextClient = defaultClient();
    setClients((current) => [...current, nextClient]);
    setSelectedClientId(nextClient.id);
    setNotice('Nový klient je připravený k vyplnění.');
  };

  const removeSelectedClient = () => {
    if (clients.length === 1) {
      setClients([defaultClient()]);
      setNotice('Poslední klient byl vyčištěn a nahrazen prázdným záznamem.');
      return;
    }

    const nextClients = clients.filter((client) => client.id !== selectedClient.id);
    setClients(nextClients);
    setSelectedClientId(nextClients[0].id);
    setNotice('Klient byl odebraný z lokálního seznamu.');
  };

  const generateFilledPdf = async () => {
    setIsGenerating(true);
    setNotice('');

    try {
      const response = await fetch(`${questionnaireBasePath}/${selectedQuestionnaire.fileName}`);
      if (!response.ok) throw new Error('PDF se nepodařilo načíst.');

      const pdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pdfForm = pdfDoc.getForm();
      const generatedDate = selectedClient.registrationDate || todayIsoDate();

      fillTextField(pdfForm, 'p1_interni_id', selectedClient.internalId);
      fillTextField(pdfForm, 'p1_program', selectedQuestionnaire.program);
      fillTextField(pdfForm, 'p1_datum', generatedDate);
      fillTextField(pdfForm, 'p1_pracovnik', selectedClient.worker);
      fillTextField(pdfForm, 'p1_misto', selectedClient.place);
      fillTextField(pdfForm, 'p1_kontakt', selectedClient.contact);
      fillTextField(pdfForm, 'p1_duvod_vstupu', selectedClient.reason);
      fillTextField(pdfForm, 'p1_ocekavani', selectedClient.expectation);

      const filledPdfBytes = await pdfDoc.save({ updateFieldAppearances: true });
      const pdfBuffer = filledPdfBytes.buffer.slice(
        filledPdfBytes.byteOffset,
        filledPdfBytes.byteOffset + filledPdfBytes.byteLength
      ) as ArrayBuffer;
      const clientPart = safeFilePart(selectedClient.internalId || selectedClient.displayName || 'klient');
      const formPart = safeFilePart(selectedQuestionnaire.formUid);
      downloadBlob(
        new Blob([pdfBuffer], { type: 'application/pdf' }),
        `${formPart}_${clientPart || 'klient'}_predvyplneno.pdf`
      );
      setNotice('Předvyplněný dotazník byl vygenerovaný.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Předvyplnění PDF selhalo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2.5rem] border border-cyan-400/15 bg-[#031114]/80 p-6 shadow-2xl shadow-cyan-950/20 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
              <FileText size={14} />
              Programové dotazníky
            </div>
            <h2 className="text-3xl font-black text-white md:text-5xl">Auto-fill podle klienta</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
              Vyber klienta, programový dotazník a vygeneruj fillable PDF s předvyplněnou první stranou.
              Klientské údaje se ukládají jen lokálně v tomto prohlížeči.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={addClient}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-4 text-sm font-black text-black transition hover:bg-white"
            >
              <Plus size={16} />
              Nový klient
            </button>
            <button
              type="button"
              onClick={removeSelectedClient}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm font-black text-red-200 transition hover:bg-red-500/20"
            >
              <Trash2 size={16} />
              Odebrat
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <UserRound className="text-cyan-300" size={20} />
            <h3 className="text-xl font-black text-white">Vybraný klient</h3>
          </div>

          <label className="mb-5 block">
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Záznam</span>
            <select
              value={selectedClient.id}
              onChange={(event) => setSelectedClientId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
            >
              {clients.map((client, index) => (
                <option key={client.id} value={client.id} className="bg-[#061114]">
                  {client.internalId || client.displayName || `Klient ${index + 1}`}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Interní ID</span>
              <input
                value={selectedClient.internalId}
                onChange={(event) => updateSelectedClient({ internalId: event.target.value })}
                placeholder="Např. JBDK-0120260616-1234"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Jméno / pracovní označení</span>
              <input
                value={selectedClient.displayName}
                onChange={(event) => updateSelectedClient({ displayName: event.target.value })}
                placeholder="Volitelné, nejde do PDF automaticky"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Program</span>
                <select
                  value={selectedClient.program}
                  onChange={(event) => updateSelectedClient({ program: event.target.value as ProgramQuestionnaireCode })}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                >
                  {questionnaires.map((questionnaire) => (
                    <option key={questionnaire.formUid} value={questionnaire.program} className="bg-[#061114]">
                      {questionnaire.program}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Datum</span>
                <input
                  type="date"
                  value={selectedClient.registrationDate}
                  onChange={(event) => updateSelectedClient({ registrationDate: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Kontakt / bezpečný kanál</span>
              <input
                value={selectedClient.contact}
                onChange={(event) => updateSelectedClient({ contact: event.target.value })}
                placeholder="Telefon, e-mail, Signal, kontaktní osoba..."
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Pracovník / mentor</span>
                <input
                  value={selectedClient.worker}
                  onChange={(event) => updateSelectedClient({ worker: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Místo / prostředí</span>
                <input
                  value={selectedClient.place}
                  onChange={(event) => updateSelectedClient({ place: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Důvod vstupu / zakázka</span>
              <textarea
                value={selectedClient.reason}
                onChange={(event) => updateSelectedClient({ reason: event.target.value })}
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Očekávání klienta</span>
              <textarea
                value={selectedClient.expectation}
                onChange={(event) => updateSelectedClient({ expectation: event.target.value })}
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <FileText className="text-cyan-300" size={20} />
            <h3 className="text-xl font-black text-white">Dotazník programu</h3>
          </div>

          <div className="grid gap-4">
            {matchingQuestionnaires.map((questionnaire) => (
              <button
                key={questionnaire.formUid}
                type="button"
                onClick={() => setSelectedFormUid(questionnaire.formUid)}
                className={`rounded-[1.7rem] border p-5 text-left transition ${
                  selectedFormUid === questionnaire.formUid
                    ? 'border-cyan-300 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.12)]'
                    : 'border-white/10 bg-black/20 hover:border-cyan-300/40'
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">{questionnaire.formUid}</p>
                    <h4 className="mt-2 text-lg font-black text-white">{questionnaire.title}</h4>
                    <p className="mt-2 text-sm text-white/45">
                      {questionnaire.version} / {questionnaire.pages} stran / fillable PDF
                    </p>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                    {questionnaire.program}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-cyan-400/15 bg-cyan-400/[0.06] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">Auto-fill pole</p>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Vyplňují se společná pole první strany: interní ID, program, datum, pracovník, místo, kontakt,
              důvod vstupu a očekávání klienta. Ostatní odborné odpovědi zůstávají ručně vyplnitelné v PDF.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={`${questionnaireBasePath}/${selectedQuestionnaire.fileName}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10"
            >
              <FileText size={16} />
              Otevřít prázdné PDF
            </a>
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => void generateFilledPdf()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-4 text-sm font-black text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
              Vygenerovat předvyplněné PDF
            </button>
          </div>

          {notice && (
            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100">
              {notice}
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-xs text-white/35">
            <Save size={14} />
            Klienti se automaticky ukládají do localStorage tohoto prohlížeče.
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProgramQuestionnairesPanel;
