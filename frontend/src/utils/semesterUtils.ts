/**
 * Utility functions for semester-related operations
 */

// Cache for semester availability to reduce API calls
const semesterAvailabilityCache: Record<string, string[]> = {};

/**
 * Checks if a course is offered in a given semester
 * @param courseCode - The course code to check
 * @returns Promise with array of offered semesters
 */
export async function getOfferedSemesters(
  courseCode: string
): Promise<string[]> {
  // Check cache first
  const cacheKey = courseCode.toUpperCase();
  if (semesterAvailabilityCache[cacheKey]) {
    console.log(`Using cached semester data for ${courseCode}`);
    return semesterAvailabilityCache[cacheKey];
  }

  try {
    console.log(`Fetching semester availability for ${courseCode}`);
    const response = await fetch(
      `http://localhost:3232/check-semester?courseCode=${encodeURIComponent(
        courseCode
      )}`
    );

    const data = await response.json();

    if (data.result === "success") {
      // Store in cache
      semesterAvailabilityCache[cacheKey] = data.offeredSemesters;
      return data.offeredSemesters;
    } else {
      console.error("Error checking semester availability:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Failed to check semester availability:", error);
    return [];
  }
}

/**
 * Checks if a course can be dropped in a semester
 * @param courseCode - The course code to check
 * @param targetSemester - The semester to check if course can be dropped
 * @returns Promise - Whether the course can be dropped in the semester
 */
export async function canDropInSemester(
  courseCode: string,
  targetSemester: string
): Promise<boolean> {
  // Invalid inputs
  if (!courseCode || !targetSemester) {
    return true; // Default to true for safety
  }

  const offeredSemesters = await getOfferedSemesters(courseCode);
  const canDrop = offeredSemesters.includes(targetSemester);

  console.log(
    `${courseCode} can${canDrop ? "" : "not"} be dropped in ${targetSemester}`
  );
  return canDrop;
}

/**
 * Clears the semester availability cache
 * Useful when refreshing data or after significant changes
 */
export function clearSemesterCache(): void {
  Object.keys(semesterAvailabilityCache).forEach((key) => {
    delete semesterAvailabilityCache[key];
  });
}
