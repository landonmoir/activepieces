import { Property, createAction } from '@activepieces/pieces-framework';

import { canvasApiAssignmentSubmissions } from '../common';
import { canvasAuth } from '../../index';

export const getAssignmentSubmissions = createAction({
  name: 'get_assignment_submissions', // Must be a unique across the piece, this shouldn't be changed.
  auth: canvasAuth,
  displayName: 'Get Assignment Submissions',
  description: 'Get get submissions for an assignment',
  props: {
    // Properties to ask from the user, in this ask we will take number of
    course_id: Property.ShortText({
      displayName: 'Course Id',
      required: true,
    }),
    assignment_id: Property.ShortText({
      displayName: 'Assignment Id',
      required: true,
    }),
  },
  async run(context) {
    return await canvasApiAssignmentSubmissions(
      context.auth,
      context.propsValue.course_id,
      context.propsValue.assignment_id
    );
  },
});
