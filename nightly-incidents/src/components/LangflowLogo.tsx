interface LangflowLogoProps {
  size?: number;
  className?: string;
}

export default function LangflowLogo({
  size = 40,
  className = "",
}: LangflowLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col">
        <span
          className="font-bold text-xl bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
          style={{ fontSize: size * 0.6 }}
        >
          Langflow
        </span>
        <span
          className="text-gray-500 text-xs tracking-wide uppercase"
          style={{ fontSize: size * 0.2 }}
        >
          Nightly Build Status
        </span>
      </div>
    </div>
  );
}
