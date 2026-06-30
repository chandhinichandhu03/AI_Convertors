import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle,
  FileCode,
  Cpu,
  Layers,
  FlaskConical,
  Image as ImageIcon,
  Music,
  Video,
  Send,
  Pin,
  Star,
  PlusCircle,
  HelpCircle,
  BookOpen,
  Search,
  Lock,
  Unlock,
  RotateCw,
  Scissors,
  Copy,
  Check
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import GlassCard from '../components/GlassCard';
import DropZone from '../components/DropZone';
import ProgressBar from '../components/ProgressBar';
import SpecialtySuites from '../components/SpecialtySuites';

const CONVERSION_METRICS: Record<string, {
  explanation: string;
  bestOutput: string;
  advantages: string;
  disadvantages: string;
  performance: string;
  compatibility: string;
  alternatives: string[];
  related: string[];
}> = {
  pdf: {
    explanation: "Converts files to Portable Document Format, preserving structural elements and layout fidelity.",
    bestOutput: "PDF/A for archival preservation, standard compressed PDF for email transmission.",
    advantages: "Platform independent, retains precise layout, printable format.",
    disadvantages: "Extremely difficult to edit or manipulate text content directly.",
    performance: "Fast (1.2s avg). Uses PyMuPDF and pdfplumber locally.",
    compatibility: "Universal across all PDF Readers, web browsers, and document managers.",
    alternatives: ["DOCX", "HTML", "TXT"],
    related: ["PDF Compress", "PDF Watermark", "PDF OCR"]
  },
  docx: {
    explanation: "Converts tabular or markdown structures into Microsoft Word DOCX files.",
    bestOutput: "Standard Office XML format.",
    advantages: "Rich text editing, styling customizer, template layouts.",
    disadvantages: "Format compatibility shifts across different platforms (e.g. LibreOffice vs MS Word).",
    performance: "Medium (1.5s avg). Uses python-docx.",
    compatibility: "Microsoft Word, Google Docs, LibreOffice, Pages.",
    alternatives: ["PDF", "HTML", "MD"],
    related: ["Markdown to Word", "HTML to DOCX"]
  },
  md: {
    explanation: "Transposes documents into standard Markdown text formatting.",
    bestOutput: "GitHub Flavored Markdown.",
    advantages: "Lightweight, readable in plaintext, perfect for static generation and documentation.",
    disadvantages: "Lacks advanced margins, fonts customization, or direct page layout rules.",
    performance: "Ultra-fast (<0.1s).",
    compatibility: "Plaintext readers, VS Code, Obsidian, GitHub.",
    alternatives: ["HTML", "TXT", "PDF"],
    related: ["Markdown to PDF", "HTML to MD"]
  },
  html: {
    explanation: "Converts documents to standard HyperText Markup Language files.",
    bestOutput: "HTML5 semantic page formats.",
    advantages: "Direct web rendering, high performance, customizable CSS rules.",
    disadvantages: "Requires dependencies like images or scripts to maintain formatting.",
    performance: "Fast (0.3s avg).",
    compatibility: "All web browsers, mail clients, e-readers.",
    alternatives: ["PDF", "DOCX", "MD"],
    related: ["HTML to PDF", "Markdown to HTML"]
  },
  json: {
    explanation: "Serializes files into JavaScript Object Notation structures.",
    bestOutput: "Minified JSON or Pretty-printed indent formats.",
    advantages: "Perfect for APIs, configurations, database ingestion.",
    disadvantages: "Strict syntax requirements, completely unreadable for non-technical users.",
    performance: "Instant (<0.05s).",
    compatibility: "All programming runtimes and API configurations.",
    alternatives: ["YAML", "XML", "CSV"],
    related: ["CSV to JSON", "YAML to JSON"]
  },
  yaml: {
    explanation: "Serializes structured database schemas into human-friendly YAML strings.",
    bestOutput: "Valid YAML schemas.",
    advantages: "Clean syntax, very easy to read and edit manually.",
    disadvantages: "Spacing/indentation errors can easily break files.",
    performance: "Instant (<0.05s).",
    compatibility: "Ansible, Kubernetes, Docker Compose, general config engines.",
    alternatives: ["JSON", "XML"],
    related: ["JSON to YAML", "YAML to CSV"]
  },
  csv: {
    explanation: "Flattens database tables into Comma-Separated Values.",
    bestOutput: "UTF-8 encoded CSV files.",
    advantages: "Minimal overhead, fast ingestion, easily opened in spreadsheet editors.",
    disadvantages: "No data type validation, does not support multiple sheets or formatting.",
    performance: "Ultra-fast (0.1s). Uses Pandas.",
    compatibility: "Microsoft Excel, Google Sheets, Pandas, R.",
    alternatives: ["XLSX", "JSON"],
    related: ["Excel to CSV", "CSV Cleaner"]
  },
  xlsx: {
    explanation: "Converts files into Microsoft Excel Open XML Spreadsheet sheets.",
    bestOutput: "Excel Worksheet workbook.",
    advantages: "Supports equations, formulas, graphs, sheets, and multi-tabs.",
    disadvantages: "Proprietary container, not suitable for small plaintext config scripts.",
    performance: "Medium (0.8s avg).",
    compatibility: "Microsoft Excel, Google Sheets, LibreOffice Calc.",
    alternatives: ["CSV", "JSON"],
    related: ["CSV to Excel", "Excel Data Clean"]
  },
  png: {
    explanation: "Converts images to Portable Network Graphics format.",
    bestOutput: "PNG-24 with alpha channel transparency.",
    advantages: "Lossless compression, supports true transparency.",
    disadvantages: "Large file sizes compared to lossy equivalents (JPG/WebP).",
    performance: "Fast (0.2s). Uses Pillow.",
    compatibility: "All photo viewers, browsers, and design platforms.",
    alternatives: ["JPEG", "WEBP", "SVG"],
    related: ["JPG to PNG", "Background Removal"]
  },
  jpeg: {
    explanation: "Converts images to Joint Photographic Experts Group format.",
    bestOutput: "Progressive JPG at 85% quality compression.",
    advantages: "Excellent compression ratios, small file size.",
    disadvantages: "Lossy compression leads to noise and artifacts around text/edges.",
    performance: "Fast (0.1s avg).",
    compatibility: "Universal across all digital screens and print platforms.",
    alternatives: ["PNG", "WEBP"],
    related: ["PNG to JPG", "Image Upscale"]
  },
  webp: {
    explanation: "Converts images to Google's modern WebP layout format.",
    bestOutput: "WebP lossy/lossless hybrid representation.",
    advantages: "30% smaller files than JPG at identical quality, supports alpha channels.",
    disadvantages: "Older browsers and legacy imaging applications lack compatibility.",
    performance: "Fast (0.2s avg).",
    compatibility: "All modern browsers (Chrome, Safari, Firefox), iOS, Android.",
    alternatives: ["PNG", "JPEG"],
    related: ["PNG to WebP", "WebP to JPG"]
  },
  gif: {
    explanation: "Generates animated or static Graphics Interchange Format files.",
    bestOutput: "8-bit indexed color palette GIF.",
    advantages: "Wide compatibility, handles simple frame looping animations.",
    disadvantages: "Limited to 256 colors, leading to graininess in photos.",
    performance: "Medium (1.5s). Uses OpenCV/Pillow.",
    compatibility: "Web browsers, chat applications, legacy viewers.",
    alternatives: ["MP4", "APNG", "WEBM"],
    related: ["Video to GIF", "GIF to MP4"]
  },
  tiff: {
    explanation: "Converts images to Tagged Image File Format.",
    bestOutput: "Uncompressed or LZW-compressed TIFF.",
    advantages: "High bit-depth, lossless, preferred in professional publishing/printing.",
    disadvantages: "Massive file sizes, cannot be directly viewed in most standard browsers.",
    performance: "Slow (0.8s).",
    compatibility: "Photoshop, GIMP, print layout suites.",
    alternatives: ["PNG", "RAW"],
    related: ["RAW to TIFF", "TIFF to PDF"]
  },
  mp3: {
    explanation: "Encodes audio streams into MPEG-1 Audio Layer III format.",
    bestOutput: "320kbps CBR MP3.",
    advantages: "Small storage footprint, massive device compatibility.",
    disadvantages: "Lossy compression cuts out extreme high/low audio frequencies.",
    performance: "Fast (0.5s avg). Uses FFmpeg.",
    compatibility: "Every audio player, car stereo, mobile device.",
    alternatives: ["WAV", "FLAC", "AAC"],
    related: ["WAV to MP3", "Audio Trimming"]
  },
  wav: {
    explanation: "Converts audio to uncompressed Waveform Audio file format.",
    bestOutput: "PCM 16-bit stereo WAV.",
    advantages: "Lossless quality, zero processing overhead, ideal for audio mastering.",
    disadvantages: "Massive file size.",
    performance: "Fast (0.2s).",
    compatibility: "Production suites, Windows, macOS native players.",
    alternatives: ["MP3", "FLAC"],
    related: ["MP3 to WAV", "Normalize Volume"]
  },
  aac: {
    explanation: "Encodes audio to Advanced Audio Coding format.",
    bestOutput: "256kbps VBR AAC.",
    advantages: "Better sound quality than MP3 at identical bitrates.",
    disadvantages: "Encoder licensing restrictions in some legacy environments.",
    performance: "Fast (0.6s).",
    compatibility: "Apple Music, YouTube, gaming consoles, phones.",
    alternatives: ["MP3", "OGG"],
    related: ["Audio to AAC", "Audio trimmer"]
  },
  flac: {
    explanation: "Converts sound waves to Free Lossless Audio Codec.",
    bestOutput: "Level 5 FLAC compression.",
    advantages: "Lossless fidelity at half the storage footprint of WAV.",
    disadvantages: "Unsupported by default in some legacy smart devices.",
    performance: "Medium (0.8s).",
    compatibility: "Audiophile players, Android, VLC.",
    alternatives: ["WAV", "MP3"],
    related: ["WAV to FLAC", "FLAC to MP3"]
  },
  ogg: {
    explanation: "Encodes audio streams using the open-source Ogg Vorbis container.",
    bestOutput: "Q6 Vorbis coding.",
    advantages: "Open format, excellent compression performance.",
    disadvantages: "Poor native support in macOS and iOS default media frameworks.",
    performance: "Fast (0.5s).",
    compatibility: "HTML5 browsers, Spotify, PC games.",
    alternatives: ["MP3", "AAC"],
    related: ["Audio to OGG"]
  },
  mp4: {
    explanation: "Encodes video streams into MPEG-4 Part 14 containers (H.264).",
    bestOutput: "H.264 video with AAC audio tracks.",
    advantages: "Industry standard, high compatibility, highly efficient compression.",
    disadvantages: "Compression is lossy, editing frames requires full re-encoding.",
    performance: "Slow (depending on length). Uses FFmpeg.",
    compatibility: "Web browsers, television screens, phones, gaming consoles.",
    alternatives: ["WEBM", "MKV", "AVI"],
    related: ["Video Compress", "Video Resolution"]
  },
  webm: {
    explanation: "Encodes videos using VP9 or AV1 video streams.",
    bestOutput: "VP9 video with Opus audio channels.",
    advantages: "Designed for web streaming, license-free, extremely compact sizes.",
    disadvantages: "Higher CPU overhead during encoding, unsupported in legacy Safari.",
    performance: "Slow (high CPU load).",
    compatibility: "Chrome, Firefox, Edge, modern YouTube containers.",
    alternatives: ["MP4", "GIF"],
    related: ["MP4 to WebM", "WebM to GIF"]
  },
  bgremove: {
    explanation: "Extracts foreground content using OpenCV GrabCut masking.",
    bestOutput: "Transparent PNG.",
    advantages: "Completely offline, removes background color without sending files to APIs.",
    disadvantages: "Edges can be rough for complex textures like hair.",
    performance: "Slow (1.8s avg).",
    compatibility: "Design apps, web overlays.",
    alternatives: ["Manual clipping path"],
    related: ["GrabCut removal", "Image upscale"]
  },
  upscale: {
    explanation: "Upscales image resolution using bicubic interpolation and unsharp masking.",
    bestOutput: "High-res PNG or WebP.",
    advantages: "Restores micro-details, eliminates pixelation in small images.",
    disadvantages: "Cannot manufacture details that were not in original resolution.",
    performance: "Medium (1.5s).",
    compatibility: "All image formats.",
    alternatives: ["Bilinear scaling"],
    related: ["Image compression", "PDF extraction"]
  },
  scan: {
    explanation: "Scans documents using perspective warp homography and auto-contrast.",
    bestOutput: "Black & White contrast PDF.",
    advantages: "Aligns paper scans from diagonal photo angles into clean flat pages.",
    disadvantages: "Requires readable document borders to run contour algorithms.",
    performance: "Fast (0.7s). Uses OpenCV.",
    compatibility: "Offices, digital record systems.",
    alternatives: ["Standard cropping"],
    related: ["OCR Extraction"]
  },
  qrcode: {
    explanation: "Generates custom QR matrices representing text or URL payloads.",
    bestOutput: "High resolution PNG barcode.",
    advantages: "Instant generation, works offline, infinite scan life.",
    disadvantages: "Limited data capacity (approx. 2000 characters maximum).",
    performance: "Instant (<0.05s).",
    compatibility: "All smart devices and scanners.",
    alternatives: ["Barcode 128"],
    related: ["Barcode Generator"]
  },
  barcode: {
    explanation: "Generates Code 128 standard industrial barcodes.",
    bestOutput: "PNG image containing bars.",
    advantages: "Highly readable by standard scanning hardware.",
    disadvantages: "Supports alphanumeric sequences only, no long formatting text.",
    performance: "Instant (<0.05s).",
    compatibility: "Inventory scanners, retail POS software.",
    alternatives: ["QR Code"],
    related: ["QR Generator"]
  }
};

export default function ConvertPage() {
  const [activeTab, setActiveTab] = useState<string>('general');

  // Pipeline states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  
  // Custom modifiers / options
  const [quality, setQuality] = useState<number>(85);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(5);
  const [degrees, setDegrees] = useState<number>(90);
  const [password, setPassword] = useState<string>('secret');
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [upscaleFactor, setUpscaleFactor] = useState<number>(2);
  const [qrBarcodeData, setQrBarcodeData] = useState<string>('https://omniconvert.ai');
  const [mergeIdsInput, setMergeIdsInput] = useState<string>('');

  // Favorites / Bookmarks states
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  // Local RAG Chatbot states
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Smart RAG Search states
  const [ragQuery, setRagQuery] = useState('');
  const [ragResponse, setRagResponse] = useState<string | null>(null);
  const [ragLoading, setRagLoading] = useState(false);

  // General outcomes
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Copy state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    fetchOllamaModels();
    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (activeTab === 'ai') {
      fetchOllamaModels();
    }
  }, [activeTab]);

  const fetchOllamaModels = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/models', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setModelsList(data.models || []);
        if (data.models && data.models.length > 0) {
          setSelectedModel(data.models[0]);
        }
      }
    } catch (err) {
      console.warn('Ollama offline:', err);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/conversion/bookmarks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      }
    } catch (err) {
      console.warn('Failed to load bookmarks:', err);
    }
  };

  const toggleBookmark = async (converterId: string) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/conversion/bookmarks/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ converterId })
      });
      if (res.ok) {
        fetchBookmarks();
      }
    } catch (err) {
      console.warn('Failed to toggle bookmark:', err);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getFormatOptions = (ext: string) => {
    const extLower = ext.toLowerCase();
    if (['pdf'].includes(extLower)) {
      return ['PDF', 'Merge', 'Split', 'Compress', 'Rotate', 'Encrypt', 'Unlock', 'Watermark', 'OCR', 'DOCX', 'HTML', 'TXT', 'Table Extract'];
    }
    if (['docx', 'doc', 'xlsx', 'xls', 'csv', 'md', 'html', 'json', 'yaml', 'txt'].includes(extLower)) {
      return ['PDF', 'DOCX', 'MD', 'HTML', 'JSON', 'YAML', 'CSV', 'XLSX'];
    }
    if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'gif'].includes(extLower)) {
      return ['PNG', 'JPEG', 'WEBP', 'GIF', 'TIFF', 'PDF', 'Background Removal', 'Image Upscale', 'Document Scanner', 'Handwriting OCR', 'Diagram Extract'];
    }
    if (['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'].includes(extLower)) {
      return ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'Audio to Text'];
    }
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(extLower)) {
      return ['MP4', 'WEBM', 'AVI', 'MOV', 'MKV', 'GIF'];
    }
    return ['PDF', 'TXT'];
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadedFileId(null);
    setResult(null);
    setError(null);
    const formats = getFormatOptions(file.name.split('.').pop() || '');
    setTargetFormat(formats[0] || '');
  };

  const startConversionPipeline = async () => {
    const isQrBarcode = targetFormat === 'qrcode' || targetFormat === 'barcode';
    if (!selectedFile && !isQrBarcode) return;
    
    setUploading(true);
    setError(null);
    setResult(null);
    setProgress(20);
    setProgressText('Uploading file context locally...');

    let activeFileId = uploadedFileId;

    try {
      if (!isQrBarcode && !activeFileId && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const uploadRes = await fetch('http://127.0.0.1:5001/api/conversion/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.detail || 'Upload failed');
        
        activeFileId = uploadData.fileId;
        setUploadedFileId(uploadData.fileId);
      }

      setProgress(50);
      setProgressText(`Processing conversion to ${targetFormat} locally...`);
      setUploading(false);
      setConverting(true);

      // Map Display target names to backend keys
      let targetKey = targetFormat.toLowerCase();
      
      const isMediaExtract = ['table extract', 'handwriting ocr', 'diagram extract', 'audio to text'].includes(targetKey);
      if (isMediaExtract) {
        let extType = 'table';
        if (targetKey === 'handwriting ocr') extType = 'ocr';
        if (targetKey === 'diagram extract') extType = 'diagram';
        if (targetKey === 'audio to text') extType = 'speech';
        
        const extractRes = await fetch('http://127.0.0.1:5001/api/ai/extract-media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ fileId: activeFileId, extractType: extType })
        });
        const extractData = await extractRes.json();
        if (!extractRes.ok) throw new Error(extractData.detail || 'Media extraction failed');
        
        setProgress(100);
        setProgressText('Extraction completed!');
        setResult({
          success: true,
          fileName: selectedFile?.name || 'Extracted Output',
          extractedText: extractData.text || extractData.description || (extractData.tables ? JSON.stringify(extractData.tables, null, 2) : ''),
          downloadUrl: null
        });
        return;
      }

      if (targetFormat === 'Background Removal') targetKey = 'bgremove';
      if (targetFormat === 'Image Upscale') targetKey = 'upscale';
      if (targetFormat === 'Document Scanner') targetKey = 'scan';
      if (targetFormat === 'OCR') targetKey = 'ocr';
      if (targetFormat === 'Merge') targetKey = 'merge';
      if (targetFormat === 'Split') targetKey = 'split';
      if (targetFormat === 'Compress') targetKey = 'compress';
      if (targetFormat === 'Rotate') targetKey = 'rotate';
      if (targetFormat === 'Encrypt') targetKey = 'encrypt';
      if (targetFormat === 'Unlock') targetKey = 'unlock';
      if (targetFormat === 'Watermark') targetKey = 'watermark';

      // Dynamic Options Mapping
      const optionsObj: any = { quality };
      if (targetKey === 'split') {
        optionsObj.startPage = startPage;
        optionsObj.endPage = endPage;
      } else if (targetKey === 'rotate') {
        optionsObj.degrees = degrees;
      } else if (targetKey === 'encrypt' || targetKey === 'unlock') {
        optionsObj.password = password;
      } else if (targetKey === 'watermark') {
        optionsObj.text = watermarkText;
      } else if (targetKey === 'upscale') {
        optionsObj.scale = upscaleFactor;
      } else if (targetKey === 'qrcode' || targetKey === 'barcode') {
        optionsObj.data = qrBarcodeData;
      } else if (targetKey === 'merge') {
        optionsObj.additionalFileIds = mergeIdsInput.split(',').map(id => id.trim()).filter(id => id);
      }

      const convertRes = await fetch('http://127.0.0.1:5001/api/conversion/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fileId: activeFileId || 'inline_generator',
          targetFormat: targetKey,
          options: optionsObj
        }),
      });

      const convertData = await convertRes.json();
      if (!convertRes.ok) throw new Error(convertData.detail || 'Conversion failed');

      setProgress(100);
      setProgressText('Conversion completed!');
      setResult(convertData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      setConverting(false);
    }
  };

  const triggerUploadOnly = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setProgress(40);
    setProgressText('Extracting file text segments...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const uploadRes = await fetch('http://127.0.0.1:5001/api/conversion/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.detail || 'Upload failed');

      setUploadedFileId(uploadData.fileId);
      setProgress(100);
      setProgressText('Document indexed successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSuggestionClick = (actionName: string) => {
    if (result && result.outputId) {
      setUploadedFileId(result.outputId);
      setResult(null);
      setTargetFormat(actionName);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: userMsg,
          model: selectedModel,
          fileId: uploadedFileId,
          chatHistory: chatHistory.slice(-6)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Chat query failed');

      setChatHistory((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSmartRagSearch = async (query: string) => {
    if (!query.trim() || ragLoading) return;
    setRagLoading(true);
    setRagResponse(null);
    try {
      const res = await fetch('http://127.0.0.1:5001/api/ai/ask-kb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query, model: selectedModel })
      });
      const data = await res.json();
      if (res.ok) {
        setRagResponse(data.response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRagLoading(false);
    }
  };

  const getSelectedFormatInfo = () => {
    let key = targetFormat.toLowerCase();
    if (targetFormat === 'Background Removal') key = 'bgremove';
    if (targetFormat === 'Image Upscale') key = 'upscale';
    if (targetFormat === 'Document Scanner') key = 'scan';
    if (targetFormat === 'Table Extract') key = 'pdf';
    if (targetFormat === 'Handwriting OCR') key = 'ocr';
    if (targetFormat === 'Diagram Extract') key = 'pdf';
    if (targetFormat === 'Audio to Text') key = 'mp3';
    if (['merge', 'split', 'compress', 'rotate', 'encrypt', 'unlock', 'watermark', 'ocr'].includes(key)) {
      key = 'pdf';
    }
    return CONVERSION_METRICS[key] || null;
  };

  const isBookmarked = bookmarks.includes(activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Offline Conversion Studio
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-500 font-light mt-0.5">
              Select your conversion pipeline category to configure local modifiers.
            </p>
          </div>

          <button
            onClick={() => toggleBookmark(activeTab)}
            className="p-2 rounded-lg bg-zinc-955 border border-zinc-800 text-zinc-450 hover:text-white transition-colors"
            title="Toggle Bookmark Favorite"
          >
            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-500'}`} />
          </button>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
          {[
            { id: 'general', label: 'Universal', icon: Layers },
            { id: 'images', label: 'Images', icon: ImageIcon },
            { id: 'audio', label: 'Audio', icon: Music },
            { id: 'video', label: 'Video', icon: Video },
            { id: 'ai', label: 'AI Extractors (RAG)', icon: FlaskConical },
            { id: 'specialty', label: 'Specialty', icon: Cpu }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  active ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Standard conversion studios */}
            {(activeTab === 'general' || activeTab === 'images' || activeTab === 'audio' || activeTab === 'video' || activeTab === 'archives') && (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <GlassCard hoverEffect={false} className="p-6 border-white/5 bg-zinc-900/40">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white capitalize">{activeTab} studio</h3>
                    {isBookmarked && (
                      <span className="text-[8px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold uppercase">
                        Bookmarked
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      
                      {/* Image Modifiers sliders */}
                      {activeTab === 'images' && (
                        <div className="space-y-4 border-b border-zinc-800 pb-4">
                          <div>
                            <label className="text-[11px] font-semibold text-zinc-300 flex justify-between mb-1.5">
                              <span>Quality Compression</span>
                              <span className="text-purple-400">{quality}%</span>
                            </label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={quality}
                              onChange={(e) => setQuality(parseInt(e.target.value))}
                              className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer accent-purple-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Standalone generator inputs */}
                      {(targetFormat === 'qrcode' || targetFormat === 'barcode') ? (
                        <div className="space-y-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-850">
                          <label className="text-[10px] text-zinc-400 font-bold uppercase block">QR/Barcode Text Data</label>
                          <input
                            type="text"
                            value={qrBarcodeData}
                            onChange={(e) => setQrBarcodeData(e.target.value)}
                            placeholder="Enter URL or barcode text..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <DropZone onFileSelect={handleFileSelect} />
                      )}

                      {selectedFile && (
                        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 shrink-0">
                              <FileCode className="w-5 h-5" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-white truncate max-w-[200px]">{selectedFile.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Options Matrix */}
                    <div className="space-y-4 flex flex-col justify-between bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white">Options Matrix</h4>
                        
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Target Format</label>
                          <select
                            value={targetFormat}
                            onChange={(e) => setTargetFormat(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-xs focus:outline-none"
                          >
                            {selectedFile ? (
                              getFormatOptions(selectedFile.name.split('.').pop() || '').map((f) => (
                                <option key={f} value={f}>{f}</option>
                              ))
                            ) : (
                              <>
                                <option value="">Select target</option>
                                <option value="qrcode">QR Code Generator</option>
                                <option value="barcode">Barcode Generator</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* DYNAMIC PIPELINE MODIFIERS */}
                        {targetFormat === 'Split' && (
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <label className="text-zinc-400 mb-0.5 block">Start Page</label>
                              <input type="number" value={startPage} min="1" onChange={(e) => setStartPage(parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200" />
                            </div>
                            <div>
                              <label className="text-zinc-400 mb-0.5 block">End Page</label>
                              <input type="number" value={endPage} min="1" onChange={(e) => setEndPage(parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200" />
                            </div>
                          </div>
                        )}

                        {targetFormat === 'Rotate' && (
                          <div className="text-[10px]">
                            <label className="text-zinc-400 mb-0.5 block flex justify-between">
                              <span>Rotation Degrees</span>
                              <span className="text-purple-400">{degrees}°</span>
                            </label>
                            <select value={degrees} onChange={(e) => setDegrees(parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-205">
                              <option value="90">90° Clockwise</option>
                              <option value="180">180° Half Turn</option>
                              <option value="270">270° Counter-Clockwise</option>
                            </select>
                          </div>
                        )}

                        {targetFormat === 'Encrypt' && (
                          <div className="text-[10px] space-y-1">
                            <label className="text-zinc-400 block mb-0.5">Encrypt Password</label>
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono" />
                          </div>
                        )}

                        {targetFormat === 'Watermark' && (
                          <div className="text-[10px] space-y-1">
                            <label className="text-zinc-400 block mb-0.5">Overlay Text</label>
                            <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-205" />
                          </div>
                        )}

                        {targetFormat === 'Image Upscale' && (
                          <div className="text-[10px]">
                            <label className="text-zinc-400 mb-0.5 block">Upscale Multiplier</label>
                            <select value={upscaleFactor} onChange={(e) => setUpscaleFactor(parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-205">
                              <option value="2">2x Detail Upscale</option>
                              <option value="4">4x Ultra Detail</option>
                            </select>
                          </div>
                        )}

                        {targetFormat === 'Merge' && (
                          <div className="text-[10px]">
                            <label className="text-zinc-400 mb-0.5 block">Additional File IDs (Comma Separated)</label>
                            <input type="text" placeholder="UUID-1, UUID-2" value={mergeIdsInput} onChange={(e) => setMergeIdsInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-205" />
                          </div>
                        )}

                      </div>

                      <button
                        onClick={startConversionPipeline}
                        disabled={(!selectedFile && targetFormat !== 'qrcode' && targetFormat !== 'barcode') || uploading || converting}
                        className="w-full btn-premium py-3 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50"
                      >
                        Start Offline Convert
                      </button>
                    </div>
                  </div>

                  {(uploading || converting) && (
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      <ProgressBar progress={progress} statusText={progressText} />
                    </div>
                  )}

                  {/* SUCCESS OUTCOMES & POST-CONVERSION SMART SUGGESTIONS */}
                  {result && (
                    <div className="mt-6 space-y-4">
                      {result.downloadUrl ? (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                            <div>
                              <h4 className="font-bold text-white text-xs">Conversion Succeeded</h4>
                              <p className="text-[10px] text-zinc-400 font-light mt-0.5">{result.fileName}</p>
                            </div>
                          </div>
                          <a href={`http://127.0.0.1:5001${result.downloadUrl}`} className="btn-premium px-5 py-2 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg w-fit">
                            <Download className="w-3.5 h-3.5" />
                            Download File
                          </a>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                            <h4 className="font-bold text-white text-xs">Extraction Succeeded</h4>
                          </div>
                          <textarea
                            readOnly
                            rows={8}
                            value={result.extractedText}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 font-mono focus:outline-none"
                          />
                          <button
                            onClick={() => handleCopy(result.extractedText, 'ext-out')}
                            className="btn-premium px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 w-fit"
                          >
                            {copiedText === 'ext-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            Copy Output Text
                          </button>
                        </div>
                      )}

                      {/* Recommend Follow Ups */}
                      {result.downloadUrl && (
                        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-850 space-y-2">
                          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Recommended Optimizations</h4>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: 'Compress Output', action: 'Compress' },
                              { label: 'Encrypt PDF', action: 'Encrypt' },
                              { label: 'OCR Extraction', action: 'OCR' },
                              { label: 'Document Scanner', action: 'Document Scanner' }
                            ].map((sugg) => (
                              <button
                                key={sugg.action}
                                onClick={() => handleSuggestionClick(sugg.action)}
                                className="px-2.5 py-1.5 rounded bg-zinc-905 border border-zinc-800 hover:border-purple-500 text-[9px] text-zinc-400 hover:text-white font-bold transition-all"
                              >
                                {sugg.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ERROR OUTCOMES & DIAGNOSIS */}
                  {error && (
                    <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                      <div className="flex items-center gap-3 text-rose-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div>
                          <h4 className="font-bold text-xs">Operation Failed</h4>
                          <p className="text-[9px] text-rose-450 mt-0.5">Offline converter pipeline encountered a execution break.</p>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 text-[10px] text-zinc-400 leading-relaxed font-light select-text">
                        <h5 className="font-bold text-white mb-2 uppercase tracking-wide">AI Failure Diagnosis</h5>
                        <div dangerouslySetInnerHTML={{ __html: error }} className="space-y-2 text-zinc-300" />
                      </div>
                    </div>
                  )}

                  {/* Dynamic Format Specifications Panel */}
                  {getSelectedFormatInfo() && (
                    <div className="mt-6 p-5 rounded-xl border border-zinc-850 bg-zinc-950/40 space-y-3">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Format specs & advantages ({targetFormat})
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] leading-relaxed select-text">
                        <div className="p-3 rounded bg-zinc-900/35 border border-zinc-800">
                          <strong className="text-zinc-400 block mb-0.5">Explanation</strong>
                          <span className="text-zinc-305 font-light">{getSelectedFormatInfo()?.explanation}</span>
                        </div>
                        <div className="p-3 rounded bg-zinc-900/35 border border-zinc-800">
                          <strong className="text-zinc-400 block mb-0.5">Best Output Format</strong>
                          <span className="text-zinc-305 font-light">{getSelectedFormatInfo()?.bestOutput}</span>
                        </div>
                        <div className="p-3 rounded bg-zinc-900/35 border border-zinc-800">
                          <strong className="text-zinc-400 block mb-0.5">Advantages</strong>
                          <span className="text-emerald-400 font-light">{getSelectedFormatInfo()?.advantages}</span>
                        </div>
                        <div className="p-3 rounded bg-zinc-900/35 border border-zinc-800">
                          <strong className="text-zinc-400 block mb-0.5">Disadvantages</strong>
                          <span className="text-rose-400 font-light">{getSelectedFormatInfo()?.disadvantages}</span>
                        </div>
                        <div className="p-3 rounded bg-zinc-900/35 border border-zinc-800">
                          <strong className="text-zinc-400 block mb-0.5">Performance Comparison</strong>
                          <span className="text-zinc-305 font-light">{getSelectedFormatInfo()?.performance}</span>
                        </div>
                        <div className="p-3 rounded bg-zinc-900/35 border border-zinc-800">
                          <strong className="text-zinc-400 block mb-0.5">Compatibility</strong>
                          <span className="text-zinc-305 font-light">{getSelectedFormatInfo()?.compatibility}</span>
                        </div>
                      </div>

                      <div className="flex justify-between border-t border-zinc-900 pt-3 text-[9px] text-zinc-500 font-semibold select-text">
                        <span>Alternative Formats: {getSelectedFormatInfo()?.alternatives.join(', ')}</span>
                        <span>Related: {getSelectedFormatInfo()?.related.join(', ')}</span>
                      </div>
                    </div>
                  )}

                </GlassCard>
              </motion.div>
            )}

            {/* Neural AI Labs Local RAG */}
            {activeTab === 'ai' && (
              <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* File Pinning Matrix */}
                  <GlassCard hoverEffect={false} className="p-5 border-white/5 bg-zinc-900/40 space-y-4 col-span-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-3">
                        <Pin className="w-3.5 h-3.5 text-purple-400" />
                        Pin Context File
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-light mb-3">
                        Drop any text, document, or image file below to run local RAG queries against its indexed content.
                      </p>
                      
                      <DropZone onFileSelect={handleFileSelect} />
                      
                      {selectedFile && (
                        <div className="mt-3 p-2.5 rounded-lg bg-zinc-955 border border-zinc-800 text-[10px] text-zinc-400 flex flex-col gap-2">
                          <span className="font-semibold text-white truncate">{selectedFile.name}</span>
                          <button
                            onClick={triggerUploadOnly}
                            disabled={uploading}
                            className="w-full py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
                          >
                            {uploadedFileId ? 'Indexed ✓' : 'Index Document'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1 font-semibold uppercase">Ollama Model</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                      >
                        {modelsList.length > 0 ? (
                          modelsList.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))
                        ) : (
                          <option value="">Ollama Offline</option>
                        )}
                      </select>
                    </div>
                  </GlassCard>

                  {/* Chat Container */}
                  <GlassCard hoverEffect={false} className="p-5 border-white/5 bg-zinc-900/40 col-span-2 flex flex-col justify-between h-[450px]">
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                      {chatHistory.length > 0 ? (
                        chatHistory.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-xl max-w-[80%] text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-950 border border-zinc-850 text-zinc-300'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-zinc-650 text-xs font-light">
                          <Cpu className="w-8 h-8 text-zinc-700 mb-2" />
                          Chat with local models. Pin a document to test semantic RAG queries.
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendChatMessage} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask the local assistant..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-550 placeholder-zinc-650"
                      />
                      <button
                        type="submit"
                        disabled={chatLoading}
                        className="p-3.5 rounded-xl btn-premium text-white flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* Specialty Panel */}
            {activeTab === 'specialty' && (
              <motion.div key="specialty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SpecialtySuites />
              </motion.div>
            )}

          </div>

          {/* SMART RAG SEARCH SIDEBAR PANEL ("Ask AI") */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard hoverEffect={false} className="p-4 border-zinc-800 bg-zinc-900/20 space-y-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                Ask local AI
              </h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="e.g. Why convert PNG to WebP?"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-zinc-255 focus:outline-none focus:border-purple-550"
                />
                <button
                  onClick={() => handleSmartRagSearch(ragQuery)}
                  disabled={!ragQuery.trim() || ragLoading}
                  className="w-full btn-premium py-2 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1"
                >
                  Query Offline RAG
                </button>
              </div>

              {/* RAG Seed Prompt Links */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-bold uppercase">Popular Topics:</span>
                {[
                  "Why convert PNG to WebP?",
                  "Difference between JPG and PNG?",
                  "What is PDF/A standard?",
                  "Explain AAC vs MP3 audio codecs."
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSmartRagSearch(q)}
                    className="w-full text-left text-[9px] text-purple-400 hover:text-purple-300 font-semibold block leading-tight truncate"
                  >
                    → {q}
                  </button>
                ))}
              </div>

              {/* Output result */}
              {ragLoading && (
                <div className="p-3 text-center text-zinc-650 text-[10px] animate-pulse">
                  Searching knowledge base vectors...
                </div>
              )}

              {ragResponse && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 text-[10px] text-zinc-350 leading-relaxed max-h-[250px] overflow-y-auto font-light whitespace-pre-wrap select-text font-sans">
                  {ragResponse}
                </div>
              )}
            </GlassCard>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
