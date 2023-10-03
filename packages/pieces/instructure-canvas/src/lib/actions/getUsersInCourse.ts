import { Property, createAction } from '@activepieces/pieces-framework';

import { canvasApiCourseUsers } from '../common';
import { canvasAuth } from '../../index';

export const getUsersInCourse = createAction({
  name: 'get_users_in_course', // Must be a unique across the piece, this shouldn't be changed.
  auth: canvasAuth,
  displayName: 'Get Users in a Course',
  description: 'Get Users for a Course',
  props: {
    // Properties to ask from the user, in this ask we will take number of
    course_id: Property.ShortText({
      displayName: 'Course Id',
      required: true,
    }),
  },
  async run(context) {
    return await canvasApiCourseUsers(
      context.auth,
      context.propsValue.course_id
    );
  },
});
