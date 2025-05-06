// // import React, { useState } from "react";
// // // import "../styles/CourseDrag.css";

// // interface CourseDragProps {
// //   id: string;
// //   courseCode: string;
// //   courseTitle: string;
// //   isEmpty?: boolean;
// //   semesterId: string;
// //   isEditing?: boolean;
// //   onDragStart?: (
// //     e: React.DragEvent<HTMLDivElement>,
// //     course: {
// //       courseCode: string;
// //       title: string;
// //       semesterId: string;
// //     }
// //   ) => void;
// //   onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
// //   onSaveCourse?: (id: string, courseCode: string, title: string) => void;
// //   prereqsMet?: boolean;
// //   isCapstone?: boolean;
// // }

// // const CourseDrag: React.FC<CourseDragProps> = ({
// //   id,
// //   courseCode,
// //   courseTitle,
// //   isEmpty = false,
// //   semesterId,
// //   isEditing = false,
// //   onDragStart,
// //   onDragEnd,
// //   onSaveCourse,
// //   prereqsMet = true,
// //   isCapstone = false,
// // }) => {
// //   const [isEditMode, setIsEditMode] = useState<boolean>(isEditing);
// //   const [codeValue, setCodeValue] = useState<string>(courseCode);
// //   const [titleValue, setTitleValue] = useState<string>(courseTitle);

// //   const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
// //     if (isEmpty) return;

// //     e.dataTransfer.setData("courseId", id);
// //     e.dataTransfer.setData("courseCode", courseCode);
// //     e.dataTransfer.setData("title", courseTitle);
// //     e.dataTransfer.setData("semesterId", semesterId);

// //     if (onDragStart) {
// //       onDragStart(e, {
// //         courseCode,
// //         title: courseTitle,
// //         semesterId,
// //       });
// //     }
// //   };

// //   const handleEdit = (e: React.MouseEvent) => {
// //     e.stopPropagation(); // Prevent triggering other handlers
// //     setIsEditMode(true);
// //   };

// //   const handleSave = () => {
// //     if (onSaveCourse) {
// //       onSaveCourse(id, codeValue, titleValue);
// //     }
// //     setIsEditMode(false);
// //   };

// //   const handleKeyDown = (e: React.KeyboardEvent) => {
// //     if (e.key === "Enter") {
// //       handleSave();
// //     }
// //   };

// //   const handleRemove = (e: React.MouseEvent) => {
// //     e.stopPropagation(); // Prevent triggering other handlers

// //     // Dispatch custom event with course details
// //     const removeEvent = new CustomEvent("removeCourse", {
// //       detail: {
// //         courseCode,
// //         semesterId,
// //       },
// //       bubbles: true,
// //     });
// //     e.currentTarget.dispatchEvent(removeEvent);
// //   };

// //   return (
// //     <div
// //       className={`course-slot filled ${isEmpty ? "empty" : ""} ${
// //         prereqsMet ? "pr-met" : "pr-not-met"
// //       } ${isCapstone ? "capstone" : ""}`}
// //       draggable={!isEmpty && !isEditMode}
// //       onDragStart={handleDragStart}
// //       onDragEnd={onDragEnd}
// //       data-course-code={courseCode} // Add data attribute for course code
// //     >
// //       {isEditMode ? (
// //         <div className="course-edit">
// //           <input
// //             type="text"
// //             value={codeValue}
// //             onChange={(e) => setCodeValue(e.target.value)}
// //             placeholder="Course Code"
// //             autoFocus
// //             onKeyDown={handleKeyDown}
// //           />
// //           <input
// //             type="text"
// //             value={titleValue}
// //             onChange={(e) => setTitleValue(e.target.value)}
// //             placeholder="Course Title"
// //             onKeyDown={handleKeyDown}
// //           />
// //           <button onClick={handleSave}>Save</button>
// //         </div>
// //       ) : (
// //         <div className="course-filled">
// //           <div className="course-code">{courseCode}</div>
// //           <div className="course-title">{courseTitle}</div>
// //           <div className="course-actions">
// //             <button className="edit-button" onClick={handleEdit}>
// //               Edit
// //             </button>
// //             <button className="remove-button" onClick={handleRemove}>
// //               Remove
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CourseDrag;

// import React, { useState } from "react";

// interface CourseDragProps {
//   id: string;
//   courseCode: string;
//   courseTitle: string;
//   isEmpty?: boolean;
//   semesterId: string;
//   isEditing?: boolean;
//   onDragStart?: (
//     e: React.DragEvent<HTMLDivElement>,
//     course: {
//       courseCode: string;
//       title: string;
//       semesterId: string;
//     }
//   ) => void;
//   onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onSaveCourse?: (id: string, courseCode: string, title: string) => void;
//   prereqsMet?: boolean;
//   isCapstone?: boolean;
// }

// const CourseDrag: React.FC<CourseDragProps> = ({
//   id,
//   courseCode,
//   courseTitle,
//   isEmpty = false,
//   semesterId,
//   isEditing = false,
//   onDragStart,
//   onDragEnd,
//   onSaveCourse,
//   prereqsMet = true,
//   isCapstone = false,
// }) => {
//   const [isEditMode, setIsEditMode] = useState<boolean>(isEditing);
//   const [codeValue, setCodeValue] = useState<string>(courseCode);
//   const [titleValue, setTitleValue] = useState<string>(courseTitle);

//   const handleEdit = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsEditMode(true);
//   };

//   const handleSave = () => {
//     if (onSaveCourse) {
//       onSaveCourse(id, codeValue, titleValue);
//     }
//     setIsEditMode(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSave();
//     }
//   };

//   const handleRemove = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const removeEvent = new CustomEvent("removeCourse", {
//       detail: {
//         courseCode,
//         semesterId,
//       },
//       bubbles: true,
//     });
//     e.currentTarget.dispatchEvent(removeEvent);
//   };

//   return (
//     <div
//       className={`course-slot filled ${isEmpty ? "empty" : ""} ${
//         prereqsMet ? "pr-met" : "pr-not-met"
//       } ${isCapstone ? "capstone" : ""}`}
//       draggable={!isEmpty && !isEditMode}
//       onDragStart={(e) =>
//         onDragStart &&
//         onDragStart(e, { courseCode, title: courseTitle, semesterId })
//       }
//       onDragEnd={onDragEnd}
//       data-course-code={courseCode}
//     >
//       {isEditMode ? (
//         <div className="course-edit">
//           <input
//             type="text"
//             value={codeValue}
//             onChange={(e) => setCodeValue(e.target.value)}
//             placeholder="Course Code"
//             autoFocus
//             onKeyDown={handleKeyDown}
//           />
//           <input
//             type="text"
//             value={titleValue}
//             onChange={(e) => setTitleValue(e.target.value)}
//             placeholder="Course Title"
//             onKeyDown={handleKeyDown}
//           />
//           <button onClick={handleSave}>Save</button>
//         </div>
//       ) : (
//         <div className="course-filled">
//           <div className="course-code">{courseCode}</div>
//           <div className="course-title">{courseTitle}</div>
//           <div className="course-actions">
//             <button className="edit-button" onClick={handleEdit}>
//               Edit
//             </button>
//             <button className="remove-button" onClick={handleRemove}>
//               Remove
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseDrag;

import React, { useState } from "react";
// import "../styles/CourseDrag.css"; // Assuming styles are in SemesterBox.css or global

interface CourseDragProps {
  id: string;
  courseCode: string;
  courseTitle: string;
  isEmpty?: boolean;
  semesterId: string; // The semester this course currently belongs to
  isEditing?: boolean;
  onDragStart?: (
    e: React.DragEvent<HTMLDivElement>,
    course: {
      courseCode: string;
      title: string;
      semesterId: string; // Pass current semesterId
    }
  ) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onSaveCourse?: (id: string, courseCode: string, title: string) => void;
  prereqsMet?: boolean;
  isCapstone?: boolean;
}

const CourseDrag: React.FC<CourseDragProps> = ({
  id,
  courseCode,
  courseTitle,
  isEmpty = false,
  semesterId, // Current semester of this course
  isEditing = false,
  onDragStart,
  onDragEnd,
  onSaveCourse,
  prereqsMet = true, // Default to true, actual value passed as prop
  isCapstone = false,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(isEditing);
  const [codeValue, setCodeValue] = useState<string>(courseCode);
  const [titleValue, setTitleValue] = useState<string>(courseTitle);

  const handleLocalDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isEmpty || isEditMode) {
      // Don't allow drag if empty or in edit mode
      e.preventDefault();
      return;
    }
    // Set data for the drag operation
    // This data will be read by SemesterBox and Carousel/CourseDragManager
    e.dataTransfer.setData("courseId", id); // For moving existing course
    e.dataTransfer.setData("courseCode", courseCode);
    e.dataTransfer.setData("title", courseTitle);
    e.dataTransfer.setData("semesterId", semesterId); // Original semester of this course instance

    if (onDragStart) {
      onDragStart(e, { courseCode, title: courseTitle, semesterId });
    }
  };

  const handleLocalDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragEnd) {
      onDragEnd(e);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (onSaveCourse) {
      onSaveCourse(id, codeValue.trim().toUpperCase(), titleValue.trim()); // Standardize code to uppercase
    }
    setIsEditMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    const removeEvent = new CustomEvent("removeCourse", {
      detail: {
        courseCode,
        semesterId,
      },
      bubbles: true,
    });
    e.currentTarget.dispatchEvent(removeEvent);
  };

  return (
    <div
      className={`course-slot filled ${isEmpty ? "empty" : ""} ${
        prereqsMet ? "pr-met" : "pr-not-met"
      } ${isCapstone ? "capstone" : ""}`}
      draggable={!isEmpty && !isEditMode}
      onDragStart={handleLocalDragStart}
      onDragEnd={handleLocalDragEnd}
      data-course-code={courseCode} // Crucial for SemesterBox global drag listener
      data-course-id={id}
    >
      {isEditMode ? (
        <div className="course-edit">
          <input
            type="text"
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value.toUpperCase())}
            placeholder="Course Code"
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="Course Title"
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="course-filled">
          <div className="course-code">{courseCode}</div>
          <div className="course-title">{courseTitle}</div>
          <div className="course-actions">
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
            <button className="remove-button" onClick={handleRemove}>
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDrag;
