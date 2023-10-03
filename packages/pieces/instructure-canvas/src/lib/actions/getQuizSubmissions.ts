import { Property, createAction } from '@activepieces/pieces-framework';

import { canvasApiQuizSubmissions } from '../common';
import { canvasAuth } from '../../index';

export const getQuizSubmissions = createAction({
  name: 'get_quiz_submissions', // Must be a unique across the piece, this shouldn't be changed.
  auth: canvasAuth,
  displayName: 'Get Quiz Submissions',
  description: 'Get Submissions for a Quiz',
  props: {
    // Properties to ask from the user, in this ask we will take number of
    course_id: Property.ShortText({
      displayName: 'Course Id',
      required: true,
    }),
    quiz_id: Property.ShortText({
      displayName: 'Quiz Id',
      required: true,
    }),
  },
  async run(context) {
    return await canvasApiQuizSubmissions(
      context.auth,
      context.propsValue.course_id,
      context.propsValue.quiz_id
    );
  },
});
