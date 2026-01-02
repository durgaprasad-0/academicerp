/**
 * Admin Mock Service
 * Shared singleton instances of mock services to ensure state consistency across pages.
 */
import { 
  programs, branches, regulations, courses, faculty,
  programBranchMappings, branchCourseMappings, facultyCourseMappings,
  createMockCrud 
} from './mockData';

// Create singleton instances
export const programsService = createMockCrud(programs);
export const branchesService = createMockCrud(branches);
export const regulationsService = createMockCrud(regulations);
export const coursesService = createMockCrud(courses);
export const facultyService = createMockCrud(faculty);

// Mappings are a bit different as they are many-to-many usually, 
// but for standard CRUD they can use the same helper if structure allows.
// For the specific mapping pages, we might need custom logic, but let's expose CRUD for them too.
export const programBranchMapService = createMockCrud(programBranchMappings);
export const branchCourseMapService = createMockCrud(branchCourseMappings);
export const facultyCourseMapService = createMockCrud(facultyCourseMappings);

export default {
  programs: programsService,
  branches: branchesService,
  regulations: regulationsService,
  courses: coursesService,
  faculty: facultyService,
  programBranchMap: programBranchMapService,
  branchCourseMap: branchCourseMapService,
  facultyCourseMap: facultyCourseMapService
};
