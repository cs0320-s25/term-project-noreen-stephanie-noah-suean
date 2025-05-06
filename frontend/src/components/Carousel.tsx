// import { useEffect, useState } from "react";
// import SemesterBox from "./SemesterBox";
// import CourseDrag from "./CourseDrag";
// import { CarouselMover } from "../hooks/CarouselMover";
// import { CourseDragManager } from "../hooks/CourseDragManager";
// import { CourseItem } from "../types";
// import { SignOutButton, useUser } from "@clerk/clerk-react";
// import { checkPrereqs } from "../utils/prereqUtils";
// import "../styles/Carousel.css";
// import "../styles/SemesterBox.css";
// import RightClickComponent from "./RightClick.tsx";

// interface CarouselProps {
//   viewCount: number;
//   setViewCount: React.Dispatch<React.SetStateAction<number>>;
//   draggedSearchCourse: any | null;
//   expanded: boolean; // uid: string | undefined;
// }

// const allSemesters = [
//   "Fall 21",
//   "Winter 21",
//   "Spring 22",
//   "Summer 22",
//   "Fall 22",
//   "Winter 22",
//   "Spring 23",
//   "Summer 23",
//   "Fall 23",
//   "Winter 23",
//   "Spring 24",
//   "Summer 24",
//   "Fall 24",
//   "Winter 24",
//   "Spring 25",
//   "Summer 25",
//   "Fall 25",
//   "Winter 25",
//   "Spring 26",
// ];

// interface CarouselProps {
//   viewCount: number;
//   setViewCount: React.Dispatch<React.SetStateAction<number>>;
//   draggedSearchCourse: any | null;
//   expanded: boolean;
// }

// export default function Carousel({
//   viewCount,
//   setViewCount,
//   draggedSearchCourse,
//   expanded,
// }: CarouselProps) {
//   // const [boxIds, setBoxIds] = useState<number[]>([]);
//   // const [usedSemesters, setUsedSemesters] = useState<string[]>([]);
//   // const [boxSelections, setBoxSelections] = useState<{
//   //   [boxId: string]: string;
//   // }>({});
//   const [boxIds, setBoxIds] = useState<string[]>(["1"]);
//   const [usedSemesters, setUsedSemesters] = useState<string[]>([]);
//   const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
//   const [boxSelections, setBoxSelections] = useState<{
//     [boxId: string]: string;
//   }>({});
//   const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
//   const [courses, setCourses] = useState<CourseItem[]>([]);
//   const [draggedCourseCode, setDraggedCourseCode] = useState<string | null>(
//     null
//   );
//   const [offeredSemesters, setOfferedSemesters] = useState<string[]>([]);

//   const { user } = useUser();

//   const { currentIndex, next, prev, maxIndex } = CarouselMover(
//     allSemesters.length,
//     viewCount
//   );

//   const {
//     emptySlots,
//     handleDragStart,
//     handleDragEnd,
//     handleDragOver,
//     handleDrop,
//     getCoursesForSemester,
//     addCourse,
//     setPrereqStatus,
//     recheckAllPrereqs,
//   } = CourseDragManager(user?.id ?? "", {
//     setSelectedSemester,
//     setUsedSemesters,
//     courses,
//     setCourses,
//     setDraggedCourseCode,
//     setOfferedSemesters,
//   });

//   const [menuPosition, setMenuPosition] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);

//   const handleRightClick = (
//     event: React.MouseEvent<HTMLDivElement, MouseEvent>,
//     boxId: string
//   ) => {
//     event.preventDefault();
//     setSelectedBoxId(boxId);
//     setMenuPosition({
//       x: event.pageX,
//       y: event.pageY,
//     });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.id) return;

//       try {
//         const response = await fetch(
//           `http://localhost:3232/get-user-courses-detailed?uid=${user.id}`
//         );
//         const data = await response.json();
//         const semestersData = data.semesters as Record<
//           string,
//           {
//             courseCode: string;
//             title: string;
//             prereqsMet?: boolean;
//             isCapstone?: boolean;
//           }[]
//         >;

//         if (data.response_type === "success") {
//           const newBoxIds: string[] = [];
//           const newBoxSelections: { [boxId: string]: string } = {};
//           const newUsedSemesters: string[] = [];
//           const newCourses: CourseItem[] = [];

//           let boxCounter = 1;

//           const termOrder = ["Spring", "Summer", "Fall", "Winter"];

//           const sortedSemesters = Object.entries(semestersData).sort(
//             ([a], [b]) => {
//               const [termA, yearA] = a.split(" ");
//               const [termB, yearB] = b.split(" ");
//               const yearDiff = parseInt(yearA) - parseInt(yearB);
//               if (yearDiff !== 0) return yearDiff;
//               return termOrder.indexOf(termA) - termOrder.indexOf(termB);
//             }
//           );

//           for (const [semester, courseList] of sortedSemesters) {
//             const boxId = `${boxCounter}`;
//             newBoxIds.push(boxId);
//             newBoxSelections[boxId] = semester;
//             newUsedSemesters.push(semester);

//             for (const course of courseList) {
//               newCourses.push({
//                 id: `course-${Date.now()}-${Math.random()}`,
//                 courseCode: course.courseCode,
//                 title: course.title,
//                 semesterId: semester,
//                 isEditing: false,
//                 prereqsMet: course.prereqsMet ?? false,
//                 isCapstone: course.isCapstone ?? false,
//               });
//             }
//             boxCounter++;
//           }

//           setBoxIds(newBoxIds);
//           setBoxSelections(newBoxSelections);
//           setUsedSemesters(newUsedSemesters);
//           setCourses(newCourses);
//         } else {
//           console.error("Backend error:", data.error);
//         }
//       } catch (err) {
//         console.error("Fetch failed:", err);
//       }
//     };

//     fetchData();
//   }, [user?.id]);

//   const getAvailableSemesters = () =>
//     allSemesters.filter((s) => !usedSemesters.includes(s));

//   const handleSemesterSelect = async (boxId: string, semester: string) => {
//     setBoxSelections((prev) => ({ ...prev, [boxId]: semester }));
//     setUsedSemesters((prev) => [...prev, semester]);
//     setSelectedSemester(semester);

//     const [term, year] = semester.split(" ");
//     if (!user?.id || !term || !year) return;

//     try {
//       await fetch(
//         `http://localhost:3232/add-semester?uid=${user.id}&term=${term}&year=${year}`,
//         {
//           method: "POST",
//         }
//       );
//     } catch (err) {
//       console.error("Network error while adding semester:", err);
//     }
//   };
//   useEffect(() => {
//     const handleClickOutside = () => {
//       setMenuPosition(null);
//       setSelectedBoxId(null);
//     };

//     window.addEventListener("click", handleClickOutside);
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Fixed handleSemesterDrop function
//   const handleSemesterDrop = async (e: React.DragEvent, semesterId: string) => {
//     e.preventDefault();
//     if (!user?.id) return;

//     const searchCourseRaw = e.dataTransfer.getData("searchCourse");
//     const courseId = e.dataTransfer.getData("courseId");
//     const courseCode = e.dataTransfer.getData("courseCode");

//     let courseCodeToCheck = "";

//     // First determine which course code we need to check
//     if (searchCourseRaw) {
//       try {
//         const searchCourse = JSON.parse(searchCourseRaw);
//         courseCodeToCheck = searchCourse.courseCode;
//       } catch (error) {
//         console.error("Error parsing search course data:", error);
//       }
//     } else if (courseCode) {
//       courseCodeToCheck = courseCode;
//     }

//     // For debugging
//     console.log("Drop event:", {
//       searchCourseRaw: Boolean(searchCourseRaw),
//       courseId,
//       courseCode,
//       courseCodeToCheck,
//       semesterId,
//     });

//     // First check if this course can be offered in this semester
//     let canDrop = true;

//     if (courseCodeToCheck) {
//       try {
//         const response = await fetch(
//           `http://localhost:3232/check-semester?courseCode=${encodeURIComponent(
//             courseCodeToCheck
//           )}`
//         );
//         const data = await response.json();

//         if (data.result === "success") {
//           canDrop = data.offeredSemesters.includes(semesterId);

//           if (!canDrop) {
//             console.log(
//               `Cannot drop ${courseCodeToCheck} in ${semesterId} - not offered in this semester`
//             );
//             return; // Exit early if course cannot be dropped
//           }
//         }
//       } catch (error) {
//         console.error("Failed to check semester availability:", error);
//       }
//     }

//     // Continue with the existing drop logic if the course can be dropped
//     if (canDrop) {
//       if (searchCourseRaw) {
//         // Handle adding a new course from search results
//         try {
//           const searchCourse = JSON.parse(searchCourseRaw);

//           // Check prerequisites first
//           const met = await checkPrereqs(
//             user.id,
//             searchCourse.courseCode,
//             semesterId
//           );

//           const newCourse: CourseItem = {
//             id: `course-${Date.now()}`,
//             courseCode: searchCourse.courseCode,
//             title: searchCourse.courseName,
//             semesterId,
//             isEditing: false,
//             prereqsMet: met,
//           };

//           // Get the updated state using a promise
//           const updatedCourses = await new Promise<CourseItem[]>((resolve) => {
//             setCourses((prevCourses) => {
//               const updated = [...prevCourses, newCourse];
//               resolve(updated);
//               return updated;
//             });
//           });

//           // Immediately sync with backend for search results
//           const [term, year] = semesterId.split(" ");
//           try {
//             await fetch(
//               `http://localhost:3232/add-course?uid=${
//                 user.id
//               }&code=${encodeURIComponent(
//                 searchCourse.courseCode
//               )}&title=${encodeURIComponent(
//                 searchCourse.courseName
//               )}&term=${term}&year=${year}`,
//               { method: "POST" }
//             );

//             console.log("✅ Added course from search to semester in backend");

//             // Now recheck all prerequisites with the updated courses
//             setTimeout(() => {
//               recheckAllPrereqs(updatedCourses);
//             }, 100);
//           } catch (err) {
//             console.error("Failed to sync course to backend:", err);
//           }
//         } catch (error) {
//           console.error("Error processing search course:", error);
//         }
//       } else if (courseId) {
//         // This is for moving existing courses between semesters
//         console.log(
//           "Moving existing course:",
//           courseId,
//           "to semester:",
//           semesterId
//         );
//         handleDrop(e, semesterId);
//       } else {
//         console.log("No valid course data found in drop event");
//       }
//     }
//   };

//   // const handleSemesterDrop = async (e: React.DragEvent, semesterId: string) => {
//   //   e.preventDefault();
//   //   if (!user?.id) return;

//   //   const searchCourseRaw = e.dataTransfer.getData("searchCourse");
//   //   const courseId = e.dataTransfer.getData("courseId");
//   //   const courseCode = e.dataTransfer.getData("courseCode");

//   //   // First check if this course can be offered in this semester
//   //   let canDrop = true;
//   //   let courseCodeToCheck = "";

//   //   if (searchCourseRaw) {
//   //     try {
//   //       const searchCourse = JSON.parse(searchCourseRaw);
//   //       courseCodeToCheck = searchCourse.courseCode;
//   //     } catch (error) {
//   //       console.error("Error parsing search course data:", error);
//   //     }
//   //   } else if (courseCode) {
//   //     courseCodeToCheck = courseCode;
//   //   }

//   //   if (courseCodeToCheck) {
//   //     try {
//   //       const response = await fetch(
//   //         `http://localhost:3232/check-semester?courseCode=${encodeURIComponent(
//   //           courseCodeToCheck
//   //         )}`
//   //       );
//   //       const data = await response.json();

//   //       if (data.result === "success") {
//   //         canDrop = data.offeredSemesters.includes(semesterId);

//   //         if (!canDrop) {
//   //           console.log(
//   //             `Cannot drop ${courseCodeToCheck} in ${semesterId} - not offered`
//   //           );
//   //           return; // Exit early if course cannot be dropped
//   //         }
//   //       }
//   //     } catch (error) {
//   //       console.error("Failed to check semester availability:", error);
//   //     }
//   //   }

//   //   // Continue with the existing drop logic if the course can be dropped
//   //   if (canDrop) {
//   //     if (searchCourseRaw) {
//   //       const searchCourse = JSON.parse(searchCourseRaw);

//   //       // Check prerequisites first
//   //       const met = await checkPrereqs(
//   //         user.id,
//   //         searchCourse.courseCode,
//   //         semesterId
//   //       );

//   //       const newCourse: CourseItem = {
//   //         id: `course-${Date.now()}`,
//   //         courseCode: searchCourse.courseCode,
//   //         title: searchCourse.courseName,
//   //         semesterId,
//   //         isEditing: false,
//   //         prereqsMet: met,
//   //       };

//   //       // Get the updated state using a promise
//   //       const updatedCourses = await new Promise<CourseItem[]>((resolve) => {
//   //         setCourses((prevCourses) => {
//   //           const updated = [...prevCourses, newCourse];
//   //           resolve(updated);
//   //           return updated;
//   //         });
//   //       });

//   //       // Immediately sync with backend for search results
//   //       const [term, year] = semesterId.split(" ");
//   //       try {
//   //         await fetch(
//   //           `http://localhost:3232/add-course?uid=${
//   //             user.id
//   //           }&code=${encodeURIComponent(
//   //             searchCourse.courseCode
//   //           )}&title=${encodeURIComponent(
//   //             searchCourse.courseName
//   //           )}&term=${term}&year=${year}`,
//   //           { method: "POST" }
//   //         );

//   //         console.log("✅ Added course from search to semester in backend");

//   //         // Now recheck all prerequisites with the updated courses
//   //         setTimeout(() => {
//   //           recheckAllPrereqs(updatedCourses);
//   //         }, 100);
//   //       } catch (err) {
//   //         console.error("Failed to sync course to backend:", err);
//   //       }
//   //     } else if (courseId) {
//   //       // This is for moving existing courses between semesters
//   //       handleDrop(e, semesterId);
//   //     }
//   //   }
//   // };

//   const handleSaveCourse = async (
//     id: string,
//     courseCode: string,
//     title: string
//   ) => {
//     // Get the updated state using a promise
//     const updatedCourses = await new Promise<CourseItem[]>((resolve) => {
//       setCourses((prev) => {
//         const updated = prev.map((c) =>
//           c.id === id ? { ...c, courseCode, title, isEditing: false } : c
//         );
//         resolve(updated);
//         return updated;
//       });
//     });

//     const course = updatedCourses.find((c) => c.id === id);
//     if (!course || !user?.id) return;

//     const [term, year] = course.semesterId.split(" ");

//     try {
//       // Sync to backend
//       await fetch(
//         `http://localhost:3232/add-course?uid=${
//           user.id
//         }&code=${encodeURIComponent(courseCode)}&title=${encodeURIComponent(
//           title
//         )}&term=${term}&year=${year}`,
//         {
//           method: "POST",
//         }
//       );

//       console.log("✅ Saved course to backend:", courseCode);

//       // Now recheck all prerequisites with the updated courses
//       setTimeout(() => {
//         recheckAllPrereqs(updatedCourses);
//       }, 100);
//     } catch (err) {
//       console.error("Error updating course:", err);
//     }
//   };

//   useEffect(() => {
//     const handleRemoveCourse = (e: any) => {
//       const { courseCode, semesterId } = e.detail;

//       console.log("📥 removeCourse event received:", courseCode, semesterId);
//       if (!user?.id) return;

//       setCourses((prev) => {
//         const updated = prev.filter(
//           (c) => !(c.courseCode === courseCode && c.semesterId === semesterId)
//         );

//         // Recheck all prerequisites after course removal
//         // BUT use the updated courses array that no longer includes the deleted course
//         setTimeout(() => {
//           if (recheckAllPrereqs) {
//             recheckAllPrereqs(updated);
//           } else {
//             updated.forEach(async (course) => {
//               const result = await checkPrereqs(
//                 user!.id,
//                 course.courseCode,
//                 course.semesterId
//               );
//               setPrereqStatus(course.id, result);
//             });
//           }
//         }, 100);

//         return updated;
//       });
//     };

//     window.addEventListener("removeCourse", handleRemoveCourse);
//     return () => window.removeEventListener("removeCourse", handleRemoveCourse);
//   }, [user?.id, setPrereqStatus, recheckAllPrereqs]);

//   const handleAddRightSemester = (currSemNum: string) => {
//     let newID = "";
//     let index = boxIds.indexOf(`${currSemNum}`);
//     if (currSemNum === "0") {
//       newID = "1";
//       index = 0;
//     } else if (index === -1) return boxIds; // invalid semester id
//     else {
//       newID = (Math.max(...boxIds.map(Number)) + 1).toString();
//     }

//     const newBoxIds = [...boxIds];
//     newBoxIds.splice(index + 1, 0, newID);
//     setBoxIds(newBoxIds);
//     console.log("right");
//   };

//   const handleAddLeftSemester = (currSemNum: string) => {
//     const index = boxIds.indexOf(`${currSemNum}`);
//     if (index === -1) return boxIds; // invalid semester id
//     const newID = (Math.max(...boxIds.map(Number)) + 1).toString();

//     const newBoxIds = [...boxIds];
//     newBoxIds.splice(index, 0, newID);
//     setBoxIds(newBoxIds);
//     console.log("left");
//   };

//   const handleDeleteSemester = (semToDelete: string) => {
//     setBoxIds((prevBoxIds) => prevBoxIds.filter((id) => id !== semToDelete));
//     console.log("delete");
//   };

//   const boxWidth = expanded ? 270 : 320;

//   return (
//     <div
//       className={`carousel-outer-wrapper ${viewCount === 2 ? "two" : "four"}`}
//     >
//
//       <button
//         className="carousel-button left"
//         onClick={prev}
//         disabled={currentIndex === 0}
//       >
//                 ‹
//       </button>
//
//       <div className="carousel-inner-wrapper">
//
//         <div
//           className="carousel-track"
//           style={{
//             transform: `translateX(-${currentIndex * boxWidth}px)`,
//             transition: "transform 0.5s ease",
//           }}
//         >
//
//           {boxIds.map((boxId) => (
//             <SemesterBox
//               key={boxId}
//               boxId={boxId}
//               selectedSemester={boxSelections[boxId] || ""}
//               availableSemesters={getAvailableSemesters()}
//               onSemesterSelect={() => handleSemesterSelect(boxId, "")}
//               onDragOver={handleDragOver}
//               onDrop={(e) =>
//                 boxSelections[boxId] &&
//                 handleSemesterDrop(e, boxSelections[boxId])
//               }
//               expanded={expanded}
//               onRightClick={(e) => handleRightClick(e, boxId)}
//             >
//
//               {boxSelections[boxId] &&
//                 getCoursesForSemester(boxSelections[boxId]).map((course) => (
//                   <CourseDrag
//                     key={course.id}
//                     id={course.id}
//                     courseCode={course.courseCode}
//                     courseTitle={course.title}
//                     semesterId={boxSelections[boxId]}
//                     isEmpty={false}
//                     isEditing={course.isEditing}
//                     onDragStart={handleDragStart}
//                     onDragEnd={handleDragEnd}
//                     onSaveCourse={handleSaveCourse}
//                     prereqsMet={course.prereqsMet ?? false}
//                     isCapstone={course.isCapstone ?? false}
//                   />
//                 ))}
//
//               <button
//                 className="add-course-button"
//                 onClick={() =>
//                   addCourse(boxSelections[boxId], undefined, "new")
//                 }
//               >
//                                 + New course
//               </button>
//
//             </SemesterBox>
//           ))}
//
//           <div className={`add-box ${expanded ? "expanded" : "collapsed"}`}>
//
//             <button
//               className="add-button"
//               onClick={() =>
//                 handleAddRightSemester(
//                   boxIds.length >= 1 ? boxIds[boxIds.length - 1] : "0"
//                 )
//               }
//             >
//                             <div className="add-button-plus">+</div>
//                             <div>New Semester</div>
//
//             </button>
//
//           </div>
//
//         </div>
//                 {/* Context menu rendered globally once */}
//
//         {menuPosition && selectedBoxId !== null && (
//           <RightClickComponent
//             position={menuPosition}
//             onAddRightSemester={() => handleAddRightSemester(selectedBoxId)}
//             onAddLeftSemester={() => handleAddLeftSemester(selectedBoxId)}
//             onDeleteSemester={() => handleDeleteSemester(selectedBoxId)}
//           />
//         )}
//
//       </div>
//
//       <button
//         className="carousel-button right"
//         onClick={next}
//         disabled={currentIndex === maxIndex}
//       >
//                 ›
//       </button>
//
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import SemesterBox from "./SemesterBox";
import CourseDrag from "./CourseDrag";
import { CarouselMover } from "../hooks/CarouselMover";
import { CourseDragManager } from "../hooks/CourseDragManager";
import { CourseItem } from "../types";
import { useUser } from "@clerk/clerk-react";
import { checkPrereqs } from "../utils/prereqUtils";
import { canDropInSemester } from "../utils/semesterUtils"; // Import the new utility
import "../styles/Carousel.css";
import "../styles/SemesterBox.css";
import RightClickMenu, { RightClickMenuProps } from "./RightClick";

// Define allSemesters at a broader scope or ensure it's stable if defined inside component
const allSemesters = [
  "Fall 21",
  "Winter 21",
  "Spring 22",
  "Summer 22",
  "Fall 22",
  "Winter 22",
  "Spring 23",
  "Summer 23",
  "Fall 23",
  "Winter 23",
  "Spring 24",
  "Summer 24",
  "Fall 24",
  "Winter 24",
  "Spring 25",
  "Summer 25",
  "Fall 25",
  "Winter 25",
  "Spring 26",
  "Summer 26",
  "Fall 26",
  "Winter 26",
  "Spring 27",
  "Summer 27",
  "Fall 27",
  "Winter 27",
  "Spring 28",
  "Summer 28",
  "Fall 28",
  "Winter 28",
  "Spring 29",
  "Summer 29",
  "Fall 29",
  "Winter 29",
  "Spring 30",
  "Summer 30",
];

interface CarouselProps {
  viewCount: number;
  setViewCount: React.Dispatch<React.SetStateAction<number>>; // Keep if used by parent
  draggedSearchCourse: any | null; // This might not be needed if drag data is self-contained
  expanded: boolean;
}

export default function Carousel({
  viewCount,
  // setViewCount, // Uncomment if used
  // draggedSearchCourse, // Uncomment if used
  expanded,
}: CarouselProps) {
  const [boxIds, setBoxIds] = useState<string[]>(["1"]);
  const [usedSemesters, setUsedSemesters] = useState<string[]>([]);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [boxSelections, setBoxSelections] = useState<{
    [boxId: string]: string;
  }>({});
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const { user } = useUser();

  const courseDragManager = CourseDragManager(user?.id ?? "", {
    courses,
    setCourses,
  });

  const { currentIndex, next, prev, maxIndex } = CarouselMover(
    boxIds.length + 1, // +1 for the "Add New Semester" box placeholder
    viewCount
  );

  const [menuPosition, setMenuPosition] = useState<
    RightClickMenuProps["position"] | null
  >(null);

  const handleRightClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    boxId: string
  ) => {
    event.preventDefault();
    setSelectedBoxId(boxId);
    setMenuPosition({ x: event.pageX, y: event.pageY });
  };

  const stableRecheckAllPrereqs = useCallback(
    courseDragManager.recheckAllPrereqs,
    [courseDragManager]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(
          `http://localhost:3232/get-user-courses-detailed?uid=${user.id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.response_type === "success" && data.semesters) {
          const semestersData = data.semesters as Record<
            string,
            {
              courseCode: string;
              title: string;
              prereqsMet?: boolean;
              isCapstone?: boolean;
            }[]
          >;
          const newBoxIds: string[] = [];
          const newBoxSelections: { [boxId: string]: string } = {};
          const newUsedSemesters: string[] = [];
          let newCourses: CourseItem[] = [];
          let boxCounter = 1;
          const termOrder = ["Spring", "Summer", "Fall", "Winter"];
          const sortedSemesters = Object.entries(semestersData).sort(
            ([a], [b]) => {
              const [termA, yearA] = a.split(" ");
              const [termB, yearB] = b.split(" ");
              const yearDiff = parseInt(yearA) - parseInt(yearB);
              if (yearDiff !== 0) return yearDiff;
              return termOrder.indexOf(termA) - termOrder.indexOf(termB);
            }
          );

          for (const [semester, courseList] of sortedSemesters) {
            const boxId = `${boxCounter++}`;
            newBoxIds.push(boxId);
            newBoxSelections[boxId] = semester;
            if (!newUsedSemesters.includes(semester))
              newUsedSemesters.push(semester);
            courseList.forEach((course) => {
              newCourses.push({
                id: `course-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                courseCode: course.courseCode,
                title: course.title,
                semesterId: semester,
                isEditing: false,
                prereqsMet: course.prereqsMet ?? false,
                isCapstone: course.isCapstone ?? false,
              });
            });
          }
          setBoxIds(newBoxIds.length > 0 ? newBoxIds : ["1"]);
          setBoxSelections(newBoxSelections);
          setUsedSemesters(newUsedSemesters);
          setCourses(newCourses); // Set courses first
          if (newCourses.length > 0) {
            stableRecheckAllPrereqs(newCourses); // Then recheck with the new courses
          }
        } else if (data.response_type === "success" && !data.semesters) {
          setBoxIds(["1"]);
          setBoxSelections({});
          setUsedSemesters([]);
          setCourses([]);
        } else {
          console.error(
            "Backend error:",
            data.error || "Unknown error fetching detailed courses"
          );
        }
      } catch (err) {
        console.error("Fetch user courses failed:", err);
      }
    };
    if (user?.id) fetchData();
  }, [user?.id, stableRecheckAllPrereqs]); // Added stableRecheckAllPrereqs

  const getAvailableSemesters = () =>
    allSemesters.filter((s) => !usedSemesters.includes(s) || s === "");

  const handleSemesterSelect = async (boxId: string, semester: string) => {
    const currentSelectionForBox = boxSelections[boxId];
    // If trying to select the same semester again, or an empty string (placeholder)
    if (semester === currentSelectionForBox || semester === "") {
      if (semester === "" && currentSelectionForBox) {
        // Clearing selection
        setBoxSelections((prev) => {
          const newSelections = { ...prev };
          delete newSelections[boxId];
          return newSelections;
        });
        setUsedSemesters((prev) =>
          prev.filter((s) => s !== currentSelectionForBox)
        );
        // Remove semester from backend if it's no longer used by any box (more complex logic needed if shared)
        // For simplicity, we might not remove from backend here, or assume /remove-semester handles it gracefully.
      }
      return;
    }

    // If semester is already used by another box
    if (usedSemesters.includes(semester) && boxSelections[boxId] !== semester) {
      // console.warn(`Semester ${semester} is already in use by another box.`);
      // Potentially show a toast or alert to the user
      return;
    }

    setBoxSelections((prev) => ({ ...prev, [boxId]: semester }));
    setUsedSemesters((prev) => {
      const newUsed = prev.filter((s) => s !== currentSelectionForBox); // Remove old semester
      if (semester && !newUsed.includes(semester)) newUsed.push(semester); // Add new one
      return newUsed;
    });

    if (semester && user?.id) {
      const [term, year] = semester.split(" ");
      if (!term || !year) return;
      try {
        await fetch(
          `http://localhost:3232/add-semester?uid=${user.id}&term=${term}&year=${year}`,
          { method: "POST" }
        );
      } catch (err) {
        console.error("Network error while adding semester:", err);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuPosition && !target.closest(".right-click-menu-class")) {
        setMenuPosition(null);
        setSelectedBoxId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [menuPosition]);

  const handleSemesterDrop = async (
    e: React.DragEvent,
    targetSemesterId: string
  ) => {
    e.preventDefault();
    if (!user?.id || !targetSemesterId) {
      // console.warn("Drop aborted: no user ID or target semester ID.");
      return;
    }

    const searchCourseRaw = e.dataTransfer.getData("searchCourse");
    const existingCourseId = e.dataTransfer.getData("courseId");
    const courseCodeFromData = e.dataTransfer.getData("courseCode");
    const courseTitleFromData = e.dataTransfer.getData("title");

    // Scenario 1: Moving an existing course
    if (existingCourseId && courseCodeFromData && courseTitleFromData) {
      // Validation for moving existing course already in CourseDragManager's handleDrop via SemesterBox
      courseDragManager.handleDrop(e, targetSemesterId);
      return;
    }

    // Scenario 2: Adding a new course from search results
    if (searchCourseRaw) {
      try {
        const searchCourse = JSON.parse(searchCourseRaw);
        const codeToDrop = searchCourse.courseCode || courseCodeFromData;
        const titleToDrop =
          searchCourse.courseName || searchCourse.title || courseTitleFromData;

        if (!codeToDrop || !titleToDrop) {
          console.error(
            "Cannot add course from search: code or title is missing."
          );
          return;
        }

        // Use canDropInSemester utility for validation
        const canActuallyDrop = await canDropInSemester(
          codeToDrop,
          targetSemesterId
        );
        if (!canActuallyDrop) {
          // console.log(
          //   `[Carousel] Cannot drop NEW course ${codeToDrop} in ${targetSemesterId} - not offered.`
          // );
          return;
        }

        const met = await checkPrereqs(user.id, codeToDrop, targetSemesterId);
        const newCourse: CourseItem = {
          id: `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          courseCode: codeToDrop,
          title: titleToDrop,
          semesterId: targetSemesterId,
          isEditing: false,
          prereqsMet: met,
          isCapstone: false, // Set dynamically if info is available
        };

        const updatedCourses = await new Promise<CourseItem[]>((resolve) => {
          setCourses((prevCourses) => {
            const updated = [...prevCourses, newCourse];
            resolve(updated);
            return updated;
          });
        });

        const [term, year] = targetSemesterId.split(" ");
        await fetch(
          `http://localhost:3232/add-course?uid=${
            user.id
          }&code=${encodeURIComponent(
            newCourse.courseCode
          )}&title=${encodeURIComponent(
            newCourse.title
          )}&term=${term}&year=${year}`,
          { method: "POST" }
        );
        // console.log("✅ Added course from search to semester in backend");

        setTimeout(() => {
          stableRecheckAllPrereqs(updatedCourses);
        }, 100);
      } catch (error) {
        console.error("Error processing search course drop:", error);
      }
    } else if (courseCodeFromData && courseTitleFromData && !existingCourseId) {
      // console.warn("Dropped course with code/title but no existingId or searchCourseRaw. Logic may need extension.");
    }
  };

  const handleSaveCourse = async (
    id: string,
    newCourseCode: string,
    newTitle: string
  ) => {
    const updatedCourses = await new Promise<CourseItem[]>((resolve) => {
      setCourses((prev) => {
        const updated = prev.map((c) =>
          c.id === id
            ? {
                ...c,
                courseCode: newCourseCode,
                title: newTitle,
                isEditing: false,
              }
            : c
        );
        resolve(updated);
        return updated;
      });
    });

    const course = updatedCourses.find((c) => c.id === id);
    if (!course || !user?.id) return;

    const [term, year] = course.semesterId.split(" ");
    try {
      await fetch(
        `http://localhost:3232/add-course?uid=${
          user.id
        }&code=${encodeURIComponent(newCourseCode)}&title=${encodeURIComponent(
          newTitle
        )}&term=${term}&year=${year}`,
        { method: "POST" }
      );
      // console.log("✅ Saved/Updated course to backend:", newCourseCode);
      setTimeout(() => {
        stableRecheckAllPrereqs(updatedCourses);
      }, 100);
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  useEffect(() => {
    const handleRemoveCourseEvent = async (e: Event) => {
      const customEvent = e as CustomEvent;
      const { courseCode, semesterId } = customEvent.detail;
      if (!user?.id || !courseCode || !semesterId) return;

      const [term, year] = semesterId.split(" ");
      try {
        await fetch(
          `http://localhost:3232/remove-course?uid=${
            user.id
          }&code=${encodeURIComponent(courseCode)}&term=${term}&year=${year}`,
          { method: "POST" }
        );
        // console.log(`✅ Removed ${courseCode} from ${semesterId} on backend.`);
      } catch (err) {
        console.error("Error removing course from backend:", err);
      }

      let newCoursesState: CourseItem[] = [];
      setCourses((prevCourses) => {
        newCoursesState = prevCourses.filter(
          (c) => !(c.courseCode === courseCode && c.semesterId === semesterId)
        );
        return newCoursesState;
      });

      // Ensure state update completes before rechecking
      setTimeout(() => {
        stableRecheckAllPrereqs(newCoursesState);
      }, 0);
    };

    window.addEventListener("removeCourse", handleRemoveCourseEvent);
    return () =>
      window.removeEventListener("removeCourse", handleRemoveCourseEvent);
  }, [user?.id, stableRecheckAllPrereqs]);

  const handleAddSemesterBox = (
    position: "left" | "right",
    relativeToBoxId?: string
  ) => {
    const newBoxId = (
      Math.max(0, ...boxIds.map((id) => parseInt(id) || 0)) + 1
    ).toString();
    setBoxIds((prevBoxIds) => {
      if (!relativeToBoxId) {
        // Adding to the end (default for the "+" button)
        return [...prevBoxIds, newBoxId];
      }
      const index = prevBoxIds.indexOf(relativeToBoxId);
      if (index === -1) return [...prevBoxIds, newBoxId]; // Fallback: add to end

      const insertAtIndex = position === "left" ? index : index + 1;
      const newIds = [...prevBoxIds];
      newIds.splice(insertAtIndex, 0, newBoxId);
      return newIds;
    });
    if (position === "right" || !relativeToBoxId) {
      setTimeout(() => next(), 50); // Scroll to make new box visible if added to the right/end
    } else if (position === "left" && relativeToBoxId === boxIds[0]) {
      // If adding to the very left, no need to scroll with 'next'
    }
  };

  const handleDeleteSemesterBox = async (boxIdToDelete: string) => {
    const semesterToClear = boxSelections[boxIdToDelete];
    let coursesAfterDelete: CourseItem[] = courses;

    if (semesterToClear && user?.id) {
      // Remove all courses from this semester on backend
      const coursesInSemester = courses.filter(
        (c) => c.semesterId === semesterToClear
      );
      for (const course of coursesInSemester) {
        const [term, year] = semesterToClear.split(" ");
        try {
          await fetch(
            `http://localhost:3232/remove-course?uid=${
              user.id
            }&code=${encodeURIComponent(
              course.courseCode
            )}&term=${term}&year=${year}`,
            { method: "POST" }
          );
        } catch (err) {
          console.error("Error removing course during semester clear:", err);
        }
      }
      // Remove semester from backend
      const [term, year] = semesterToClear.split(" ");
      try {
        await fetch(
          `http://localhost:3232/remove-semester?uid=${user.id}&term=${term}&year=${year}`,
          { method: "POST" }
        );
      } catch (err) {
        console.error("Error removing semester from backend:", err);
      }

      coursesAfterDelete = courses.filter(
        (c) => c.semesterId !== semesterToClear
      );
      setCourses(coursesAfterDelete);
      setUsedSemesters((prev) => prev.filter((s) => s !== semesterToClear));
      setBoxSelections((prev) => {
        const newSelections = { ...prev };
        delete newSelections[boxIdToDelete];
        return newSelections;
      });
    }

    // Only remove the box if it's not the last one, or if it was empty.
    // If it's the last box and had content, it's now cleared. Don't remove the physical box.
    if (boxIds.length > 1) {
      setBoxIds((prevBoxIds) =>
        prevBoxIds.filter((id) => id !== boxIdToDelete)
      );
    } else if (boxIds.length === 1 && !semesterToClear) {
      // If it's the last box AND it was already empty (no semester selected),
      // there's no action to take on the box itself.
    }

    // console.log(`Processed deletion for box ${boxIdToDelete}, semester ${semesterToClear}.`);
    stableRecheckAllPrereqs(coursesAfterDelete);
  };

  const boxWidth = expanded ? 270 : 320;

  return (
    <div
      className={`carousel-outer-wrapper ${viewCount === 2 ? "two" : "four"}`}
    >
      <button
        className="carousel-button left"
        onClick={prev}
        disabled={currentIndex === 0}
      >
        ‹
      </button>
      <div className="carousel-inner-wrapper">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * boxWidth}px)`,
            transition: "transform 0.5s ease",
          }}
        >
          {boxIds.map((boxId) => (
            <SemesterBox
              key={boxId}
              boxId={boxId}
              selectedSemester={boxSelections[boxId] || ""}
              availableSemesters={getAvailableSemesters()}
              onSemesterSelect={handleSemesterSelect}
              onDragOver={courseDragManager.handleDragOver}
              onDrop={(e) => {
                if (boxSelections[boxId]) {
                  // Ensure semester is selected before drop
                  handleSemesterDrop(e, boxSelections[boxId]);
                } else {
                  // console.log("Drop ignored: No semester selected for target box " + boxId);
                }
              }}
              expanded={expanded}
              onRightClick={handleRightClick}
            >
              {boxSelections[boxId] &&
                courseDragManager
                  .getCoursesForSemester(boxSelections[boxId])
                  .map((course) => (
                    <CourseDrag
                      key={course.id}
                      id={course.id}
                      courseCode={course.courseCode}
                      courseTitle={course.title}
                      semesterId={boxSelections[boxId]}
                      isEmpty={false}
                      isEditing={course.isEditing}
                      onDragStart={courseDragManager.handleDragStart}
                      onDragEnd={courseDragManager.handleDragEnd}
                      onSaveCourse={handleSaveCourse}
                      prereqsMet={course.prereqsMet ?? false}
                      isCapstone={course.isCapstone ?? false}
                    />
                  ))}
              {boxSelections[boxId] && (
                <button
                  className="add-course-button"
                  onClick={() =>
                    courseDragManager.addCourse(
                      boxSelections[boxId],
                      undefined,
                      "new"
                    )
                  }
                >
                  + New course
                </button>
              )}
            </SemesterBox>
          ))}
          <div
            className={`add-box semester-box ${
              expanded ? "expanded" : "collapsed"
            }`}
            style={{ width: expanded ? "250px" : "300px" }}
          >
            <button
              className="add-button"
              onClick={() =>
                handleAddSemesterBox(
                  "right",
                  boxIds.length > 0 ? boxIds[boxIds.length - 1] : undefined
                )
              }
            >
              <div className="add-button-plus">+</div>
              <div>New Semester</div>
            </button>
          </div>
        </div>
        {menuPosition && selectedBoxId !== null && (
          <RightClickMenu
            className="right-click-menu-class"
            position={menuPosition}
            onAddRightSemester={() =>
              handleAddSemesterBox("right", selectedBoxId)
            }
            onAddLeftSemester={() =>
              handleAddSemesterBox("left", selectedBoxId)
            }
            onDeleteSemester={() => handleDeleteSemesterBox(selectedBoxId)}
          />
        )}
      </div>
      <button
        className="carousel-button right"
        onClick={next}
        disabled={currentIndex >= maxIndex}
      >
        ›
      </button>
    </div>
  );
}
