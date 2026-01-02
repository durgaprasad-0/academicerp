import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useQuestionPaperStore = create(
  persist(
    (set, get) => ({
      papers: [],
      
      addPaper: (paper) => {
        const newPaper = {
          ...paper,
          id: paper.id || Date.now(),
          generatedAt: paper.generatedAt || new Date().toISOString(),
        };
        set((state) => ({
          papers: [newPaper, ...state.papers],
        }));
        return newPaper;
      },
      
      deletePaper: (id) => {
        set((state) => ({
          papers: state.papers.filter((p) => p.id !== id),
        }));
      },
      
      getPaperById: (id) => {
        return get().papers.find((p) => p.id === id);
      },
      
      clearHistory: () => {
        set({ papers: [] });
      },
    }),
    {
      name: 'question-paper-storage',
    }
  )
);

export default useQuestionPaperStore;
