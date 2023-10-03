import { Property, createAction } from '@activepieces/pieces-framework';

import { canvasApiAssignments } from '../common';
import { canvasAuth } from '../../index';

export const getAssignments = createAction({
  name: 'get_assignments', // Must be a unique across the piece, this shouldn't be changed.
  auth: canvasAuth,
  displayName: 'Get Assignments',
  description: 'Get Assignments for a Course',
  props: {
    // Properties to ask from the user, in this ask we will take number of
    course_id: Property.ShortText({
      displayName: 'Course Id',
      required: true,
    }),
  },
  async run(context) {
    return await canvasApiAssignments(
      context.auth,
      context.propsValue.course_id
    );
  },
});
