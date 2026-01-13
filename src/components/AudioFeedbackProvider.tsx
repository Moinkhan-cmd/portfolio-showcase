import { ReactNode, useEffect } from "react";
import { useAudioFeedback, AudioFeedbackContext } from "@/hooks/useAudioFeedback";

interface AudioFeedbackProviderProps {
  children: ReactNode;
}

export const AudioFeedbackProvider = ({ children }: AudioFeedbackProviderProps) => {
  const audio = useAudioFeedback();

  // Listen for section navigation events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSectionNavigate = () => {
      audio.playSound("navigate");
    };

    try {
      window.addEventListener("sectionNavigate", handleSectionNavigate);
      return () => window.removeEventListener("sectionNavigate", handleSectionNavigate);
    } catch {
      return;
    }
  }, [audio]);

  return (
    <AudioFeedbackContext.Provider value={audio}>
      {children}
    </AudioFeedbackContext.Provider>
  );
};
