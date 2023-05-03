import { Course } from '../../courses/entities/course.entity';
import { Degree } from '../../degree/entities/degree.entity';
import { Level } from '../../levels/entities/level.entity';
import { School } from '../../schools/entities/school.entity';
import { StudyPlan } from '../../study-plans/entities/study-plan.entity';
import { Subject } from '../../subjects/entities/subject.entity';

export default {
  entities: [School, Course, Degree, Level, StudyPlan, Subject],
};
