import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import {
  Barcode,
  CalendarDays,
  Clipboard,
  Download,
  Hash,
  Loader2,
  QrCode,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type ProgramCode = 'JB' | 'RW' | 'SW' | 'RS' | 'MZ' | 'ST';

interface ProgramOption {
  code: ProgramCode;
  label: string;
  description: string;
}

const programOptions: ProgramOption[] = [
  { code: 'JB', label: 'JAILBREAK', description: 'Postpenitenciární návrat a restart.' },
  { code: 'RW', label: 'REWORK', description: 'Práce, rekvalifikace a partnerské firmy.' },
  { code: 'SW', label: 'STREETWISE', description: 'Terénní orientace a bezpečný návrat.' },
  { code: 'RS', label: 'RESET', description: 'Stabilizační a krizový reset.' },
  { code: 'MZ', label: 'MÍSTO ZLOMU', description: 'Bod rozhodnutí a změny směru.' },
  { code: 'ST', label: 'STABILIZACE', description: 'Follow-up, bydlení, práce a vztahy.' }
];

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

const sanitizeLetters = (value: string, fallback: string) => {
  const letters = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 2);

  return letters.padEnd(2, fallback).slice(0, 2);
};

const normalizeSequence = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 2);
  return digits.length > 0 ? digits.padStart(2, '0') : '01';
};

const normalizeRandomCode = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 0 ? digits.padStart(4, '0') : randomFourDigits();
};

const randomFourDigits = () => Math.floor(Math.random() * 10000).toString().padStart(4, '0');

const formatDateBlock = (value: string) => value.replace(/\D/g, '').slice(0, 8);

const buildClientId = (programCode: string, ownerCode: string, sequence: string, registrationDate: string, randomCode: string) => {
  const letters = `${programCode}${ownerCode}`;
  const numericBlock = `${sequence}${formatDateBlock(registrationDate)}${randomCode}`;
  return `${letters}-${numericBlock.slice(0, 10)}-${numericBlock.slice(10)}`;
};

const downloadDataUrl = (dataUrl: string, fileName: string) => {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

const ClientIdGeneratorPanel: React.FC = () => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barcodeSvgRef = useRef<SVGSVGElement | null>(null);
  const [programCode, setProgramCode] = useState<ProgramCode>('JB');
  const [ownerCode, setOwnerCode] = useState('DK');
  const [sequence, setSequence] = useState('01');
  const [registrationDate, setRegistrationDate] = useState(todayIsoDate());
  const [randomCode, setRandomCode] = useState(randomFourDigits);
  const [notice, setNotice] = useState('');
  const [isRendering, setIsRendering] = useState(false);

  const normalizedOwnerCode = sanitizeLetters(ownerCode, 'X');
  const normalizedSequence = normalizeSequence(sequence);
  const normalizedRandomCode = normalizeRandomCode(randomCode);
  const selectedProgram = programOptions.find((option) => option.code === programCode) ?? programOptions[0];

  const clientId = useMemo(
    () => buildClientId(programCode, normalizedOwnerCode, normalizedSequence, registrationDate, normalizedRandomCode),
    [programCode, normalizedOwnerCode, normalizedSequence, registrationDate, normalizedRandomCode]
  );

  const qrPayload = useMemo(
    () =>
      [
        'REST||ART CLIENT ID',
        `ID:${clientId}`,
        `PROGRAM:${selectedProgram.label}`,
        `REGISTRATION_DATE:${registrationDate}`,
        `GENERATED_AT:${new Date().toISOString()}`
      ].join('\n'),
    [clientId, registrationDate, selectedProgram.label]
  );

  useEffect(() => {
    let cancelled = false;

    const renderCodes = async () => {
      if (!qrCanvasRef.current || !barcodeSvgRef.current) return;

      setIsRendering(true);
      try {
        JsBarcode(barcodeSvgRef.current, clientId, {
          format: 'CODE128',
          displayValue: true,
          font: 'monospace',
          fontSize: 18,
          height: 78,
          lineColor: '#031114',
          margin: 12,
          textMargin: 8,
          width: 2
        });

        await QRCode.toCanvas(qrCanvasRef.current, qrPayload, {
          errorCorrectionLevel: 'M',
          margin: 2,
          scale: 7,
          color: {
            dark: '#031114',
            light: '#ffffff'
          }
        });
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    void renderCodes();

    return () => {
      cancelled = true;
    };
  }, [clientId, qrPayload]);

  const regenerate = () => {
    setSequence((current) => normalizeSequence(current));
    setOwnerCode(normalizedOwnerCode);
    setRandomCode(randomFourDigits());
    setNotice('Vygenerováno nové klientské ID včetně QR a čárového kódu.');
  };

  const copyClientId = async () => {
    try {
      await navigator.clipboard.writeText(clientId);
      setNotice('Klientské ID je zkopírované do schránky.');
    } catch {
      setNotice('Kopírování se nepovedlo, ID můžeš označit ručně.');
    }
  };

  const downloadQrPng = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    downloadDataUrl(canvas.toDataURL('image/png'), `${clientId}-qr.png`);
  };

  const downloadBarcodeSvg = () => {
    const svg = barcodeSvgRef.current;
    if (!svg) return;
    const serialized = new XMLSerializer().serializeToString(svg);
    downloadBlob(new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' }), `${clientId}-barcode.svg`);
  };

  const printCard = () => {
    const qrCanvas = qrCanvasRef.current;
    const barcodeSvg = barcodeSvgRef.current;
    if (!qrCanvas || !barcodeSvg) return;

    const qrDataUrl = qrCanvas.toDataURL('image/png');
    const barcodeMarkup = new XMLSerializer().serializeToString(barcodeSvg);
    const printWindow = window.open('', '_blank', 'width=900,height=720');
    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html lang="cs">
        <head>
          <meta charset="utf-8" />
          <title>${clientId}</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #f5f7f7; color: #031114; }
            .card { width: 760px; margin: 40px auto; padding: 32px; border: 1px solid #d5dddd; border-radius: 18px; background: #fff; }
            .eyebrow { font-size: 11px; letter-spacing: 0.22em; font-weight: 800; text-transform: uppercase; color: #0f766e; }
            h1 { margin: 12px 0 6px; font-size: 34px; letter-spacing: 0.08em; }
            .meta { margin-bottom: 28px; font-size: 13px; color: #475569; }
            .grid { display: grid; grid-template-columns: 1fr 220px; gap: 28px; align-items: center; }
            .barcode svg { width: 100%; height: auto; }
            .qr img { width: 220px; height: 220px; }
            .footer { margin-top: 24px; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <main class="card">
            <div class="eyebrow">REST||ART Integrace - klientské ID</div>
            <h1>${clientId}</h1>
            <div class="meta">${selectedProgram.label} / registrace ${registrationDate}</div>
            <div class="grid">
              <div class="barcode">${barcodeMarkup}</div>
              <div class="qr"><img src="${qrDataUrl}" alt="QR kód ${clientId}" /></div>
            </div>
            <div class="footer">ID neobsahuje jméno klienta ani citlivé údaje. Slouží jako jednoznačný interní identifikátor.</div>
          </main>
          <script>window.addEventListener('load', () => window.print());</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">
              <QrCode size={14} />
              Klientské ID
            </div>
            <h2 className="text-3xl font-black uppercase text-white md:text-5xl">
              Generátor <span className="headline-thin text-cyan-300">kódů</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/45">
              Jedním tlačítkem vytvoříš klientské ID, QR kód a čárový kód pro intake formulář,
              knihu klienta, stabilizační index a navazující dokumentaci.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[620px]">
            {[
              ['Písmena', `${programCode}${normalizedOwnerCode}`],
              ['Číselný blok', `${normalizedSequence}${formatDateBlock(registrationDate)}${normalizedRandomCode}`],
              ['Program', programCode]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">{label}</p>
                <p className="mt-3 text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {notice && (
        <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          {notice}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[440px,1fr]">
        <aside className="glass-panel rounded-[3rem] border-white/10 p-6">
          <div className="mb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Vstupy</p>
            <h3 className="mt-2 text-2xl font-black text-white">Sestavení ID</h3>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Program</span>
              <select
                value={programCode}
                onChange={(event) => setProgramCode(event.target.value as ProgramCode)}
                className="mt-2 w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-400/30"
              >
                {programOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code} - {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-white/35">{selectedProgram.description}</p>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Kód osoby</span>
                <input
                  value={ownerCode}
                  onChange={(event) => setOwnerCode(sanitizeLetters(event.target.value, 'X'))}
                  maxLength={2}
                  className="mt-2 w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 text-sm font-black uppercase text-white outline-none transition focus:border-cyan-400/30"
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Pořadí</span>
                <input
                  value={sequence}
                  onChange={(event) => setSequence(event.target.value.replace(/\D/g, '').slice(0, 2))}
                  onBlur={() => setSequence(normalizedSequence)}
                  inputMode="numeric"
                  className="mt-2 w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 text-sm font-black text-white outline-none transition focus:border-cyan-400/30"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Datum registrace</span>
              <div className="relative mt-2">
                <CalendarDays size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300" />
                <input
                  type="date"
                  value={registrationDate}
                  onChange={(event) => setRegistrationDate(event.target.value || todayIsoDate())}
                  className="w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 pl-11 text-sm font-bold text-white outline-none transition focus:border-cyan-400/30"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Náhodný blok</span>
              <div className="mt-2 flex gap-2">
                <input
                  value={randomCode}
                  onChange={(event) => setRandomCode(event.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={() => setRandomCode(normalizedRandomCode)}
                  inputMode="numeric"
                  className="w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 text-sm font-black text-white outline-none transition focus:border-cyan-400/30"
                />
                <button
                  type="button"
                  onClick={() => setRandomCode(randomFourDigits())}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200 transition hover:border-cyan-400/35"
                  aria-label="Vygenerovat náhodný blok"
                  title="Vygenerovat náhodný blok"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </label>

            <button
              type="button"
              onClick={regenerate}
              className="inline-flex w-full items-center justify-center gap-3 rounded-[1.4rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400"
            >
              <Hash size={16} />
              Vygenerovat ID + kódy
            </button>
          </div>
        </aside>

        <div className="glass-panel rounded-[3rem] border-white/10 p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Výstup</p>
              <h3 className="break-all text-3xl font-black uppercase text-white md:text-5xl">{clientId}</h3>
              <p className="text-sm text-white/45">
                Formát podle příkladu: {programCode}{normalizedOwnerCode} + {normalizedSequence} + {formatDateBlock(registrationDate)} + {normalizedRandomCode}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyClientId()}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/60 transition hover:border-cyan-400/25 hover:text-cyan-300"
              >
                <Clipboard size={14} />
                Kopírovat
              </button>
              <button
                type="button"
                onClick={printCard}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 transition hover:border-cyan-400/35"
              >
                <ShieldCheck size={14} />
                Tisk karty
              </button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr,280px]">
            <div className="rounded-[2rem] border border-white/10 bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
                  <Barcode size={13} />
                  Code 128
                </div>
                {isRendering && <Loader2 size={15} className="animate-spin text-slate-500" />}
              </div>
              <div className="overflow-x-auto">
                <svg ref={barcodeSvgRef} className="min-w-[520px]" />
              </div>
              <button
                type="button"
                onClick={downloadBarcodeSvg}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
              >
                <Download size={14} />
                Stáhnout SVG
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white p-5">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">
                <QrCode size={13} />
                QR kód
              </div>
              <canvas ref={qrCanvasRef} className="mx-auto block h-auto w-full max-w-[240px]" />
              <button
                type="button"
                onClick={downloadQrPng}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
              >
                <Download size={14} />
                Stáhnout PNG
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-[2rem] border border-cyan-400/15 bg-cyan-500/[0.04] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">QR payload</p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[1.4rem] border border-white/10 bg-black/25 p-4 text-xs leading-relaxed text-white/55">
              {qrPayload}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientIdGeneratorPanel;
