export default function Showcase() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="font-display text-3xl font-bold mb-4 text-center">Sveapasset Showcase</h1>
        <video
          controls
          className="w-full rounded-2xl shadow-xl border border-border"
          src="https://media.base44.com/videos/public/6a05a8cd3d89f28998abebbd/8cc1c482d_generated_video.mp4"
        >
          AI-generated showcase video for the Sveapasset Swedish learning app.
        </video>
      </div>
    </div>
  );
}