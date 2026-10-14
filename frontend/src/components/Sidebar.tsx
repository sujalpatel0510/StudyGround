import { NavLink } from "react-router-dom";
import { BookOpen, MessageSquare, Brain, BarChart3, Upload } from "lucide-react";

const nav = [
  { href: "/", label: "Upload", icon: Upload },
  { href: "/chat", label: "Study Chat", icon: MessageSquare },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-1 shrink-0">
      <div className="flex items-center gap-2.5 mb-8 px-2 pt-2">
        <BookOpen className="w-7 h-7 text-blue-400" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          StudyGround
        </h1>
      </div>
      {nav.map(({ href, label, icon: Icon }) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent"
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </NavLink>
      ))}

      <div className="mt-auto px-2 py-3 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Multimodal AI Hackathon 2026
        </p>
        <p className="text-xs text-gray-600">Track D: Adaptive Learning</p>
      </div>
    </aside>
  );
}
