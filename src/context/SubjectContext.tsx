'use client'

import React, { createContext, useState, ReactNode } from 'react';

type Subject = {
  id: number;
  name: string;
  category: string;
};

type SubjectContextType = {
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: number) => void;
};

const initialSubjects: Subject[] = [
  { id: 1, name: "Calculus", category: "Math" },
  { id: 2, name: "Physics", category: "Science" },
  { id: 3, name: "World History", category: "History" },
];

export const SubjectContext = createContext<SubjectContextType>({
  subjects: initialSubjects,
  addSubject: () => {},
  deleteSubject: () => {},
});

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    setSubjects([...subjects, { ...subject, id: newId }]);
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  return (
    <SubjectContext.Provider value={{ subjects, addSubject, deleteSubject }}>
      {children}
    </SubjectContext.Provider>
  );
};
