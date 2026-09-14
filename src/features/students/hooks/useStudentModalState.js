import { useState } from "react";
import { MODES } from "../form/formConfig";

export function useStudentModalState() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(MODES.VIEW);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const open = (mode, student = null) => {
    setMode(mode);
    setSelectedStudent(student);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedStudent(null);
  };

  return { isOpen, mode, selectedStudent, open, close };
}
