import { ReactNode, useEffect } from "react";
import { useAudioFeedback, AudioFeedbackContext } from "@/hooks/useAudioFeedback";

interface AudioFeedbackProviderProps {
  children: ReactNode;
}

export const AudioFeedbackProvider = ({ children }: AudioFeedbackProviderProps) => {
  const audio = useAudioFeedback();

  // Listen for section navigation events
  useEffect(() => {
    const handleSectionNavigate = () => {
      audio.playSound("navigate");
    };

    window.addEventListener("sectionNavigate", handleSectionNavigate);
    return () => window.removeEventListener("sectionNavigate", handleSectionNavigate);
  }, [audio]);

  return (
    <AudioFeedbackContext.Provider value={audio}>
      {children}
    </AudioFeedbackContext.Provider>
  );
};
