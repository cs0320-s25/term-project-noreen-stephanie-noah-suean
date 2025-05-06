// // import React, { useState, useEffect } from "react";
// // import "../styles/SemesterBox.css";
// // import { canDropInSemester } from "../utils/semesterUtils";

// // interface SemesterBoxProps {
// //   boxId: string;
// //   selectedSemester: string;
// //   availableSemesters: string[];
// //   onSemesterSelect: (boxId: string, semester: string) => void;
// //   expanded: boolean;
// //   children?: React.ReactNode;
// //   onDragOver?: (e: React.DragEvent) => void;
// //   onDrop?: (e: React.DragEvent) => void;
// //   onRightClick?: (
// //     e: React.MouseEvent<HTMLDivElement, MouseEvent>,
// //     boxId: string
// //   ) => void;
// // }

// // const SemesterBox: React.FC<SemesterBoxProps> = ({
// //   boxId,
// //   selectedSemester,
// //   availableSemesters,
// //   onSemesterSelect,
// //   expanded,
// //   children,
// //   onDragOver,
// //   onDrop,
// //   onRightClick,
// // }: SemesterBoxProps) => {
// //   const [isDroppable, setIsDroppable] = useState<boolean>(true);
// //   const [isDragOver, setIsDragOver] = useState<boolean>(false);
// //   const [draggedCourseCode, setDraggedCourseCode] = useState<string | null>(
// //     null
// //   );

// //   // Listen for global drag events to get course code as early as possible
// //   useEffect(() => {
// //     const handleDragStart = (e: DragEvent) => {
// //       if (e.dataTransfer && e.target instanceof HTMLElement) {
// //         // Clear previous state
// //         setIsDroppable(true);

// //         // Try to get the course code from the drag event
// //         const courseElement = e.target.closest("[data-course-code]");
// //         if (courseElement) {
// //           const code = courseElement.getAttribute("data-course-code");
// //           if (code) {
// //             setDraggedCourseCode(code);
// //             // Check if this semester can accept this course
// //             checkCourseCompatibility(code);
// //           }
// //         }
// //       }
// //     };

// //     // When drag operation ends, reset states
// //     const handleDragEnd = () => {
// //       setDraggedCourseCode(null);
// //       setIsDragOver(false);
// //       setIsDroppable(true);
// //     };

// //     document.addEventListener("dragstart", handleDragStart);
// //     document.addEventListener("dragend", handleDragEnd);

// //     return () => {
// //       document.removeEventListener("dragstart", handleDragStart);
// //       document.removeEventListener("dragend", handleDragEnd);
// //     };
// //   }, [selectedSemester]);

// //   // Check if a course can be dropped in this semester
// //   const checkCourseCompatibility = async (courseCode: string) => {
// //     if (!selectedSemester || !courseCode) return;

// //     try {
// //       const canDrop = await canDropInSemester(courseCode, selectedSemester);
// //       setIsDroppable(canDrop);
// //       console.log(`Can drop ${courseCode} in ${selectedSemester}: ${canDrop}`);
// //     } catch (error) {
// //       console.error("Error checking course compatibility:", error);
// //       setIsDroppable(true); // Default to allowing drop if check fails
// //     }
// //   };

// //   // Handle drag over event
// //   const handleDragOver = (e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragOver(true);

// //     // Get course data from the drag event if we don't have it yet
// //     if (!draggedCourseCode) {
// //       const dataTransferCourseCode = e.dataTransfer.getData("courseCode");

// //       if (dataTransferCourseCode) {
// //         setDraggedCourseCode(dataTransferCourseCode);
// //         checkCourseCompatibility(dataTransferCourseCode);
// //       } else {
// //         // Try to get course code from search course data
// //         const searchCourseData = e.dataTransfer.getData("searchCourse");
// //         if (searchCourseData) {
// //           try {
// //             const searchCourse = JSON.parse(searchCourseData);
// //             if (searchCourse.courseCode) {
// //               setDraggedCourseCode(searchCourse.courseCode);
// //               checkCourseCompatibility(searchCourse.courseCode);
// //             }
// //           } catch (error) {
// //             console.error("Error parsing search course data:", error);
// //           }
// //         }
// //       }
// //     }

// //     // If semester is not droppable, don't proceed with onDragOver
// //     if (!isDroppable) return;

// //     if (onDragOver) {
// //       onDragOver(e);
// //     }
// //   };

// //   const handleDragLeave = () => {
// //     setIsDragOver(false);
// //   };

// //   const handleDrop = (e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragOver(false);

// //     // Prevent drop if not droppable
// //     if (!isDroppable) {
// //       console.log("Prevented drop - course not offered in this semester");
// //       return;
// //     }

// //     // Otherwise proceed with the drop
// //     if (onDrop) {
// //       onDrop(e);
// //     }
// //   };

// //   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const value = e.target.value;
// //     if (value) {
// //       onSemesterSelect(boxId, value);
// //     }
// //   };

// //   const handleRightClickEvent = (
// //     e: React.MouseEvent<HTMLDivElement, MouseEvent>
// //   ) => {
// //     if (onRightClick) {
// //       onRightClick(e, boxId);
// //     }
// //   };

// //   return (
// //     <div
// //       className={`semester-box ${expanded ? "expanded" : "collapsed"} ${
// //         isDragOver ? "drag-over" : ""
// //       } ${isDragOver && !isDroppable ? "not-droppable" : ""}`}
// //       onDragOver={handleDragOver}
// //       onDragEnter={handleDragOver} // Use the same handler to ensure we check compatibility
// //       onDragLeave={handleDragLeave}
// //       onDrop={handleDrop}
// //       onContextMenu={handleRightClickEvent}
// //       data-semester-id={selectedSemester}
// //     >
// //       {selectedSemester ? (
// //         <div className="semester-header">{selectedSemester}</div>
// //       ) : (
// //         <select
// //           className="semester-select-full"
// //           defaultValue=""
// //           onChange={handleSelectChange}
// //         >
// //           <option value="" disabled>
// //             Select a semester
// //           </option>
// //           {availableSemesters.map((sem) => (
// //             <option key={sem} value={sem}>
// //               {sem}
// //             </option>
// //           ))}
// //         </select>
// //       )}
// //       <div className="semester-content">{children}</div>
// //     </div>
// //   );
// // };

// // export default SemesterBox;

// import React, { useState, useEffect } from "react";
// import "../styles/SemesterBox.css";
// import { canDropInSemester } from "../utils/semesterUtils";

// interface SemesterBoxProps {
//   boxId: string;
//   selectedSemester: string;
//   availableSemesters: string[];
//   onSemesterSelect: (boxId: string, semester: string) => void;
//   expanded: boolean;
//   children?: React.ReactNode;
//   onDragOver?: (e: React.DragEvent) => void;
//   onDrop?: (e: React.DragEvent) => void;
//   onRightClick?: (
//     e: React.MouseEvent<HTMLDivElement, MouseEvent>,
//     boxId: string
//   ) => void;
// }

// const SemesterBox: React.FC<SemesterBoxProps> = ({
//   boxId,
//   selectedSemester,
//   availableSemesters,
//   onSemesterSelect,
//   expanded,
//   children,
//   onDragOver,
//   onDrop,
//   onRightClick,
// }) => {
//   const [isDroppable, setIsDroppable] = useState<boolean>(true);
//   const [isDragOver, setIsDragOver] = useState<boolean>(false);
//   const [draggedCourseCode, setDraggedCourseCode] = useState<string | null>(
//     null
//   );

//   useEffect(() => {
//     const handleDragStart = (e: DragEvent) => {
//       if (e.dataTransfer && e.target instanceof HTMLElement) {
//         setIsDroppable(true);
//         const courseElement = e.target.closest("[data-course-code]");
//         if (courseElement) {
//           const code = courseElement.getAttribute("data-course-code");
//           if (code) {
//             setDraggedCourseCode(code);
//             checkCourseCompatibility(code);
//           }
//         }
//       }
//     };

//     const handleDragEnd = () => {
//       setDraggedCourseCode(null);
//       setIsDragOver(false);
//       setIsDroppable(true);
//     };

//     document.addEventListener("dragstart", handleDragStart);
//     document.addEventListener("dragend", handleDragEnd);

//     return () => {
//       document.removeEventListener("dragstart", handleDragStart);
//       document.removeEventListener("dragend", handleDragEnd);
//     };
//   }, [selectedSemester]);

//   const checkCourseCompatibility = async (courseCode: string) => {
//     if (!selectedSemester || !courseCode) return;
//     try {
//       const canDrop = await canDropInSemester(courseCode, selectedSemester);
//       setIsDroppable(canDrop);
//     } catch (error) {
//       console.error("Error checking course compatibility:", error);
//       setIsDroppable(true);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(true);
//     if (!draggedCourseCode) {
//       const code = e.dataTransfer.getData("courseCode");
//       if (code) {
//         setDraggedCourseCode(code);
//         checkCourseCompatibility(code);
//       }
//     }
//     if (!isDroppable) return;
//     if (onDragOver) onDragOver(e);
//   };

//   const handleDragLeave = () => {
//     setIsDragOver(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     if (!isDroppable) return;
//     if (onDrop) onDrop(e);
//   };

//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     if (value) {
//       onSemesterSelect(boxId, value);
//     }
//   };

//   const handleRightClickEvent = (
//     e: React.MouseEvent<HTMLDivElement, MouseEvent>
//   ) => {
//     if (onRightClick) {
//       onRightClick(e, boxId);
//     }
//   };

//   return (
//     <div
//       className={`semester-box ${expanded ? "expanded" : "collapsed"} ${
//         isDragOver ? (isDroppable ? "drag-over" : "not-droppable") : ""
//       }`}
//       onDragOver={handleDragOver}
//       onDragEnter={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//       onContextMenu={handleRightClickEvent}
//       data-semester-id={selectedSemester}
//     >
//       {selectedSemester ? (
//         <div className="semester-header">{selectedSemester}</div>
//       ) : (
//         <select
//           className="semester-select-full"
//           defaultValue=""
//           onChange={handleSelectChange}
//         >
//           <option value="" disabled>
//             Select a semester
//           </option>
//           {availableSemesters.map((sem) => (
//             <option key={sem} value={sem}>
//               {sem}
//             </option>
//           ))}
//         </select>
//       )}
//       <div className="semester-content">{children}</div>
//     </div>
//   );
// };

// export default SemesterBox;

import React, { useState, useEffect } from "react";
import "../styles/SemesterBox.css";
import { canDropInSemester } from "../utils/semesterUtils"; // Import the utility

interface SemesterBoxProps {
  boxId: string;
  selectedSemester: string;
  availableSemesters: string[];
  onSemesterSelect: (boxId: string, semester: string) => void;
  expanded: boolean;
  children?: React.ReactNode;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onRightClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    boxId: string
  ) => void;
}

const SemesterBox: React.FC<SemesterBoxProps> = ({
  boxId,
  selectedSemester,
  availableSemesters,
  onSemesterSelect,
  expanded,
  children,
  onDragOver,
  onDrop,
  onRightClick,
}) => {
  const [isDroppable, setIsDroppable] = useState<boolean>(true);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [currentlyRelevantCourseCode, setCurrentlyRelevantCourseCode] =
    useState<string | null>(null);

  useEffect(() => {
    const handleGlobalDragStart = async (event: DragEvent) => {
      // Made async
      setIsDragOver(false);
      if (event.target instanceof HTMLElement && selectedSemester) {
        // Only check if this box has a semester selected
        const courseElement =
          event.target.closest<HTMLElement>("[data-course-code]");
        const courseCodeFromDrag = courseElement?.dataset.courseCode || null;

        if (courseCodeFromDrag) {
          setCurrentlyRelevantCourseCode(courseCodeFromDrag);
          // Use the utility function here
          const canDrop = await canDropInSemester(
            courseCodeFromDrag,
            selectedSemester
          );
          setIsDroppable(canDrop);
        } else {
          // If dragging something without courseCode (e.g. file, text), make it not droppable
          // or handle as per your app's logic for non-course drags
          setIsDroppable(false);
          setCurrentlyRelevantCourseCode(null);
        }
      } else if (!selectedSemester) {
        setIsDroppable(false); // Cannot drop into a box without a semester selected
        setCurrentlyRelevantCourseCode(null);
      }
    };

    const handleGlobalDragEnd = () => {
      setCurrentlyRelevantCourseCode(null);
      setIsDragOver(false);
      setIsDroppable(true);
    };

    document.addEventListener("dragstart", handleGlobalDragStart);
    document.addEventListener("dragend", handleGlobalDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleGlobalDragStart);
      document.removeEventListener("dragend", handleGlobalDragEnd);
    };
  }, [selectedSemester]); // Re-run if selectedSemester changes for this box

  // This local check is a fallback or for specific scenarios if global one isn't sufficient.
  // It might be redundant if globalDragStart always correctly identifies the course.
  const checkCourseCompatibilityLocal = async (courseCode: string) => {
    if (!selectedSemester || !courseCode) {
      setIsDroppable(true); // Default if no semester or course code to check against
      return;
    }
    const canDrop = await canDropInSemester(courseCode, selectedSemester);
    setIsDroppable(canDrop);
  };

  const handleDragOverLocal = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);

    if (!selectedSemester) {
      // Cannot drop if no semester selected for this box
      e.dataTransfer.dropEffect = "none";
      setIsDroppable(false); // Explicitly set non-droppable
      return;
    }

    // Attempt to get courseCode if not already set by global dragstart
    // This helps if drag originates from outside and global listener didn't catch it,
    // or if we need to re-evaluate on dragOver for some reason.
    if (!currentlyRelevantCourseCode) {
      const dataTransferCourseCode = e.dataTransfer.getData("courseCode");
      if (dataTransferCourseCode) {
        setCurrentlyRelevantCourseCode(dataTransferCourseCode);
        checkCourseCompatibilityLocal(dataTransferCourseCode); // Use the local async check
      } else {
        const searchCourseData = e.dataTransfer.getData("searchCourse");
        if (searchCourseData) {
          try {
            const searchCourse = JSON.parse(searchCourseData);
            if (searchCourse.courseCode) {
              setCurrentlyRelevantCourseCode(searchCourse.courseCode);
              checkCourseCompatibilityLocal(searchCourse.courseCode);
            } else {
              setIsDroppable(false);
            } // No code from search implies not droppable
          } catch (parseError) {
            setIsDroppable(false); // Parse error implies not droppable
          }
        } else {
          // If no course code can be identified from dataTransfer, assume not droppable
          // This prevents dropping arbitrary elements unless explicitly handled.
          setIsDroppable(false);
        }
      }
    }

    if (!isDroppable) {
      e.dataTransfer.dropEffect = "none";
      return;
    }
    e.dataTransfer.dropEffect = "move";

    if (onDragOver) {
      onDragOver(e);
    }
  };

  const handleDragLeaveLocal = () => {
    setIsDragOver(false);
    // isDroppable state is managed by dragstart/dragover, no reset here needed usually
  };

  const handleDropLocal = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (!isDroppable || !selectedSemester) {
      // Double check isDroppable and selectedSemester
      //   console.log(`[SemesterBox] Drop prevented. isDroppable: ${isDroppable}, selectedSemester: ${selectedSemester}`);
      setCurrentlyRelevantCourseCode(null);
      // isDroppable will be reset by global 'dragend' listener
      return;
    }

    if (onDrop) {
      onDrop(e); // This will call Carousel's handleSemesterDrop
    }
    setCurrentlyRelevantCourseCode(null);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // No specific validation needed here for onSemesterSelect call,
    // parent (Carousel) handles logic of using the semester.
    onSemesterSelect(boxId, value);
  };

  const handleRightClickEvent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (onRightClick) {
      e.preventDefault();
      onRightClick(e, boxId);
    }
  };

  // Determine class string based on current states
  let classNames = "semester-box";
  classNames += expanded ? " expanded" : " collapsed";
  if (isDragOver) {
    classNames += isDroppable ? " drag-over" : " not-droppable";
  } else if (currentlyRelevantCourseCode && !isDroppable && selectedSemester) {
    // Apply not-droppable even if not dragging directly over, but a drag is active globally
    // This makes ALL non-compatible semesters turn black as soon as drag starts.
    classNames += " not-droppable";
  }

  return (
    <div
      className={classNames}
      onDragOver={handleDragOverLocal}
      onDragEnter={handleDragOverLocal}
      onDragLeave={handleDragLeaveLocal}
      onDrop={handleDropLocal}
      onContextMenu={handleRightClickEvent}
      data-semester-id={selectedSemester}
    >
      {selectedSemester ? (
        <div className="semester-header">{selectedSemester}</div>
      ) : (
        <select
          className="semester-select-full"
          value={selectedSemester || ""}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            Select a semester
          </option>
          {availableSemesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      )}
      <div className="semester-content">{children}</div>
    </div>
  );
};

export default SemesterBox;
