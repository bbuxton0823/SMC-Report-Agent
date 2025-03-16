"use client";
interface Version {
  id: string;
  timestamp: Date;
  name?: string;
}

interface VersionSelectorProps {
  versions: Version[];
  onSelectVersion: (versionId: string) => void;
}

export default function VersionSelector({ versions, onSelectVersion }: VersionSelectorProps) {
  if (versions.length === 0) {
    return <span className="text-sm text-gray-500">No saved versions</span>;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">Version:</span>
      <select 
        className="border rounded-md px-2 py-1 text-sm"
        onChange={(e) => onSelectVersion(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select a version</option>
        {versions.map((version) => (
          <option key={version.id} value={version.id}>
            {version.name || new Date(version.timestamp).toLocaleString()}
          </option>
        ))}
      </select>
    </div>
  );
} 