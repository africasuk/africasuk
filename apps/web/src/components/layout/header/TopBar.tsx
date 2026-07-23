export default function TopBar() {
  return (
    <div className="w-full bg-[#002b15] relative select-none z-50 overflow-hidden antialiased">
      {/* 
        Increased baseline container height to h-1.5 (6px) for clearer visibility 
        of the brand colors while maintaining a thin aesthetic.
      */}
      <div className="h-1.5 w-full relative flex items-center overflow-hidden">
        {/* Background base glow */}
        <div className="absolute inset-0 bg-[#003b1d] opacity-40" />
        
        {/* 
          Traveling brand line animation - slowed down to 6s for a smoother, 
          more elegant transition across the header layout.
        */}
        <div 
          className="absolute inset-0 w-[200%] h-full bg-linear-to-r from-transparent via-[#00cc66] to-transparent animate-[shimmer_6s_infinite_linear]"
          style={{
            backgroundSize: '50% 100%'
          }}
        />
      </div>

      {/* Pure HTML style tag that safely renders within Server Components without styled-jsx */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}} />
    </div>
  );
}