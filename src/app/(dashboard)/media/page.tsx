export default function Media() {
  const folders = [
    { id: 1, name: "Whitfield Wedding", photos: 287, size: "2.4 GB" },
    { id: 2, name: "Nair Brand Launch", photos: 156, size: "1.8 GB" },
    { id: 3, name: "Fontaine Gala Proposals", photos: 45, size: "612 MB" },
    { id: 4, name: "Mood Boards", photos: 23, size: "187 MB" },
    { id: 5, name: "Vendor Portfolio", photos: 89, size: "956 MB" },
  ];

  const photos = [
    { id: 1, src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300", alt: "Venue" },
    { id: 2, src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300", alt: "Table setup" },
    { id: 3, src: "https://images.unsplash.com/photo-1519914213446-3ad0f70d1e24?w=300", alt: "Flowers" },
    { id: 4, src: "https://images.unsplash.com/photo-1540575467063-178f50002c4b?w=300", alt: "Lighting" },
    { id: 5, src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300", alt: "Detail shot" },
    { id: 6, src: "https://images.unsplash.com/photo-1519568069298-6d2d70f5a58f?w=300", alt: "Reception" },
  ];

  const storageMB = 5755;
  const storageLimit = 10000;
  const storagePercent = (storageMB / storageLimit) * 100;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Media
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Photo galleries and media management</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + Upload
        </button>
      </div>

      {/* Storage Meter */}
      <div className="glass-card mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>Storage Usage</p>
          <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>
            {(storageMB / 1024).toFixed(1)} GB / {(storageLimit / 1024).toFixed(1)} GB
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3" style={{ background: "var(--surface-alt)" }}>
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${storagePercent}%`,
              background: storagePercent > 80 ? "var(--red)" : "linear-gradient(90deg, var(--gold), var(--powder))",
            }}
          ></div>
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="glass-card mb-8">
        <div className="flex gap-2 overflow-x-auto pb-4 border-b" style={{ borderColor: "var(--border)" }}>
          {[
            { label: "All Photos", icon: "📷" },
            ...folders.map((f) => ({ label: f.name, icon: "📁" })),
          ].map((tab, idx) => (
            <button
              key={idx}
              className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all"
              style={{
                borderColor: idx === 0 ? "var(--gold)" : "transparent",
                color: idx === 0 ? "var(--ink)" : "var(--ink-muted)",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {photos.map((photo) => (
          <div key={photo.id} className="relative overflow-hidden rounded-lg group cursor-pointer">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-48 object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-full bg-white bg-opacity-90">
                <span>❤️</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Folder List */}
      <div className="glass-card">
        <h2 className="font-[family-name:var(--font-heading)] text-[16px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
          All Folders
        </h2>
        <div className="space-y-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-all"
              style={{ background: "var(--surface-alt)" }}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xl">📁</span>
                <div className="text-left">
                  <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
                    {folder.name}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                    {folder.photos} photos
                  </p>
                </div>
              </div>
              <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>
                {folder.size}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
