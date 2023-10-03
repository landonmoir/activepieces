import { Property, createAction } from '@activepieces/pieces-framework';

import { canvasApiCourses } from '../common';
import { canvasAuth } from '../../index';

export const getCourses = createAction({
  name: 'get_courses', // Must be a unique across the piece, this shouldn't be changed.
  auth: canvasAuth,
  displayName: 'Get Courses',
  description: 'Get courses for a user',
  props: {
    // Properties to ask from the user, in this ask we will take number of
    enrollment_type: Property.StaticDropdown({
      displayName: 'Enrollment Type',
      description:
        'When set, only return courses where the user is enrolled as this type. For example, set to “teacher” to return only courses where the user is enrolled as a Teacher. This argument is ignored if enrollment_role is given.',
      required: false,
      options: {
        options: [
          {
            label: 'Teacher',
            value: 'teacher',
          },
          {
            label: 'Student',
            value: 'student',
          },
          {
            label: 'TA',
            value: 'ta',
          },
          {
            label: 'Observer',
            value: 'observer',
          },
          {
            label: 'Designer',
            value: 'designer',
          },
        ],
      },
    }),
    enrollment_state: Property.StaticDropdown({
      displayName: 'Enrollment State',
      description:
        'When set, only return courses where the user has an enrollment with the given state. This will respect section/course/term date overrides.        ',
      required: false,
      options: {
        options: [
          {
            label: 'Active',
            value: 'active',
          },
          {
            label: 'Invited or Pending',
            value: 'invited_or_pending',
          },
          {
            label: 'Completed',
            value: 'completed',
          },
        ],
      },
    }),
    exclude_blueprint_courses: Property.Checkbox({
      displayName: 'Exclude Blueprint Courses',
      description:
        'When set, only return courses that are not configured as blueprint courses.',
      required: false,
      defaultValue: false,
    }),
  },
  async run(context) {
    const params = {
      enrollment_type: context.propsValue.enrollment_type,
      enrollment_state: context.propsValue.enrollment_state,
      exclude_blueprint_courses: context.propsValue.exclude_blueprint_courses,
    };
    return await canvasApiCourses(context.auth, params);
  },
});
