import { useRef } from "react";

export default function CveUpload({ onUpload }) {
  const fileInputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Reset upstream state immediately
    onUpload([]);

    const reader = new FileReader();

    reader.onload = evt => {
      const text = evt.target.result;

      // Extract CVEs anywhere in file
      const matches = text.match(/CVE-\d{4}-\d{4,7}/gi) || [];
      const uniqueCves = [...new Set(matches.map(c => c.toUpperCase()))];

      onUpload(uniqueCves);

      // 🔥 CRITICAL: reset input so same file triggers again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="upload-box">
      <label>
        Upload Scanner Output (CSV / TXT)
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFile}
        />
      </label>

      <p className="hint">
       Supports Nessus, Qualys, OpenVAS exports. CVEs are auto-detected.
      </p>
    </div>
  );
}
