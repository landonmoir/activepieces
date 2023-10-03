import { Property, createAction } from '@activepieces/pieces-framework';

import { canvasApiQuizzes } from '../common';
import { canvasAuth } from '../../index';

export const getQuizzes = createAction({
  name: 'get_quizzes', // Must be a unique across the piece, this shouldn't be changed.
  auth: canvasAuth,
  displayName: 'Get Quizzes',
  description: 'Get Quizzes for a Course',
  props: {
    // Properties to ask from the user, in this ask we will take number of
    search_term: Property.ShortText({
      displayName: 'Search Term',
      required: false,
    }),
    course_id: Property.ShortText({
      displayName: 'Course Id',
      required: true,
    }),
  },
  async run(context) {
    const params = {
      search_term: context.propsValue.search_term,
    };
    return await canvasApiQuizzes(
      context.auth,
      params,
      context.propsValue.course_id
    );
  },
});
